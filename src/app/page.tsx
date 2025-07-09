import { CreatePlate } from "@/components/create-plate";
import { PlateDialog } from "@/components/plate-dialog";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ share?: string }>;
}) {
  const session = await auth();
  const { share } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <h1 className="text-center text-4xl font-bold">
        What&apos;s On My Plate 🍔
      </h1>
      <p className="text-muted-foreground mb-4 text-center text-sm">
        Analyze your food intake with AI.
      </p>
      <CreatePlate className="w-full max-w-xl" />
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
