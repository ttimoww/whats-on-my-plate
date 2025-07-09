import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
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

export async function POST(req: Request) {
    // 'data' contains the additional data that you have sent:
    const { messages, data } = await req.json();

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    console.log(initialMessages)

    // Call the language model
    const result = streamText({
        model: openai('gpt-4o'),
        system: "You are a helpful assistant that can describe images. When a user uploads an image, you always describe the image by calling the 'describeImage' tool.",
        messages: [
            ...initialMessages,
            {
                role: 'user',
                content: [
                    { type: 'text', text: currentMessage.content },
                    { type: 'image', image: new URL(data.imageUrl) },
                ],
            },
        ],
        tools,
        maxSteps: 10,
        onError: (error) => {
            console.error(error);
        },
    });

    // Respond with the stream
    return result.toDataStreamResponse();
}