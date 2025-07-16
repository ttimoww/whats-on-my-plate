import { CreatePlate } from "@/components/create-plate";
import { Login } from "@/components/global/login";
import { PlateDialog } from "@/components/plate-dialog/plate-dialog";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <h1 className="text-center text-4xl font-bold">
        What&apos;s On My Plate 🍔
      </h1>
      <p className="text-muted-foreground mb-4 text-center text-sm">
        Know what&apos;s in your food by taking a picture of your plate.
      </p>
      {session ? (
        <CreatePlate className="w-full max-w-xl" />
      ) : (
        <Login>Login</Login>
      )}
      <p className="text-muted-foreground text-sm">
        See how it works on{" "}
        <Link
          href="https://github.com/ttimoww/stories-as-a-service"
          className="underline"
        >
          Github
        </Link>
      </p>
      <PlateDialog />
    </main>
  );
}
