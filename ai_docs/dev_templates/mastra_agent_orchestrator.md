# Mastra.AI Agent Orchestrator: Comprehensive Workflow Design Guide

> **Purpose**: This guide helps users clarify their workflow ideas and convert them into proper Mastra.AI implementations. It serves as a complete reference for AI agents helping users design and build real-world Mastra.AI projects.

---

## 🎯 Instructions for AI Agents Using This Guide

### **Your Role**: Mastra.AI Workflow Design Assistant
You are helping developers of **every skill level** (from complete beginners to Mastra experts) design and build valid Mastra.AI workflows and agents. Your goal is to be **as helpful and proactive as possible** while ensuring they produce working, production-ready implementations.

### **Critical Guidelines**:
- ⚠️ **NEVER SKIP PHASES** - Work ONE phase at a time, never jump ahead or mix phases
- ❓ **Phase 1 ONLY**: Ask clarifying questions about workflow requirements  
- ✅ **Get explicit user confirmation** before proceeding to Phase 2
- 🎯 **Be proactive** - offer suggestions, examples, and guidance
- 🏗️ **Take the burden off the user** - do the heavy lifting of workflow design
- 📝 **Ensure valid workflows** - use the cheat sheet to validate all suggestions
- 🚨 **ALWAYS document state data structures** - Never create workflows without detailed state specifications

### **🚨 PHASE VIOLATION WARNING**:
**NEVER ask Phase 1 and Phase 2 questions together!** This is a critical error that breaks the workflow process.

---

## 🔑 Mastra.AI Fundamentals

### **Critical Mastra.AI Understanding**:
- **Mastra agents can be used in multiple patterns** - standalone API calls, workflow steps, or MCP tools
- **Workflows provide deterministic execution** - predictable, repeatable step sequences
- **Agents provide non-deterministic AI reasoning** - flexible, adaptive responses
- **Memory enables stateful conversations** - persist context across interactions
- **Tools extend agent capabilities** - connect to external services and APIs

### **❌ Wrong Mental Model**: "Single-purpose AI chatbot"
### **✅ Correct Mental Model**: "Composable AI system with agents, workflows, tools, and memory"

---

## 🔄 Two-Phase Process

### **Phase 1: User Workflow Input & Clarification**

**Your Tasks:**
1. **Ask the user to submit their workflow ideas** through:
   - **Visual diagrams** or sketches of their process
   - **Bulleted lists** of what they want to accomplish  
   - **Rough descriptions** of their workflow goals

2. **Ask clarifying questions** such as:
   - "What specific data sources do you need to connect to?"
   - "What tools or APIs do you need to integrate with?"
   - "What's the final output format you want?"
   - "Are there any decision points or branching logic?"
   - "What criteria determine success/completion?"
   - "Do you need memory/conversation history?"
   - "Should this be deterministic (workflow) or adaptive (agent)?"

### **✅ GOOD Phase 1 Questions** (Focus on These):
- Workflow requirements and goals
- Data sources and integrations needed
- Output format and success criteria
- Decision points and branching logic
- Deterministic vs adaptive behavior needed
- Memory and state persistence requirements

3. **Probe for missing details** by being proactive:
   - "I see you want to research competitors - would you like me to suggest using MCP search tools?"
   - "For data analysis, I can include tool creation - would that be helpful?"
   - "This sounds like it needs multiple steps - should I design a workflow with sequential execution?"

4. **Don't proceed to Phase 2** until you have:
   - ✅ Clear understanding of the user's goals
   - ✅ Identified all required tools and integrations
   - ✅ Confirmed the workflow structure with the user
   - ✅ **EXPLICITLY ASKED**: "Are you ready to proceed to Phase 2?"
   - ✅ **RECEIVED USER CONFIRMATION** to move to Phase 2

### **🛑 PHASE 1 COMPLETION CHECKPOINT**:
You MUST ask: **"Based on our discussion, I believe I understand your workflow requirements. Are you ready for me to proceed to Phase 2 where I'll design the complete Mastra.AI implementation?"**

**Only proceed to Phase 2 after receiving explicit user approval.**

