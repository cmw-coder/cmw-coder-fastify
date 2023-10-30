import Ajv from 'ajv';
import fastifyPlugin from 'fastify-plugin';
import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { parse } from 'toml';
import * as process from 'process';

const json2toml = require('json2toml');
const ajv = new Ajv();

export type ModelType = 'CMW' | 'CodeLlama';

export interface ConfigType {
  endpoint: string;
  promptExtractor: {
    contextLimit: number;
  };
  promptProcessor: {
    maxNewTokens: {
      line: number;
      snippet: number;
    };
    separateTokens: {
      end: string;
      middle: string;
      start: string;
    };
    stopTokens: string[];
    suggestionCount: number;
    temperature: number;
  };
  server: {
    host: string;
    port: number;
  };
  suggestionProcessor: {
    stopTokens: string[];
  };
  systemTray: {
    model: ModelType;
  };
}

const validate = ajv.compile({
  type: 'object',
  properties: {
    endpoint: {
      type: 'string',
      default: 'http://10.113.36.104',
    },
    promptExtractor: {
      type: 'object',
      properties: {
        contextLimit: {
          type: 'number',
          default: 1500,
        },
      },
    },
    promptProcessor: {
      type: 'object',
      properties: {
        maxNewTokens: {
          type: 'object',
          properties: {
            line: {
              type: 'number',
              default: 60,
            },
            snippet: {
              type: 'number',
              default: 512,
            },
          },
        },
        separateTokens: {
          type: 'object',
          properties: {
            end: {
              type: 'string',
              default: '<fim_suffix>',
            },
            middle: {
              type: 'string',
              default: '<fim_middle>',
            },
            start: {
              type: 'string',
              default: '<fim_prefix>',
            },
          },
        },
        stopTokens: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: ['<fim_pad>', '<|endoftext|>'],
        },
        suggestionCount: {
          type: 'number',
          default: 1,
          minimum: 1,
          maximum: 10,
        },
        temperature: {
          type: 'number',
          default: 0.2,
          minimum: 0,
          maximum: 1,
        },
      },
    },
    server: {
      type: 'object',
      properties: {
        host: {
          type: 'string',
          default: 'localhost',
        },
        port: {
          type: 'number',
          default: 3000,
          minimum: 0,
          maximum: 65535,
        },
      },
    },
    suggestionProcessor: {
      type: 'object',
      properties: {
        stopTokens: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: ['<fim_pad>', '<|endoftext|>'],
        },
      },
    },
    systemTray: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          default: 'CMW',
        },
      },
    },
  },
});

let config: ConfigType;

export const updateConfig = (newConfig: Partial<ConfigType>) => {
  config = {
    ...config,
    ...newConfig,
  };
  writeFileSync(
    resolve(join(process.cwd(), 'config.toml')),
    json2toml(config, { newlineAfterSection: true }),
  );
  return config;
};

export default fastifyPlugin(async (fastify) => {
  config = parse(
    readFileSync(resolve(join(process.cwd(), 'config.toml'))).toString(),
  );

  if (validate(config)) {
    fastify.config = config;
  } else {
    throw validate.errors;
  }

  fastify.updateConfig = (newConfig: Partial<ConfigType>) => {
    fastify.config = updateConfig(newConfig);
  };
});

declare module 'fastify' {
  // noinspection JSUnusedGlobalSymbols
  interface FastifyInstance {
    config: ConfigType;
    updateConfig: (newConfig: Partial<ConfigType>) => void;
  }
}
