import { Memory } from '@mastra/memory';
import { RequestContext } from '@mastra/core/request-context';
import { storage } from './storage';

export const memory = (requestContext: RequestContext<unknown>) => {
  const userId = requestContext?.get('userId') as string || 'anonymous';
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