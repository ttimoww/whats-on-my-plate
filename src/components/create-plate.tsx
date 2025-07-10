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
import { cn, convertFileToBase64 } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useUrlState } from "@/hooks/use-url-state";
const formSchema = z.object({
  description: z.string().optional(),
  image: z.instanceof(File, { message: "A photo of your plate is required" }),
});

interface CreatePlateProps extends React.ComponentProps<typeof Card> {}
export function CreatePlate({ className, ...props }: CreatePlateProps) {
  const [_, setPlateId] = useUrlState();
  const { mutateAsync: createPlate, isPending } =
    api.plate.create.useMutation();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { id } = await createPlate({
        image: await convertFileToBase64(values.image),
        description: values.description,
      });

      setPlateId(id);
    } catch (error) {
      toast.error("Failed to create plate");
    }
  }

  return (
    <Card className={cn("relative", className)} {...props}>
      <LoadingOverlay show={isPending} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
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
