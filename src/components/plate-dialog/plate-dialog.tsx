"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { Chat } from "@/components/chat";
import { useUrlState } from "@/hooks/use-url-state";
import { api } from "@/trpc/react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import Image from "next/image";
import { Flame, Target, Heart, ChefHat, Tag } from "lucide-react";
import {
  PlateDialogProvider,
  usePlateDialog,
} from "@/providers/plate-dialog-provider";
import { motion, AnimatePresence } from "motion/react";

interface PlateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {}
export function PlateDialog({ ...props }: PlateDialogProps) {
  const [plateId, setPlateId] = useUrlState();

  const hasPlateId = plateId !== null;

  return (
    <Dialog open={hasPlateId} onOpenChange={() => setPlateId(null)} {...props}>
      <DialogContent className="h-[70vh] overflow-hidden p-0 sm:max-w-[calc(100%-2rem)] lg:max-h-[600px] xl:max-w-6xl">
        <DialogTitle className="sr-only">Plate {plateId}</DialogTitle>
        {hasPlateId && <Content plateId={plateId} />}
      </DialogContent>
    </Dialog>
  );
}

function Content({ plateId }: { plateId: number }) {
  const { data, isLoading, error } = api.plate.getById.useQuery({
    id: plateId,
  });

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading || !data) {
    return <LoadingOverlay show />;
  }

  return (
    <PlateDialogProvider plate={data}>
      <div className="flex h-full flex-col lg:flex-row">
        <div className="border-border relative flex-4 bg-gray-100/50 max-lg:border-b lg:border-r">
          <DottedGrid />
          <div className="relative grid grid-cols-2 gap-4 p-6">
            <div className="flex flex-col gap-4">
              <CaloriesCard />
              <HealthScoreCard />
            </div>
            <div className="flex flex-col gap-4">
              <MacrosCard />
            </div>
          </div>
        </div>
        <Chat className="flex-6" plate={data} />
      </div>
    </PlateDialogProvider>
  );
}

function AnimateIn({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface CaloriesCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {}
function CaloriesCard({ ...props }: CaloriesCardProps) {
  const { nutritionalInfo } = usePlateDialog();

  if (!nutritionalInfo) {
    return null;
  }

  return (
    <AnimateIn>
      <Card className="p-4" {...props}>
        <CardContent className="p-0">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <p className="text-base font-medium">Calories</p>
          </div>
          <div className="text-2xl font-bold">{nutritionalInfo.kcal}</div>
          <p className="text-muted-foreground text-sm">kcal</p>
        </CardContent>
      </Card>
    </AnimateIn>
  );
}

interface MacrosCardProps extends React.ComponentPropsWithoutRef<typeof Card> {}
function MacrosCard({ ...props }: MacrosCardProps) {
  const { nutritionalInfo } = usePlateDialog();

  if (!nutritionalInfo) {
    return null;
  }

  return (
    <AnimateIn>
      <Card className="p-4" {...props}>
        <CardContent className="p-0">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <p className="text-base font-medium">Macros</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-semibold text-red-600">
                {nutritionalInfo.protein}g
              </div>
              <p className="text-muted-foreground text-sm">Protein</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-600">
                {nutritionalInfo.carbs}g
              </div>
              <p className="text-muted-foreground text-sm">Carbs</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">
                {nutritionalInfo.fat}g
              </div>
              <p className="text-muted-foreground text-sm">Fat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimateIn>
  );
}

interface HealthScoreCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {}
function HealthScoreCard({ ...props }: HealthScoreCardProps) {
  const { healthScore } = usePlateDialog();

  if (!healthScore) {
    return null;
  }

  const getScoreLabel = function (score: number) {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Poor";
  };

  return (
    <AnimateIn>
      <Card className="p-4" {...props}>
        <CardContent className="p-0">
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-500" />
            <p className="text-base font-medium">Health Score</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-green-600">
              {healthScore.healthScore}
            </div>
            <div className="text-muted-foreground text-sm">
              <div>/10</div>
            </div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${(healthScore.healthScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {getScoreLabel(healthScore.healthScore)}
          </p>
        </CardContent>
      </Card>
    </AnimateIn>
  );
}

interface IngredientsCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  ingredients: string[];
}
function IngredientsCard({ ingredients, ...props }: IngredientsCardProps) {
  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <div className="mb-3 flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-indigo-500" />
          <p className="text-base font-medium">Ingredients</p>
        </div>
        <div className="max-h-32 space-y-2 overflow-y-auto">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400" />
              <span className="text-sm text-gray-700">{ingredient}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DietaryTagsCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  dietaryTags: Array<{
    name: string;
    color: string;
  }>;
}
function DietaryTagsCard({ dietaryTags, ...props }: DietaryTagsCardProps) {
  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5 text-emerald-500" />
          <p className="text-base font-medium">Dietary Tags</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {dietaryTags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-full px-3 py-1 text-xs font-medium ${tag.color}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface PlateImageCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  imageUrl: string;
}
function PlateImageCard({ imageUrl, ...props }: PlateImageCardProps) {
  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt="Plate"
          width={300}
          height={300}
          className="h-auto w-full rounded-md"
        />
      </CardContent>
    </Card>
  );
}
