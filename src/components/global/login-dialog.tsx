"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chrome, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginDialogProps extends React.ComponentProps<typeof Button> {}
export function LoginDialog({ ...props }: LoginDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogin(provider: "google" | "github") {
    try {
      setLoading(true);
      await signIn(provider);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in", {
        description: "There was a problem signing in with. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 md:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => handleLogin("google")}
            disabled={loading}
          >
            <Chrome className="size-4" /> Sign in with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleLogin("github")}
            disabled={loading}
          >
            <Github className="size-4" /> Sign in with Github
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          I&apos;ll <span className="font-bold">never</span> contact you, just
          making sure this app is not abused
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
