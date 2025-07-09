"use client";

import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";

interface HistorySheetProps extends React.ComponentProps<typeof Button> {}
export function HistorySheet({ ...props }: HistorySheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your recent plates</SheetTitle>
          <SheetDescription>
            Dive back into your recently analyzed plates.
          </SheetDescription>
        </SheetHeader>
        <div className="p-2">
          <Content setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface ContentProps {
  setOpen: (open: boolean) => void;
}
function Content({ setOpen }: ContentProps) {
  const { data: plates, isLoading } = api.plate.getAll.useQuery();

  if (isLoading) return <LoadingOverlay show />;

  return (
    <ul className="flex flex-col gap-4">
      {plates?.map((plate) => (
        <li key={plate.id}>
          <Link href={`?plate=${plate.id}`} onClick={() => setOpen(false)}>
            {plate.id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
