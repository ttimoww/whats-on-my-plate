"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { convertFileToBase64 } from "@/lib/utils";

const formSchema = z.object({
  description: z.string().optional(),
  image: z.instanceof(File, { message: "A photo of your plate is required" }),
});

interface CreatePlateCardProps extends React.ComponentProps<typeof Card> {}
export function CreatePlateCard({ ...props }: CreatePlateCardProps) {
  const { mutateAsync: createPlate, isPending } =
    api.plate.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const base64Image = await convertFileToBase64(values.image);
      await createPlate({
        image: base64Image,
        description: values.description,
      });
    } catch (error) {
      toast.error("Failed to create plate");
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Meeting Notes</CardTitle>
        <CardDescription>
          Transcript from the meeting with the client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Your plate</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The clearer the image, the better the analysis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional information (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Something with rice and chicken"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This can improve the calculation of macronutrients.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Analyze Plate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
