import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import type { NextRequest } from 'next/server';
import z from 'zod';

export const maxDuration = 60;

const foodDescriptionSchema = z.object({
    kcal: z.number().describe('The number of kilocalories in the food'),
    protein: z.number().describe('The number of grams of protein in the food (in grams)'),
    carbs: z.number().describe('The number of grams of carbs in the food (in grams)'),
    fat: z.number().describe('The number of grams of fat in the food (in grams)'),
})

const tools = {
    describeFood: tool({
        description: "Describe the food in the image",
        parameters: foodDescriptionSchema,
        execute: async (data: z.infer<typeof foodDescriptionSchema>) => {
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
                { type: 'text', text: 'What is on my plate, make sure to call the describeFood tool' },
                { type: 'image', image: new URL(plate.imageUrl) },
            ],
        },
        ...body.messages.slice(1)
    ]

    // Call the language model
    const result = streamText({
        model: openai('gpt-4o'),
        system: PROMPT,
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

const PROMPT = `
You are a helpful assistant that can describe images. 
When a user uploads an image, you always describe the image by calling the 'describeFood' tool. 
Whenever the user provides more information about their food during the conversation, update the food by calling the 'describeFood' tool if needed. 
`