"use client";

import { useChat } from "@ai-sdk/react";
import type { Plate } from "@prisma/client";
import { createContext, useContext, useState } from "react";
import {
  healthScoreSchema,
  nutritionalInfoSchema,
  type HealthScore,
  type NutritionalInfo,
} from "@/lib/schemas";
import type { ToolName } from "@/app/api/chat/route";

type PlateDialogContextType = {
  chat: ReturnType<typeof useChat>;
  nutritionalInfo: NutritionalInfo | null;
  healthScore: HealthScore | null;
};

const PlateDialogContext = createContext<PlateDialogContextType>(
  {} as PlateDialogContextType,
);

export function PlateDialogProvider({
  children,
  plate,
}: {
  plate: Plate;
  children: React.ReactNode;
}) {
  const [nutritionalInfo, setNutritionalInfo] =
    useState<NutritionalInfo | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);

  const chat = useChat({
    api: `/api/chat`,
    body: {
      plateId: plate.id,
    },
    initialMessages: [
      {
        id: "1",
        role: "user",
        content: "What's on my plate?", // This message is overwritten serverside
      },
    ],
    onToolCall({ toolCall }) {
      const name = toolCall.toolName as ToolName;
      switch (name) {
        case "determineNutritionalInfo":
          setNutritionalInfo(nutritionalInfoSchema.parse(toolCall.args));
          break;
        case "determineHealthScore":
          setHealthScore(healthScoreSchema.parse(toolCall.args));
          break;

        default:
          break;
      }
    },
  });

  return (
    <PlateDialogContext.Provider value={{ chat, nutritionalInfo, healthScore }}>
      {children}
    </PlateDialogContext.Provider>
  );
}

export function usePlateDialog() {
  const context = useContext(PlateDialogContext);

  if (!context) {
    throw new Error("usePlateDialog must be used within a PlateDialogProvider");
  }

  return context;
}
