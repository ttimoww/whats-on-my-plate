import { z } from 'zod';

export const createPlateSchema = z.object({
    image: z.string().min(1),
    description: z.string().max(500).optional()
});

export type CreatePlate = z.infer<typeof createPlateSchema>;
