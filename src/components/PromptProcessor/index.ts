import { createHash } from 'crypto';

import { ConfigType } from 'components/Configurator/types';
import { databaseManager } from 'components/DatabaseManager';
import { PromptComponents } from 'components/PromptExtractor/types';
import { LRUCache } from 'components/PromptProcessor/types';
import {
  checkIsSnippet,
  processHuggingFaceApi,
  processLinseerApi,
} from 'components/PromptProcessor/utils';
import { loginPrompt } from 'utils/script';
import { Logger } from 'types/Logger';
import { ApiStyle } from 'types/common';

export class PromptProcessor {
  private _cache = new LRUCache<string[]>(100);
  private readonly _config: ConfigType;

  constructor(config: ConfigType) {
    this._config = config;
  }

  async process(
    promptComponents: PromptComponents,
    prefix: string,
    projectId: string,
  ): Promise<string[]> {
    const cacheKey = createHash('sha1')
      .update(prefix.trimEnd())
      .digest('base64');
    const promptCached = this._cache.get(cacheKey);
    if (promptCached) {
      Logger.log('PromptProcessor.process.cached', promptCached);
      return promptCached;
    }

    const isSnippet = checkIsSnippet(prefix);
    let processedSuggestions: string[] = [];

    try {
      if (this._config.apiStyle === ApiStyle.HuggingFace) {
        processedSuggestions = await processHuggingFaceApi(
          this._config.modelConfigs.find(
            (modelConfig) =>
              modelConfig.modelType === databaseManager.getModelType(),
          ) ?? this._config.modelConfigs[0],
          promptComponents,
          isSnippet,
        );
      } else {
        let accessToken = await databaseManager.accessToken();
        if (!accessToken) {
          await loginPrompt(this._config.userId);
          accessToken = await databaseManager.accessToken();
        }

        processedSuggestions = await processLinseerApi(
          this._config.modelConfigs.find(
            (modelConfig) =>
              modelConfig.modelType === databaseManager.getModelType(),
          ) ?? this._config.modelConfigs[0],
          accessToken!,
          promptComponents,
          isSnippet,
          projectId,
        );
      }
    } catch (e) {
      Logger.warn('PromptProcessor.process.error', e);
    }
    Logger.log('PromptProcessor.process.normal', processedSuggestions);
    if (processedSuggestions.length) {
      this._cache.put(cacheKey, processedSuggestions);
    }
    return processedSuggestions;
  }
}
