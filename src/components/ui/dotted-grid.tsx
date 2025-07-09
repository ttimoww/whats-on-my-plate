import { cn } from "@/lib/utils";

interface DottedGridProps extends React.HTMLAttributes<HTMLDivElement> {}
export function DottedGrid({ className, ...props }: DottedGridProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:26px_26px] dark:bg-[radial-gradient(#111827_2px,transparent_2px)]",
        className,
      )}
      {...props}
    />
  );
}
