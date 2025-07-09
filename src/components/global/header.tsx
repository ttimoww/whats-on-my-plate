import { cn } from "@/lib/utils";
import { LoginDialog } from "@/components/global/login-dialog";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export async function Header({ className, ...props }: HeaderProps) {
  return (
    <div className={cn("container mx-auto p-6", className)} {...props}>
      <LoginDialog>Login</LoginDialog>
    </div>
  );
}
