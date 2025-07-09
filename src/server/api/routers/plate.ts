import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { createPlateSchema } from "@/lib/schemas";

export const plateRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createPlateSchema)
        .mutation(async ({ input }) => {
            console.log(input)
        }),
});
