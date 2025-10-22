import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/ai/src/mastra';

/**
 * Chatbot API Endpoint
 * 
 * Supports both:
 * - Standard JSON responses (default)
 * - Server-Sent Events (SSE) streaming
 * 
 * Query parameter: ?stream=true for SSE
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ vendorApiKey: string; }>; }
) {
  try {
    // TODO: Validate vendorApiKey against your database
    // const { vendorApiKey } = await params;
    // const isValidApiKey = await validateApiKey(vendorApiKey);
    // if (!isValidApiKey) {
    //   return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    // }
    await params; // Await params even if not using vendorApiKey yet

    const body = await request.json();
    const { message, userId, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if client wants streaming
    const useStreaming = request.nextUrl.searchParams.get('stream') === 'true';

    if (useStreaming) {
      // ============================================================
      // OPTION 1: MASTRA NATIVE STREAMING
      // ============================================================

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const workflow = mastra.getWorkflow('ecommerceFlow');
            const run = await workflow.createRunAsync();

            const result = await run.stream({
              inputData: {
                message,
                session_id: sessionId || 'default',
                customer_id: userId
              }
            });

            // Stream chunks from Mastra
            for await (const chunk of result.stream) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
              );
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'error',
                message: errorMessage
              })}\n\n`)
            );
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // ============================================================
      // OPTION 2: STANDARD JSON RESPONSE (Non-streaming)
      // ============================================================

      // @ts-expect-error - Mastra workflow execute type mismatch
      const result = await mastra.getWorkflow('ecommerceFlow').execute({
        inputData: {
          message,
          session_id: sessionId || 'default',
          customer_id: userId
        }
      });

      return NextResponse.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Chatbot API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check API key validity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorApiKey: string; }>; }
) {
  const { vendorApiKey } = await params;

  // TODO: Validate vendorApiKey
  // const isValidApiKey = await validateApiKey(vendorApiKey);

  return NextResponse.json({
    message: 'Chatbot API is active',
    apiKey: vendorApiKey.substring(0, 8) + '...',
    endpoints: {
      chat: `/api/chatbot/${vendorApiKey}`,
      chatStream: `/api/chatbot/${vendorApiKey}?stream=true`
    }
  });
}

