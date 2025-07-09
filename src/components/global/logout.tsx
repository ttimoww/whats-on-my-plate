'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

interface LogoutProps
  extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {}
export function Logout({ ...props }: LogoutProps) {
  return (
    <Button onClick={() => signOut()} {...props}>
      Sign out
    </Button>
  );
}
