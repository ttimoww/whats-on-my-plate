import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createPlateSchema } from "@/lib/schemas";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { convertBase64ToBuffer } from "@/lib/utils";
import { z } from "zod";
export const plateRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    return await ctx.db.plate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const { session } = ctx;

      return await ctx.db.plate.findUniqueOrThrow({
        where: { id, userId: session.user.id },
      });
    }),
  create: protectedProcedure
    .input(createPlateSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const { image, description } = input;

      const imageUrl = await uploadImageToCloudinary({
        buffer: convertBase64ToBuffer(image),
        filename: `${session.user.id}-${Date.now()}`,
      });

      const plate = await ctx.db.plate.create({
        data: {
          userId: session.user.id,
          imageUrl: imageUrl.secure_url,
          userDescription: description,
        },
      });

      return { id: plate.id };
    }),
});
