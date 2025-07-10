import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import type { NextRequest } from 'next/server';
import z from 'zod';

export const maxDuration = 60;

const imageDescriptionSchema = z.object({ description: z.string() })

const tools = {
    describeImage: tool({
        description: "Describe the image",
        parameters: imageDescriptionSchema,
        execute: async (data: z.infer<typeof imageDescriptionSchema>) => {
            console.log('CALLED TOOLD: ', data)
            return data;
        },
    }),
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    const session = await auth()

    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    if (!body.plateId) {
        return new Response('Plate ID is required', { status: 400 })
    }

    const plate = await db.plate.findUnique({
        where: {
            id: body.plateId,
            userId: session.user.id,
        }
    })

    if (!plate) {
        return new Response('Plate not found', { status: 404 })
    }


    const messages = [
        {
            role: 'user',
            content: [
                { type: 'text', text: 'What is on my plate, make sure to call the describeImage tool' },
                { type: 'image', image: new URL(plate.imageUrl) },
            ],
        },
        ...body.messages.slice(1)
    ]

    // Call the language model
    const result = streamText({
        model: openai('gpt-4o'),
        system: "You are a helpful assistant that can describe images. When a user uploads an image, you always describe the image by calling the 'describeImage' tool.",
        messages,
        tools,
        maxSteps: 10,
        onError: (error) => {
            console.error(error);
        },
    });

    // Respond with the stream
    return result.toDataStreamResponse();
}