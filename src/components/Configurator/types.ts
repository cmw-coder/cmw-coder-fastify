import {
  ApiStyle,
  HuggingFaceModelType,
  LinseerModelType,
  SubModelType,
} from 'types/common';

export interface SeparateTokens {
  end: string;
  middle: string;
  start: string;
}

export interface HuggingFaceCompletionConfigType {
  contextLimit: number;
  endpoint: string;
  maxTokenCount: number;
  stopTokens: string[];
  suggestionCount: number;
  temperature: number;
}

export interface HuggingFaceModelConfigType {
  completionConfigs: {
    function: HuggingFaceCompletionConfigType;
    line: HuggingFaceCompletionConfigType;
    snippet: HuggingFaceCompletionConfigType;
  };
  modelType: HuggingFaceModelType;
  separateTokens: SeparateTokens;
}

export interface LinseerCompletionConfigType {
  contextLimit: number;
  maxTokenCount: number;
  stopTokens: string[];
  subModelType: SubModelType;
  suggestionCount: number;
  temperature: number;
}

export interface LinseerModelConfigType {
  completionConfigs: {
    function: LinseerCompletionConfigType;
    line: LinseerCompletionConfigType;
    snippet: LinseerCompletionConfigType;
  };
  endpoint: string;
  modelType: LinseerModelType;
}

export type ConfigType =
  | {
      apiStyle: ApiStyle.HuggingFace;
      modelConfigs: HuggingFaceModelConfigType[];
      server: {
        host: string;
        port: number;
      };
      statistics: string;
      userId: string;
    }
  | {
      apiStyle: ApiStyle.Linseer;
      modelConfigs: LinseerModelConfigType[];
      server: {
        host: string;
        port: number;
      };
      statistics: string;
      userId: string;
    };