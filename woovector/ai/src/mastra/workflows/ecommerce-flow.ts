import { Step, Workflow, createWorkflow } from "@mastra/core/workflows";
import { customerInputSchema } from "../schemas/customer-input-schema";
import { customerOutputSchema } from "../schemas/customer-output-schema";
import { receiveMessageStep } from "../steps/receive-message-step";
import { classifyIntentStep } from "../steps/classify-intent-step";
import { companyInfoStep } from "../steps/company-info-step";
import { productSearchStep } from "../steps/product-search-step";
import { productRecommendationStep } from "../steps/product-recommendation-step";
import { contextStep } from "../steps/context-step";
import { IntentResult } from "../types";
import { unsafeResponseStep } from "../steps/unsafe-response-step";
import { z } from "zod";

// Helper function to extract and filter specific intent from classification
const createIntentFilterWorkflow = (
  intentType: string,
  step: Step<string, unknown, { classification: string; }, { response: string; }>,
  workflowId: string
) => {
  return createWorkflow({
    id: workflowId,
    inputSchema: z.object({
      classification: z.string()
    }),
    outputSchema: step.outputSchema
  })
    .map(async ({ inputData }) => {
      const classifiedResponse: IntentResult[] = JSON.parse(inputData.classification);

      // Filter only the relevant intent for this step
      const relevantIntent = classifiedResponse.find(
        (item: IntentResult) => item.intent === intentType
      );

      return {
        classification: JSON.stringify(relevantIntent)
      };
    })
    .then(step)
    .commit();
};

const companyInfoFlow = createIntentFilterWorkflow(
  'company_info',
  companyInfoStep,
  'company_info_flow'
);

const productSearchFlow = createIntentFilterWorkflow(
  'search_product',
  productSearchStep,
  'product_search_flow'
);

const productRecommendationFlow = createIntentFilterWorkflow(
  'product_recommendation',
  productRecommendationStep,
  'product_recommendation_flow'
);

const contextFlow = createIntentFilterWorkflow(
  'context_reference',
  contextStep,
  'context_flow'
);

const unsafeFlow = createIntentFilterWorkflow(
  'off_topic_suspicious',
  unsafeResponseStep,
  'unsafe_flow'
);

export const ecommerceFlow = new Workflow({
  id: 'ecommerce_flow',
  inputSchema: customerInputSchema,
  outputSchema: customerOutputSchema
})
  .then(receiveMessageStep)
  .map(async ({ inputData, getInitData }) => {
    const { message } = inputData;

    const originalInput = getInitData<any>();

    const messageToClassify = message === 'safe' ? originalInput.message : 'unsafe';

    return {
      message: messageToClassify
    };
  })
  .then(classifyIntentStep)
  .branch([
    [async ({ inputData: { classification } }) => {
      const classifiedResponse = JSON.parse(classification);
      return classifiedResponse.some((item: IntentResult) => item.intent === 'company_info');
    }, companyInfoFlow],

    [async ({ inputData: { classification } }) => {
      const classifiedResponse = JSON.parse(classification);
      return classifiedResponse.some((item: IntentResult) => item.intent === 'search_product');
    }, productSearchFlow],

    [async ({ inputData: { classification } }) => {
      const classifiedResponse = JSON.parse(classification);
      return classifiedResponse.some((item: IntentResult) => item.intent === 'product_recommendation');
    }, productRecommendationFlow],

    [async ({ inputData: { classification } }) => {
      const classifiedResponse = JSON.parse(classification);
      return classifiedResponse.some((item: IntentResult) => item.intent === 'context_reference');
    }, contextFlow],

    [async ({ inputData: { classification } }) => {
      const classifiedResponse = JSON.parse(classification);
      return classifiedResponse.some((item: IntentResult) => item.intent === 'off_topic_suspicious');
    }, unsafeFlow],
  ])
  .commit();