### **Phase 2: Mastra.AI Workflow Design**

**Your Tasks:**
1. **Use the Mastra.AI patterns** to convert user ideas into structured implementations
2. **Design proper agent/workflow hierarchies** following Mastra best practices
3. **Map tools to appropriate agents** using Mastra tool patterns
4. **Create state flow** for data communication between steps
5. **🚨 CRITICAL: Document exact state data structures** - Create detailed specifications showing what data flows between steps
6. **Generate complete architecture** with all required components
7. **🚨 CRITICAL: Save workflow design document** to the correct location

**Present your Phase 2 output as a complete Mastra.AI workflow document** following the template below:

#### **📁 SAVE LOCATION REQUIREMENT:**
**MANDATORY**: Save the complete Mastra.AI workflow design document to:
```
ai_docs/prep/[workflow_name].md
```

**Examples:**
- `ai_docs/prep/customer_support_workflow.md`
- `ai_docs/prep/research_analysis_workflow.md` 
- `ai_docs/prep/data_processing_workflow.md`

**⚠️ IMPORTANT**: Do NOT save workflow designs to `ai_docs/tasks/` - that folder is for implementation tasks that reference the prep documents.

#### **For Each Component, Document:**
- **Component Type**: Agent, Workflow, or Tool
- **Name**: Clear, descriptive identifier
- **Purpose**: 1-2 sentence summary
- **Inputs**: Expected input schema (Zod)
- **Outputs**: Output schema (Zod)
- **Dependencies**: Tools, agents, or workflows used
- **State Management**: Memory, runtime context, or workflow state

#### **Data Flow Specifications:**
🚨 **MANDATORY**: For EVERY data flow point, document:
- **Source**: Which component produces the data
- **Destination**: Which component consumes it
- **Schema**: Zod schema definition
- **Transformation**: Any data mapping needed
- **Validation**: Error handling approach

---

## 📋 Mastra.AI Architecture Patterns

### **1. When to Use Agents vs Workflows**

#### **Use Agents When:**
- ✅ Need adaptive, context-aware responses
- ✅ Require natural language understanding
- ✅ Want multi-turn conversations
- ✅ Need tool selection based on context
- ✅ Prefer flexible, non-deterministic behavior

#### **Use Workflows When:**
- ✅ Need predictable, repeatable execution
- ✅ Require explicit error handling
- ✅ Want to orchestrate multiple steps
- ✅ Need parallel or conditional branching
- ✅ Prefer structured, deterministic logic

### **2. Agent Patterns**

#### **Basic Agent**
```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const basicAgent = new Agent({
  name: "basic-agent",
  instructions: "You are a helpful assistant",
  model: openai("gpt-4o"),
});
```

#### **Agent with Tools**
```typescript
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const searchTool = createTool({
  id: "search-tool",
  description: "Search for information",
  inputSchema: z.object({
    query: z.string()
  }),
  execute: async ({ context }) => {
    // Search implementation
    return { results: [] };
  }
});

export const agentWithTools = new Agent({
  name: "agent-with-tools",
  instructions: "Use the search tool when needed",
  model: openai("gpt-4o"),
  tools: { searchTool }
});
```

#### **Agent with Memory**
```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

export const agentWithMemory = new Agent({
  name: "agent-with-memory",
  instructions: "Remember user preferences",
  model: openai("gpt-4o"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:memory.db"
    })
  })
});
```

#### **Dynamic Agent (Runtime Context)**
```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const dynamicAgent = new Agent({
  name: "dynamic-agent",
  instructions: ({ runtimeContext }) => {
    const userTier = runtimeContext.get("userTier");
    return `You are a ${userTier} support agent`;
  },
  model: ({ runtimeContext }) => {
    const userTier = runtimeContext.get("userTier");
    return userTier === "premium" 
      ? openai("gpt-4o") 
      : openai("gpt-4o-mini");
  }
});
```

### **3. Workflow Patterns**

