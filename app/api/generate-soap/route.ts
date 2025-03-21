import { NextResponse } from 'next/server';
import { SoapApiRequest } from '@/types/soaper';

// The API endpoint for Groq
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get the Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// The model to use for generation
const MODEL = process.env.SOAPER_MODEL || 'qwen-2.5-32b';

/**
 * API route handler for generating SOAP content
 */
export async function POST(request: Request) {
  try {
    // Ensure the API key is configured
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { message: 'Groq API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body: SoapApiRequest = await request.json();
    const { scripture, prePrompt } = body;

    if (!scripture || !prePrompt) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Define the messages for the chat completion
    const messages = [
      {
        role: 'system',
        content: prePrompt
      },
      {
        role: 'user',
        content: scripture
      }
    ];

    // Call the Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { 
          message: 'Error from LLM provider',
          details: errorData.error?.message || 'Unknown error'
        },
        { status: response.status }
      );
    }

    // Parse the response
    const data = await response.json();
    
    // Return the assistant's message
    return NextResponse.json({
      text: data.choices[0].message.content,
      model: data.model,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens
    });
  } catch (error) {
    console.error('Error generating SOAP:', error);
    return NextResponse.json(
      { message: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}