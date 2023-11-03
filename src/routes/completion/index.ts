import { FastifyPluginAsync } from 'fastify';
import { decode, encode } from 'iconv-lite';

import { databaseManager } from 'components/DatabaseManager';
import { PromptExtractor } from 'components/PromptExtractor';
import { PromptProcessor } from 'components/PromptProcessor';
import {
  acceptSchema,
  acceptType,
  generateSchema,
  generateType,
} from 'routes/completion/schema';
import { parseEditorInfo } from 'routes/completion/utils';
import { TextDocument } from 'types/TextDocument';
import * as console from 'console';

export default <FastifyPluginAsync>(async (fastify): Promise<void> => {
  fastify.post<acceptType>(
    '/accept',
    { schema: acceptSchema },
    async (request) => {
      const startTime = Date.now();
      const { completion, projectId, version } = request.body;
      fastify.statistics.accept(
        completion,
        startTime,
        Date.now(),
        projectId,
        version,
      );
      return {
        result: 'success',
      };
    },
  );

  fastify.post<generateType>(
    '/generate',
    { schema: generateSchema },
    async (request) => {
      const startTime = Date.now();
      const { info, projectId, version } = request.body;
      const decodedInfo = decode(Buffer.from(info, 'base64'), 'gb2312');
      // console.log(decodedInfo);
      try {
        const {
          currentFilePath,
          cursorRange,
          openedTabs,
          symbols,
          prefix,
          suffix,
        } = parseEditorInfo(decodedInfo);
        fastify.statistics.updateCursor(cursorRange);
        const prompt = await new PromptExtractor(
          new TextDocument(currentFilePath),
          cursorRange.start,
        ).getPromptComp(openedTabs, symbols, prefix, suffix);
        const results = await new PromptProcessor(fastify.config).process(
          prompt,
          prefix,
        );
        if (results.length && results[0].length) {
          fastify.statistics
            .generate(results[0], startTime, Date.now(), projectId, version)
            .catch();
        }
        return {
          result: 'success',
          contents: results.map((result) =>
            encode(result, 'gb2312').toString('base64'),
          ),
          modelType:
            databaseManager.getModelType() ?? fastify.config.availableModels[0],
        };
      } catch (e) {
        console.warn(e);
        return { result: 'error', message: (<Error>e).message };
      }
    },
  );
});