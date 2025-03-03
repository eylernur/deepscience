import { NextRequest } from "next/server";
import { getAIConfig } from "@/lib/ai-config";

// Initialize AI client
const aiConfig = getAIConfig();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Ensure the request has a body
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON body
    let query, aiResponse;
    try {
      const data = JSON.parse(body);
      query = data.query;
      aiResponse = data.aiResponse;
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate the input
    if (!query || !aiResponse) {
      return new Response(
        JSON.stringify({ error: "Query and AI response are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a prompt for generating follow-up questions
    const prompt = `
Based on the following user query and AI response, generate 3-5 relevant follow-up questions that the user might want to ask next.
The questions should be concise, diverse, and help the user explore the topic further.

Original Query: "${query}"

AI Response: "${aiResponse.substring(0, 1500)}${aiResponse.length > 1500 ? '...' : ''}"

Only return the JSON array, nothing else.
`;

    // Call OpenAI to generate follow-up questions
    const response = await aiConfig.client.chat.completions.create({
      model: aiConfig.model,
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that generates relevant follow-up questions based on a user's query and an AI response. Return a JSON object with an array of follow-up questions under the key 'questions'." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "follow_up_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "A list of follow-up questions that help the user explore the topic further."
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
      }
    });

    // Extract the generated questions
    const content = response.choices[0]?.message?.content || "{}";
    
    // Parse the response and ensure it's a valid array
    let questions: string[] = [];
    try {
      // First try to parse as JSON
      const parsedContent = JSON.parse(content);
      
      // Handle different possible response formats
      if (Array.isArray(parsedContent)) {
        questions = parsedContent;
      } else if (parsedContent.questions) {
        questions = parsedContent.questions;
      } else if (parsedContent.followUpQuestions || parsedContent.follow_up_questions) {
        questions = parsedContent.followUpQuestions || parsedContent.follow_up_questions;
      } else {
        // Extract questions from object keys and values
        const extractedQuestions: string[] = [];
        
        // Check if the response is a malformed object with questions as keys
        Object.keys(parsedContent).forEach(key => {
          if (typeof key === 'string' && key.includes('?')) {
            extractedQuestions.push(key);
          }
        });
        
        // Also check values
        Object.values(parsedContent).forEach(value => {
          if (typeof value === 'string' && value.includes('?')) {
            extractedQuestions.push(value);
          } else if (Array.isArray(value)) {
            // If we find an array, use it directly
            const stringValues = value.filter(item => typeof item === 'string');
            if (stringValues.length > 0) {
              extractedQuestions.push(...stringValues);
            }
          }
        });
        
        if (extractedQuestions.length > 0) {
          questions = extractedQuestions;
        }
      }
      
      // Ensure we have an array of strings
      questions = questions.filter((q): q is string => typeof q === 'string').slice(0, 5);
    } catch (error) {
      console.error("Error parsing follow-up questions:", error);
      questions = [];
    }

    // Return the follow-up questions
    return new Response(
      JSON.stringify({ questions }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Follow-up questions API error:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate follow-up questions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 