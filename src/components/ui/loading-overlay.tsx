'use client';

import React from 'react';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
}
export function LoadingOverlay({
  className,
  show,
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'bg-background/60 absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ease-out',
        {
          'pointer-events-auto opacity-100': show,
          'pointer-events-none opacity-0': !show,
        },
        className,
      )}
      {...props}
    >
      <Loader2Icon className="h-6 w-6 animate-spin" />
    </div>
  );
}
