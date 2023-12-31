import { ErrorObject } from 'ajv/lib/types';
import Fastify from 'fastify';

import App from 'app/src/app';
import { databaseManager } from 'components/DatabaseManager';
import { SystemTray } from 'components/SystemTray';
import { ApiStyle } from 'types/common';
import Config from 'plugins/config';
import { Logger, LogLevel } from 'types/Logger';
import { loginPrompt } from 'utils/script';

const fastify = Fastify({
  logger: {
    level: 'warn',
  },
});

async function main() {
  Logger.info('Config', `Loading server configs...`);

  await fastify.register(Config);

  fastify.register(App, fastify.config);

  if (!databaseManager.getModelType()) {
    databaseManager.setModelType(fastify.config.modelConfigs[0].modelType);
  }

  const systemTray = new SystemTray(
    databaseManager.getModelType()!,
    fastify.config.modelConfigs.map((modelConfig) => modelConfig.modelType),
  );

  systemTray.on('exitItemClick', async () => {
    await fastify.close();
  });

  systemTray.on('modelItemClick', async ({ modelType }) => {
    databaseManager.setModelType(modelType);
  });

  fastify.listen(
    {
      host: fastify.config.server.host,
      port: fastify.config.server.port,
    },
    (err: any) => {
      if (err) {
        fastify.log.error(err);
        fastify.close();
      }
    },
  );

  // noinspection HttpUrlsUsage
  Logger.info(
    'Config',
    `Server is listening on ` +
      LogLevel.info(
        `http://${fastify.config.server.host}:${fastify.config.server.port}`,
      ),
  );

  if (fastify.config.apiStyle == ApiStyle.Linseer) {
    if (!(await databaseManager.accessToken())) {
      await loginPrompt(fastify.config.userId);
    }
  }
}

main().catch((errors) => {
  if (errors instanceof Array) {
    errors.forEach((error: ErrorObject) => {
      Logger.error(
        'Config',
        'Invalid config item',
        LogLevel.warning(`${error.message}`) +
          (error.instancePath
            ? ' at ' + LogLevel.link(error.instancePath)
            : ''),
      );
    });
  } else {
    Logger.error('Config', errors);
  }
  fastify.close().then(
    () => Logger.success('Server', 'Successfully closed'),
    (err) => Logger.error('Server', 'Cannot close', err.message),
  );
});