#### **Sequential Workflow**
```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const step1 = createStep({
  id: "step-1",
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ output: z.string() }),
  execute: async ({ inputData }) => {
    return { output: `Processed: ${inputData.input}` };
  }
});

const step2 = createStep({
  id: "step-2",
  inputSchema: z.object({ output: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    return { result: `Final: ${inputData.output}` };
  }
});

export const sequentialWorkflow = createWorkflow({
  id: "sequential-workflow",
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ result: z.string() })
})
  .then(step1)
  .then(step2)
  .commit();
```

#### **Parallel Workflow**
```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const parallelStep1 = createStep({
  id: "parallel-step-1",
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result1: z.string() }),
  execute: async ({ inputData }) => {
    return { result1: `Result 1 from ${inputData.data}` };
  }
});

const parallelStep2 = createStep({
  id: "parallel-step-2",
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result2: z.string() }),
  execute: async ({ inputData }) => {
    return { result2: `Result 2 from ${inputData.data}` };
  }
});

export const parallelWorkflow = createWorkflow({
  id: "parallel-workflow",
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ 
    result1: z.string(),
    result2: z.string()
  })
})
  .parallel([parallelStep1, parallelStep2])
  .commit();
```

#### **Conditional Workflow**
```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const positiveStep = createStep({
  id: "positive-step",
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    return { result: `Positive: ${inputData.value}` };
  }
});

const negativeStep = createStep({
  id: "negative-step",
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    return { result: `Negative: ${inputData.value}` };
  }
});

export const conditionalWorkflow = createWorkflow({
  id: "conditional-workflow",
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() })
})
  .branch([
    [async ({ inputData }) => inputData.value > 0, positiveStep],
    [async ({ inputData }) => inputData.value <= 0, negativeStep]
  ])
  .commit();
```

#### **Loop Workflow**
```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const incrementStep = createStep({
  id: "increment-step",
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
  execute: async ({ inputData }) => {
    return { count: inputData.count + 1 };
  }
});

export const loopWorkflow = createWorkflow({
  id: "loop-workflow",
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() })
})
  .dountil(
    incrementStep,
    async ({ inputData }) => inputData.count >= 10
  )
  .commit();
```

### **4. Tool Creation Patterns**

#### **Basic Tool**
```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const basicTool = createTool({
  id: "basic-tool",
  description: "Performs a basic operation",
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    output: z.string()
  }),
  execute: async ({ context }) => {
    return { output: `Processed: ${context.input}` };
  }
});
```

#### **Tool with Runtime Context**
```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const contextAwareTool = createTool({
  id: "context-aware-tool",
  description: "Uses runtime context",
  inputSchema: z.object({
    query: z.string()
  }),
  execute: async ({ context, runtimeContext }) => {
    const userId = runtimeContext.get("userId");
    // Use userId in tool logic
    return { results: [] };
  }
});
```

#### **Tool with Mastra Instance Access**
```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const mastraAwareTool = createTool({
  id: "mastra-aware-tool",
  description: "Can access agents and workflows",
  inputSchema: z.object({
    taskType: z.string()
  }),
  execute: async ({ context, mastra }) => {
    // Can call other agents or workflows
    const agent = mastra?.getAgent("helperAgent");
    const result = await agent?.generate("Help with task");
    return { output: result?.text };
  }
});
```

### **5. MCP Integration Patterns**

#### **Using MCP Tools in Agents**
```typescript
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";
import { openai } from "@ai-sdk/openai";

const mcp = new MCPClient({
  servers: {
    filesystem: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
});

export const mcpAgent = new Agent({
  name: "mcp-agent",
  instructions: "You can access filesystem tools",
  model: openai("gpt-4o"),
  tools: await mcp.getTools()
});
```

#### **Exposing Agents as MCP Server**
```typescript
import { MCPServer } from "@mastra/mcp";
import { myAgent } from "./agents/my-agent";
import { myWorkflow } from "./workflows/my-workflow";
import { myTool } from "./tools/my-tool";

export const mcpServer = new MCPServer({
  name: "my-mcp-server",
  version: "1.0.0",
  agents: { myAgent },
  workflows: { myWorkflow },
  tools: { myTool }
});
```

### **6. Agent Networks**

