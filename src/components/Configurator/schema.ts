import { userInfo } from 'os';
import { JSONSchemaType } from 'ajv';

import { ConfigType } from 'components/Configurator/types';
import {
  ApiStyle,
  HuggingFaceModelType,
  LinseerModelType,
  SubModelType,
} from 'types/common';

const HuggingFaceCompletionConfigSchema = {
  type: 'object',
  required: [
    'contextLimit',
    'endpoint',
    'maxTokenCount',
    'stopTokens',
    'suggestionCount',
    'temperature',
  ],
  additionalProperties: false,
  properties: {
    contextLimit: {
      type: 'number',
    },
    endpoint: {
      type: 'string',
    },
    maxTokenCount: {
      type: 'number',
    },
    stopTokens: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    suggestionCount: {
      type: 'number',
    },
    temperature: {
      type: 'number',
    },
  },
};

const LinseerCompletionConfigSchema = {
  type: 'object',
  required: [
    'contextLimit',
    'maxTokenCount',
    'stopTokens',
    'subModelType',
    'suggestionCount',
    'temperature',
  ],
  additionalProperties: false,
  properties: {
    contextLimit: {
      type: 'number',
    },
    maxTokenCount: {
      type: 'number',
    },
    stopTokens: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    subModelType: {
      type: 'string',
      enum: Object.values(SubModelType),
    },
    suggestionCount: {
      type: 'number',
    },
    temperature: {
      type: 'number',
    },
  },
};

export const ConfigSchema: Partial<JSONSchemaType<ConfigType>> = {
  type: 'object',
  required: ['apiStyle', 'modelConfigs', 'statistics'],
  additionalProperties: false,
  properties: {
    apiStyle: {
      type: 'string',
      enum: Object.values(ApiStyle),
    },
    configVersion: {
      type: 'number',
      const: 2,
    },
    modelConfigs: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['completionConfigs', 'modelType', 'separateTokens'],
            additionalProperties: false,
            properties: {
              completionConfigs: {
                type: 'object',
                required: ['function', 'line', 'snippet'],
                additionalProperties: false,
                patternProperties: {
                  function: HuggingFaceCompletionConfigSchema,
                  line: HuggingFaceCompletionConfigSchema,
                  snippet: HuggingFaceCompletionConfigSchema,
                },
              },
              modelType: {
                type: 'string',
                enum: Object.keys(HuggingFaceModelType),
              },
              separateTokens: {
                type: 'object',
                required: ['end', 'middle', 'start'],
                properties: {
                  end: {
                    type: 'string',
                  },
                  middle: {
                    type: 'string',
                  },
                  start: {
                    type: 'string',
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['completionConfigs', 'endpoint', 'modelType'],
            additionalProperties: false,
            properties: {
              completionConfigs: {
                type: 'object',
                required: ['function', 'line', 'snippet'],
                additionalProperties: false,
                properties: {
                  function: LinseerCompletionConfigSchema,
                  line: LinseerCompletionConfigSchema,
                  snippet: LinseerCompletionConfigSchema,
                },
              },
              endpoint: {
                type: 'string',
              },
              modelType: {
                type: 'string',
                enum: Object.keys(LinseerModelType),
              },
            },
          },
        ],
      },
    },
    server: {
      type: 'object',
      required: [],
      additionalProperties: false,
      properties: {
        host: {
          type: 'string',
          default: 'localhost',
        },
        port: {
          type: 'number',
          default: 3000,
        },
      },
    },
    statistics: {
      type: 'string',
    },
    userId: {
      type: 'string',
      default: userInfo().username,
    },
  },
};
