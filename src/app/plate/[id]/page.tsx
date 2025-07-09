import { Chat } from "@/components/chat";
import { Card, CardContent } from "@/components/ui/card";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
async function getPlateOrRedirect({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) {
  const plate = await db.plate.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!plate || plate.userId !== userId) {
    redirect("/");
  }

  return plate;
}

interface PlatePageProps {
  params: Promise<{ id: string }>;
}
export default async function PlatePage({ params }: PlatePageProps) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const plate = await getPlateOrRedirect({ id: +id, userId: session.user.id });

  return (
    <Dialog open={true}>
      <DialogContent className="grid min-h-[500px] p-0 sm:max-w-4xl lg:grid-cols-2">
        <div className="border-border relative col-span-1 bg-gray-100/50 max-lg:border-b lg:border-r">
          <DottedGrid />
          <div className="relative grid grid-cols-8 gap-4 p-4">
            <Card className="col-span-5 py-2">
              <CardContent className="px-2">
                <Image
                  src={plate.imageUrl}
                  alt={plate.userDescription ?? "Uploaded plate"}
                  width={300}
                  height={300}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-1">
          <Chat />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="mx-auto grid min-h-[500px] w-full max-w-4xl overflow-hidden py-0">
        <CardContent className="grid grid-cols-2 px-0">
          <div className="border-border relative col-span-1 bg-gray-100/50 max-lg:border-b lg:border-r">
            <DottedGrid />
            <div className="relative grid grid-cols-8 gap-4 p-4">
              <Card className="col-span-4 py-2">
                <CardContent className="px-2">
                  <Image
                    src={plate.imageUrl}
                    alt={plate.userDescription ?? "Uploaded plate"}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="col-span-1">
            <Chat />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
