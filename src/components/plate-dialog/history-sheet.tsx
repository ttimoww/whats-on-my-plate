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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Plate } from "@prisma/client";

// Utility function to calculate age in days
function calculateDaysAgo(createdAt: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Utility function to format days ago text
function formatDaysAgo(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

interface PlateGridProps {
  plates: Plate[];
  onPlateSelect: () => void;
}

function PlateGrid({ plates, onPlateSelect }: PlateGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-2">
      {plates.map((plate) => {
        const daysAgo = calculateDaysAgo(new Date(plate.createdAt));
        return (
          <li key={plate.id}>
            <Link href={`?plate=${plate.id}`} onClick={onPlateSelect}>
              <Card className="relative aspect-square overflow-hidden py-0">
                <Image
                  src={plate.imageUrl}
                  fill
                  alt={`Plate #${plate.id}`}
                  className="object-cover"
                />
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 bg-white/70 text-xs text-slate-800 backdrop-blur-sm"
                >
                  {formatDaysAgo(daysAgo)}
                </Badge>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

interface SheetPlatesProps {
  setOpen: (open: boolean) => void;
}

function SheetPlates({ setOpen }: SheetPlatesProps) {
  const { data: plates, isLoading } = api.plate.getAll.useQuery();

  if (isLoading) return <LoadingOverlay show />;

  return (
    <div className="flex h-full flex-col">
      <Badge variant="secondary" className="mx-auto mb-4 block flex-shrink-0">
        {plates?.length} plates
      </Badge>
      <div className="flex-1 overflow-y-auto">
        <PlateGrid plates={plates ?? []} onPlateSelect={() => setOpen(false)} />
      </div>
    </div>
  );
}

interface DrawerPlatesProps {
  setOpen: (open: boolean) => void;
}

function DrawerPlates({ setOpen }: DrawerPlatesProps) {
  const { data: plates, isLoading } = api.plate.getAll.useQuery();

  if (isLoading)
    return (
      <div className="h-[300px]">
        <LoadingOverlay show />
      </div>
    );

  return (
    <>
      <Badge variant="secondary" className="mx-auto mb-4 block">
        {plates?.length} plates
      </Badge>
      <PlateGrid plates={plates ?? []} onPlateSelect={() => setOpen(false)} />
    </>
  );
}

interface HistorySheetProps extends React.ComponentProps<typeof Button> {}
export function HistorySheet({ ...props }: HistorySheetProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button {...props} />
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Your recent plates</SheetTitle>
            <SheetDescription>
              Dive back into your recently analyzed plates.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden px-4">
            <SheetPlates setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button {...props} />
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[85vh] flex-col">
        <DrawerHeader className="flex-shrink-0 text-left">
          <DrawerTitle>Your recent plates</DrawerTitle>
          <DrawerDescription>
            Dive back into your recently analyzed plates.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <DrawerPlates setOpen={setOpen} />
        </div>
        <DrawerFooter className="flex-shrink-0 pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
