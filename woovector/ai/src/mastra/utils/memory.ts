import { Memory } from '@mastra/memory';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { storage } from './storage.js';
import { ChatMessage } from '../types/index.js';


export const memory = (runtimeContext: RuntimeContext<Pick<ChatMessage, 'userId' | 'sessionId'>>) => {
  const userId = runtimeContext?.get('userId') || 'anonymous';
  const isAuthenticated = userId !== 'anonymous';

  return new Memory({
    storage,
    options: {
      lastMessages: 10,
      // Disable semantic recall until vector store is configured
      // semanticRecall: { topK: 10, messageRange: 5 },
      workingMemory: {
        enabled: true,
        scope: isAuthenticated ? 'resource' : 'thread',
        template: `# User Profile
                  - **Interests**:
                  - **Current Goal**:
                  - **Budget**:
                  - **Other Preferences**:
                  `
      }
    }
  });
};