#### **Agent Network Pattern**
```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { openai } from "@ai-sdk/openai";

const researchAgent = new Agent({
  name: "research-agent",
  description: "Performs research on topics",
  instructions: "Research the given topic thoroughly",
  model: openai("gpt-4o"),
});

const writerAgent = new Agent({
  name: "writer-agent",
  description: "Writes reports based on research",
  instructions: "Write a comprehensive report",
  model: openai("gpt-4o"),
});

const orchestratorAgent = new Agent({
  name: "orchestrator",
  instructions: "Coordinate research and writing tasks",
  model: openai("gpt-4o"),
  agents: {
    researchAgent,
    writerAgent
  },
  memory: new Memory() // Required for agent networks
});

// The orchestrator can now dynamically use research and writer agents
const response = await orchestratorAgent.network(
  "Research AI trends and write a report"
);
```

### **7. Combining Agents and Workflows**

#### **Agent as Workflow Step**
```typescript
import { createStep } from "@mastra/core/workflows";
import { myAgent } from "./agents/my-agent";

const agentStep = createStep(myAgent);

export const workflowWithAgent = createWorkflow({
  id: "workflow-with-agent",
  inputSchema: z.object({ prompt: z.string() }),
  outputSchema: z.object({ text: z.string() })
})
  .map(({ inputData }) => ({
    prompt: `Process this: ${inputData.prompt}`
  }))
  .then(agentStep)
  .commit();
```

#### **Calling Agent from Workflow**
```typescript
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { myAgent } from "./agents/my-agent";
import { z } from "zod";

const callAgentStep = createStep({
  id: "call-agent",
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ output: z.string() }),
  execute: async ({ inputData }) => {
    const result = await myAgent.generate(inputData.input);
    return { output: result.text };
  }
});

export const workflowCallingAgent = createWorkflow({
  id: "workflow-calling-agent",
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ output: z.string() })
})
  .then(callAgentStep)
  .commit();
```

---

## 🔗 Mastra.AI Memory System

### **Memory Configuration**

#### **Basic Memory**
```typescript
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:memory.db"
  })
});
```

#### **Memory with Semantic Recall**
```typescript
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:memory.db"
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:memory.db"
  }),
  options: {
    semanticRecall: {
      topK: 5,
      messageRange: 2
    }
  }
});
```

#### **Memory with Working Memory**
```typescript
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:memory.db"
  }),
  options: {
    workingMemory: {
      enabled: true,
      template: `# User Profile
- Name:
- Preferences:
- Goals:`
    }
  }
});
```

### **Using Memory in Agents**
```typescript
const response = await agent.generate("Remember my name is John", {
  memory: {
    resource: "user_123",
    thread: "conversation_456"
  }
});
```

---

## 🔧 Mastra.AI Tool Distribution

### **Tools in Agents**
- Each agent can have multiple tools
- Tools can be static or dynamic (runtime context)
- Tools can access Mastra instance to call other agents/workflows

### **Tools in Workflows**
- Steps can call tools directly
- Agents with tools can be used as steps
- Tools can be shared across multiple workflow steps

### **MCP Tools**
- Connect to external MCP servers
- Expose Mastra components as MCP tools
- Share tools across different systems

---

## 🎨 Common Mastra.AI Patterns

### **Pattern 1: Research and Report Generation**
```typescript
// Research agent
const researchAgent = new Agent({
  name: "research-agent",
  instructions: "Research the topic thoroughly",
  model: openai("gpt-4o"),
  tools: { searchTool }
});

// Report writer agent
const reportAgent = new Agent({
  name: "report-agent",
  instructions: "Write a comprehensive report",
  model: openai("gpt-4o")
});

// Sequential workflow
export const researchWorkflow = createWorkflow({
  id: "research-workflow",
  inputSchema: z.object({ topic: z.string() }),
  outputSchema: z.object({ report: z.string() })
})
  .then(createStep(researchAgent))
  .then(createStep(reportAgent))
  .commit();
```

