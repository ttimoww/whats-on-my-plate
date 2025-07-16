import {
  type HealthScore,
  healthScoreSchema,
  type NutritionalInfo,
  nutritionalInfoSchema,
} from "@/lib/schemas";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import type { NextRequest } from "next/server";
import type { CoreMessage } from "ai";
export const maxDuration = 60;

const tools = {
  saveNutritionalInfo: tool({
    description: "Save the nutritional information of the food in the image",
    parameters: nutritionalInfoSchema,
    execute: async (data: NutritionalInfo) => data,
  }),
  saveHealthScore: tool({
    description: "Save the health score of the food in the image",
    parameters: healthScoreSchema,
    execute: async (data: HealthScore) => data,
  }),
};

export type ToolName = keyof typeof tools;

export async function POST(req: NextRequest) {
  const body = await req.json()

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
          text: `What is the nutritional information of the food in the image? ${plate.userDescription ? `This is my description which you can point you in the right direction: ${plate.userDescription}` : ""}`,
        },
        { type: "image", image: new URL(plate.imageUrl) },
      ],
    },
    ...body.messages.slice(1),
  ];

  const isFirstMessage = body.messages.length === 1;

  // Call the language model
  const result = streamText({
    model: openai("gpt-4o"),
    system: PROMPT,
    messages,
    tools,
    maxSteps: isFirstMessage ? undefined : 10,
    toolChoice: isFirstMessage
      ? { type: "tool", toolName: "saveNutritionalInfo" }
      : "auto",
    onError: (error) => {
      console.error(error);
    },
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}

const PROMPT = `
You are an expert nutritionist. Users will upload an image of their food which you can use to determine the nutritional information or a health score of the food.
When calling a tool, you always reply to the user with text.`;
