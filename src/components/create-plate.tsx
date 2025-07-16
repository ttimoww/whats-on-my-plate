"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

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

      void setPlateId(id);
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
                    <UploadImage onChange={onChange} />
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
                    <Textarea {...field} className="resize-none" />
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

interface UploadImageProps {
  onChange: (file: File | undefined) => void;
}
function UploadImage({ onChange }: UploadImageProps) {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      onChange(file);
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const avatarSrc = dropzone.fileStatuses[0]?.result;
  const isPending = dropzone.fileStatuses[0]?.status === "pending";

  return (
    <Dropzone {...dropzone}>
      <DropZoneArea>
        <DropzoneTrigger className="flex items-center gap-4 bg-transparent text-sm">
          <Avatar className={cn("size-12", isPending && "animate-pulse")}>
            <AvatarImage className="object-cover" src={avatarSrc} />
            <AvatarFallback>
              <ImageIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p>Upload a photo of your plate</p>
            <p className="text-muted-foreground text-xs">
              Drag and drop or click to upload
            </p>
          </div>
        </DropzoneTrigger>
      </DropZoneArea>
    </Dropzone>
  );
}
