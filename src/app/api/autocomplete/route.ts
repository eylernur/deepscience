import { NextRequest, NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/ai-config';

// Initialize AI client and configuration
const { client: ai, model: AI_MODEL } = getAIConfig();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { suggestions: [] },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Generate suggestions using AI model
    const response = await ai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates search suggestions for a scientific research assistant. Generate 5 search suggestions based on the user's partial query. Return the suggestions in a JSON object with a 'suggestions' array."
        },
        {
          role: "user",
          content: `Generate 5 search suggestions for: "${query}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 300,
    });

    // Parse the response to get suggestions
    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { suggestions: [] },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    try {
      const parsedContent = JSON.parse(content);
      return NextResponse.json(
        { 
          suggestions: Array.isArray(parsedContent.suggestions) 
            ? parsedContent.suggestions 
            : [] 
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json(
        { suggestions: [] },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }
  } catch (error) {
    console.error("Error generating autocomplete suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
} 