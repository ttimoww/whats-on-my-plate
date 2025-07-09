import { cn } from "@/lib/utils";
import { Login } from "@/components/global/login";
import { HistorySheet } from "@/components/plate-dialog/history-sheet";
import { auth } from "@/server/auth";
import { Logout } from "@/components/global/logout";
interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export async function Header({ className, ...props }: HeaderProps) {
  const session = await auth();

  return (
    <div
      className={cn(
        "container mx-auto flex items-center justify-between p-6",
        className,
      )}
      {...props}
    >
      {session ? (
        <>
          <Logout>Logout</Logout>
          <HistorySheet>History</HistorySheet>
        </>
      ) : (
        <Login>Login</Login>
      )}
    </div>
  );
}
