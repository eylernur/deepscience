import OpenAI from "openai";

export type AIProvider = 'openai' | 'azure';

interface AIConfig {
  provider: AIProvider;
  client: OpenAI;
  model: string;
}

function createOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function createAzureOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_MODEL_DEPLOYMENT}`,
    defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
    defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
  });
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'openai') as AIProvider;
  
  if (provider === 'azure') {
    // Validate Azure OpenAI configuration
    if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_MODEL_DEPLOYMENT) {
      throw new Error('Azure OpenAI configuration is incomplete. Please check your environment variables.');
    }
    
    return {
      provider: 'azure',
      client: createAzureOpenAIClient(),
      model: process.env.AZURE_OPENAI_MODEL_DEPLOYMENT,
    };
  }
  
  // Default to OpenAI
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing. Please check your environment variables.');
  }
  
  return {
    provider: 'openai',
    client: createOpenAIClient(),
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  };
} 