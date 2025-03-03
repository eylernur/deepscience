import { NextRequest } from "next/server";
import { searchPapers } from "@/lib/search";
import { getAIConfig } from "@/lib/ai-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Initialize AI client
const aiConfig = getAIConfig();
const { client: ai, model: AI_MODEL } = aiConfig;

// System prompt for the AI
const SYSTEM_PROMPT = `You are DeepScience, an AI research assistant that helps users understand scientific papers and research topics.
Your goal is to provide accurate, concise, and helpful information based on scientific papers.

When responding to queries:
1. Provide clear, concise explanations that are accessible to someone with a basic understanding of the field
2. Cite specific papers when making claims using this format: Numerical reference: [paper_number] where paper_number is the paper's index, in plural form [1] [2] [3] etc.
3. Acknowledge limitations or uncertainties in the research
4. Avoid speculation beyond what the papers support
5. Format your response in markdown for readability
6. Don't include other references or citations in your response

Remember that you are helping researchers understand complex topics, so clarity and accuracy are essential.`;

export async function POST(req: NextRequest) {
  try {
    // Ensure the request has a body
    const body = await req.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: "No request body provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON body
    let query;
    try {
      const data = JSON.parse(body);
      query = data.query;
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!query) {
      return new Response(
        JSON.stringify({ error: "No query provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const papers = await searchPapers(query);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send papers first
          const papersChunk = JSON.stringify({
            type: 'papers',
            content: papers
          }) + "\n";
          controller.enqueue(encoder.encode(papersChunk));

          if (papers.length === 0) {
            // If no papers found, send a message and complete
            const noResultsChunk = JSON.stringify({
              type: 'aiResponse',
              content: "I couldn't find any relevant papers for your query. Please try different search terms.",
              done: true
            }) + "\n";
            controller.enqueue(encoder.encode(noResultsChunk));
            controller.close();
            return;
          }

          // Format paper data for the AI
          const paperContexts = papers.map((paper, index) => {
            const abstract = paper.abstract || "";
            const authors = paper.authors?.join(", ") || "Unknown authors";
            
            return `Paper ${index + 1}:
Title: ${paper.title}
Authors: ${authors}
Year: ${paper.year}
${abstract ? `Abstract: ${abstract}` : ""}
`;
          }).join("\n\n");

          // Create the user message with the query and paper contexts
          const userMessage = `
User Query: ${query}

Here are some relevant scientific papers that might help answer this query:

${paperContexts}

Based on these papers, please provide a comprehensive answer to the user's query. 
`;

          try {
            // Create a streaming completion
            const response = await ai.chat.completions.create({
              model: AI_MODEL,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
              ],
              temperature: 0.5,
              max_tokens: 1500,
              stream: true
            });

            // Stream the response
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                const aiResponseChunk = JSON.stringify({
                  type: 'aiResponse',
                  content: content,
                  done: false
                }) + "\n";
                controller.enqueue(encoder.encode(aiResponseChunk));
              }
            }

            // Send completion
            const doneChunk = JSON.stringify({
              type: 'aiResponse',
              content: '',
              done: true
            }) + "\n";
            controller.enqueue(encoder.encode(doneChunk));
          } catch (error) {
            console.error('Error generating AI response:', error);
            const errorChunk = JSON.stringify({
              type: 'error',
              content: 'Failed to generate AI response'
            }) + "\n";
            controller.enqueue(encoder.encode(errorChunk));
          }

          controller.close();
        } catch (error) {
          console.error('Error in stream controller:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Search stream error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 