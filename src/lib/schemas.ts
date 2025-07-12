import { z } from "zod";

export const createPlateSchema = z.object({
  image: z.string().min(1),
  description: z.string().max(500).optional(),
});

export type CreatePlate = z.infer<typeof createPlateSchema>;

export const nutritionalInfoSchema = z.object({
  kcal: z.number().describe("The number of kilocalories in the food"),
  protein: z
    .number()
    .describe("The number of grams of protein in the food (in grams)"),
  carbs: z
    .number()
    .describe("The number of grams of carbs in the food (in grams)"),
  fat: z.number().describe("The number of grams of fat in the food (in grams)"),
});

export type NutritionalInfo = z.infer<typeof nutritionalInfoSchema>;

export const healthScoreSchema = z.object({
  healthScore: z.number().min(0).max(10).describe("The health score of the food"),
});

export type HealthScore = z.infer<typeof healthScoreSchema>;
