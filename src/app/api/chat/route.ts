import { type HealthScore, healthScoreSchema, type NutritionalInfo, nutritionalInfoSchema } from "@/lib/schemas";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

const tools = {
    determineNutritionalInfo: tool({
        description: "Determine the nutritional information of the food in the image",
        parameters: nutritionalInfoSchema,
        execute: async (data: NutritionalInfo) => data,
    }),
    determineHealthScore: tool({
        description: "Determine the health score of the food in the image",
        parameters: healthScoreSchema,
        execute: async (data: HealthScore) => data,
    }),
};

export type ToolName = keyof typeof tools;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!body.plateId) {
        return new Response("Plate ID is required", { status: 400 });
    }

    const plate = await db.plate.findUnique({
        where: {
            id: body.plateId,
            userId: session.user.id,
        },
    });

    if (!plate) {
        return new Response("Plate not found", { status: 404 });
    }

    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "What is on my plate, make sure to call the describeFood tool",
                },
                { type: "image", image: new URL(plate.imageUrl) },
            ],
        },
        ...body.messages.slice(1),
    ];

    // Call the language model
    const result = streamText({
        model: openai("gpt-4o"),
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
When a user uploads an image, you always calculate the nutritional information and health score of the image by calling the 'determineNutritionalInfo' and 'determineHealthScore' tools. 
Whenever the user provides more information about their food during the conversation, update the nutritional information and health score by calling the 'determineNutritionalInfo' and 'determineHealthScore' tools if needed. 
`;