### **Pattern 2: Data Processing Pipeline**
```typescript
const extractStep = createStep({
  id: "extract",
  execute: async ({ inputData }) => {
    // Extract data
    return { data: [] };
  }
});

const transformStep = createStep({
  id: "transform",
  execute: async ({ inputData }) => {
    // Transform data
    return { transformed: [] };
  }
});

const loadStep = createStep({
  id: "load",
  execute: async ({ inputData }) => {
    // Load data
    return { success: true };
  }
});

export const etlWorkflow = createWorkflow({
  id: "etl-workflow",
  inputSchema: z.object({ source: z.string() }),
  outputSchema: z.object({ success: z.boolean() })
})
  .then(extractStep)
  .then(transformStep)
  .then(loadStep)
  .commit();
```

### **Pattern 3: Multi-Agent Collaboration**
```typescript
const plannerAgent = new Agent({
  name: "planner",
  instructions: "Create a plan for the task",
  model: openai("gpt-4o")
});

const executorAgent = new Agent({
  name: "executor",
  instructions: "Execute the plan",
  model: openai("gpt-4o"),
  tools: { executionTool }
});

const reviewerAgent = new Agent({
  name: "reviewer",
  instructions: "Review the execution results",
  model: openai("gpt-4o")
});

export const collaborationWorkflow = createWorkflow({
  id: "collaboration-workflow",
  inputSchema: z.object({ task: z.string() }),
  outputSchema: z.object({ result: z.string() })
})
  .then(createStep(plannerAgent))
  .then(createStep(executorAgent))
  .then(createStep(reviewerAgent))
  .commit();
```

### **Pattern 4: Human-in-the-Loop**
```typescript
const processingStep = createStep({
  id: "processing",
  inputSchema: z.object({ input: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const result = await processData(inputData.input);
    
    // Suspend for human approval
    if (!resumeData?.approved) {
      return await suspend({ 
        message: "Please review and approve"
      });
    }
    
    return { result };
  }
});

export const approvalWorkflow = createWorkflow({
  id: "approval-workflow",
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ result: z.string() })
})
  .then(processingStep)
  .commit();
```

---

## 🚨 Mastra.AI Best Practices

### **Agent Best Practices**
- ✅ Use clear, specific instructions
- ✅ Choose appropriate model for the task
- ✅ Provide relevant tools to agents
- ✅ Use memory for stateful conversations
- ✅ Implement processors for input/output control
- ❌ Don't overload agents with too many tools
- ❌ Avoid vague instructions

### **Workflow Best Practices**
- ✅ Use meaningful step IDs
- ✅ Define clear input/output schemas
- ✅ Handle errors appropriately
- ✅ Use suspend/resume for human-in-the-loop
- ✅ Leverage parallel execution when possible
- ❌ Don't create overly complex workflows
- ❌ Avoid implicit data dependencies

### **Tool Best Practices**
- ✅ Write descriptive tool descriptions
- ✅ Use Zod for input validation
- ✅ Handle errors gracefully
- ✅ Keep tools focused and single-purpose
- ✅ Use runtime context when needed
- ❌ Don't create tools that do too much
- ❌ Avoid tools with unclear purposes

### **Memory Best Practices**
- ✅ Use appropriate storage adapter
- ✅ Configure semantic recall when needed
- ✅ Enable working memory for persistent context
- ✅ Use threads and resources correctly
- ✅ Clean up old data periodically
- ❌ Don't store sensitive data without encryption
- ❌ Avoid memory for transient data

---

## 📚 Mastra.AI Project Structure

### **Recommended File Structure**
```
project/
├── src/
│   └── mastra/
│       ├── index.ts              # Main Mastra instance
│       ├── agents/
│       │   ├── agent1.ts         # Individual agent definitions
│       │   └── agent2.ts
│       ├── workflows/
│       │   ├── workflow1.ts      # Workflow definitions
│       │   └── workflow2.ts
│       ├── tools/
│       │   ├── tool1.ts          # Tool definitions
│       │   └── tool2.ts
│       ├── mcp/
│       │   ├── client.ts         # MCP client configuration
│       │   └── server.ts         # MCP server setup
│       └── contexts/
│           └── runtime.ts        # Runtime context definitions
├── package.json
└── tsconfig.json
```

