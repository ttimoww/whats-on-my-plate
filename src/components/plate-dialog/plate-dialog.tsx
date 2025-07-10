"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { Chat } from "@/components/chat";
import { useUrlState } from "@/hooks/use-url-state";
import { api } from "@/trpc/react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PlateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {}
export function PlateDialog({ ...props }: PlateDialogProps) {
  const [plateId, setPlateId] = useUrlState();

  const hasPlateId = plateId !== null;

  return (
    <Dialog open={hasPlateId} onOpenChange={() => setPlateId(null)} {...props}>
      <DialogContent className="min-h-[500px] p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">Plate {plateId}</DialogTitle>
        {hasPlateId && <Content plateId={plateId} />}
      </DialogContent>
    </Dialog>
  );
}

function Content({ plateId }: { plateId: number }) {
  const { data, isLoading, error } = api.plate.getById.useQuery({
    id: plateId,
  });

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading || !data) {
    return <LoadingOverlay show />;
  }

  return (
    <div className="grid lg:grid-cols-2">
      <div className="border-border relative col-span-1 bg-gray-100/50 max-lg:border-b lg:border-r">
        <DottedGrid />
        <div className="relative grid grid-cols-8 gap-4 p-4">
          <Card className="col-span-5 py-2">
            <CardContent className="px-2">
              <Image src={data.imageUrl} alt="Plate" width={300} height={300} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-1">
        <Chat plate={data} />
      </div>
    </div>
  );
}