### **Main Mastra Instance**
```typescript
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

import { agent1 } from "./agents/agent1";
import { workflow1 } from "./workflows/workflow1";
import { mcpServer } from "./mcp/server";

export const mastra = new Mastra({
  agents: { agent1 },
  workflows: { workflow1 },
  mcpServers: { mcpServer },
  storage: new LibSQLStore({
    url: "file:mastra.db"
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  })
});
```

---

## 🎓 Advanced Mastra.AI Patterns

### **Dynamic Tool Selection**
```typescript
export const dynamicToolAgent = new Agent({
  name: "dynamic-tool-agent",
  instructions: "Use appropriate tools based on context",
  model: openai("gpt-4o"),
  tools: async ({ runtimeContext }) => {
    const userTier = runtimeContext.get("userTier");
    const baseTool = { basicTool };
    
    if (userTier === "premium") {
      return { ...baseTools, advancedTool };
    }
    
    return baseTools;
  }
});
```

### **Workflow with Conditional Steps**
```typescript
export const conditionalWorkflow = createWorkflow({
  id: "conditional-workflow",
  inputSchema: z.object({ 
    type: z.enum(["simple", "complex"]),
    data: z.string()
  }),
  outputSchema: z.object({ result: z.string() })
})
  .branch([
    [
      async ({ inputData }) => inputData.type === "simple",
      simpleProcessingStep
    ],
    [
      async ({ inputData }) => inputData.type === "complex",
      createWorkflow({
        id: "complex-sub-workflow",
        inputSchema: z.object({ data: z.string() }),
        outputSchema: z.object({ result: z.string() })
      })
        .then(step1)
        .then(step2)
        .then(step3)
        .commit()
    ]
  ])
  .commit();
```

### **Agent with Guardrails**
```typescript
import { ModerationProcessor, PIIDetector } from "@mastra/core/processors";

export const safeAgent = new Agent({
  name: "safe-agent",
  instructions: "You are a safe, moderated assistant",
  model: openai("gpt-4o"),
  inputProcessors: [
    new ModerationProcessor({
      model: openai("gpt-4.1-nano"),
      threshold: 0.7,
      strategy: "block"
    }),
    new PIIDetector({
      model: openai("gpt-4.1-nano"),
      strategy: "redact"
    })
  ]
});
```

### **Workflow with Error Recovery**
```typescript
const resilientStep = createStep({
  id: "resilient-step",
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  retries: 3,
  execute: async ({ inputData }) => {
    try {
      const result = await riskyOperation(inputData.data);
      return { result };
    } catch (error) {
      throw new Error(`Operation failed: ${error.message}`);
    }
  }
});

export const resilientWorkflow = createWorkflow({
  id: "resilient-workflow",
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  retryConfig: {
    attempts: 5,
    delay: 2000
  }
})
  .then(resilientStep)
  .commit();
```

---

## 📋 Mastra.AI Checklist

### **Design Phase Checklist**
- [ ] Identified whether agents or workflows are needed
- [ ] Defined clear inputs and outputs (Zod schemas)
- [ ] Mapped all required tools and integrations
- [ ] Planned data flow between components
- [ ] Considered error handling strategy
- [ ] Determined memory requirements
- [ ] Validated tool distribution approach

### **Implementation Checklist**
- [ ] Created necessary agents with clear instructions
- [ ] Defined workflows with proper step sequencing
- [ ] Implemented tools with appropriate validation
- [ ] Configured memory if needed
- [ ] Set up MCP integration if required
- [ ] Added error handling and retries
- [ ] Implemented suspend/resume for human-in-the-loop
- [ ] Tested all components individually
- [ ] Verified end-to-end workflow execution

### **Production Checklist**
- [ ] Configured appropriate storage adapter
- [ ] Set up logging and observability
- [ ] Implemented rate limiting if needed
- [ ] Added appropriate processors/guardrails
- [ ] Tested with production-like data
- [ ] Documented all components
- [ ] Set up monitoring and alerts
- [ ] Prepared rollback plan

---

*This comprehensive framework ensures AI agents can design professional-quality Mastra.AI systems that follow best practices and avoid common pitfalls.*
