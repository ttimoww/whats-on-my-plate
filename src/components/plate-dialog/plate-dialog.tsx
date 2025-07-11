"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { Chat } from "@/components/chat";
import { useUrlState } from "@/hooks/use-url-state";
import { api } from "@/trpc/react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Flame, Target, Heart, ChefHat, Tag } from "lucide-react";

interface PlateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {}
export function PlateDialog({ ...props }: PlateDialogProps) {
  const [plateId, setPlateId] = useUrlState();

  const hasPlateId = plateId !== null;

  return (
    <Dialog open={hasPlateId} onOpenChange={() => setPlateId(null)} {...props}>
      <DialogContent className="h-[600px] p-0 sm:max-w-[calc(100%-2rem)] xl:max-w-6xl">
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

  // Mock nutrition data - in a real app, this would come from the AI analysis
  const nutritionData = {
    calories: 520,
    macros: {
      protein: 28,
      carbs: 45,
      fat: 18,
    },
    healthScore: 8.2,
    ingredients: [
      "Bow-tie pasta",
      "Tomato sauce",
      "Fresh broccoli",
      "White fish fillet",
      "Olive oil",
      "Garlic",
      "Herbs & spices",
    ],
    dietaryTags: [
      { name: "High Protein", color: "bg-red-100 text-red-700" },
      { name: "Pescatarian", color: "bg-blue-100 text-blue-700" },
      { name: "Mediterranean", color: "bg-green-100 text-green-700" },
      { name: "Heart Healthy", color: "bg-pink-100 text-pink-700" },
    ],
  };

  return (
    <div className="grid h-full border border-green-200 lg:grid-cols-2">
      <div className="border-border relative col-span-1 bg-gray-100/50 max-lg:border-b lg:border-r">
        <DottedGrid />
        <div className="relative grid grid-cols-2 gap-4 p-6">
          <div className="flex flex-col gap-4">
            {/* <PlateImageCard imageUrl={data.imageUrl} /> */}
            <CaloriesCard calories={nutritionData.calories} />
            <IngredientsCard ingredients={nutritionData.ingredients} />
          </div>
          <div className="flex flex-col gap-4">
            <MacrosCard macros={nutritionData.macros} />
            <HealthScoreCard healthScore={nutritionData.healthScore} />
            <DietaryTagsCard dietaryTags={nutritionData.dietaryTags} />
          </div>
        </div>
      </div>
      <Chat plate={data} />
    </div>
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

interface CaloriesCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  calories: number;
}
function CaloriesCard({ calories, ...props }: CaloriesCardProps) {
  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <div className="mb-2 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <p className="text-base font-medium">Calories</p>
        </div>
        <div className="text-2xl font-bold">{calories}</div>
        <p className="text-muted-foreground text-sm">kcal</p>
      </CardContent>
    </Card>
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

interface MacrosCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}
function MacrosCard({ macros, ...props }: MacrosCardProps) {
  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <p className="text-base font-medium">Macros</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold text-red-600">
              {macros.protein}g
            </div>
            <p className="text-muted-foreground text-sm">Protein</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-amber-600">
              {macros.carbs}g
            </div>
            <p className="text-muted-foreground text-sm">Carbs</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">
              {macros.fat}g
            </div>
            <p className="text-muted-foreground text-sm">Fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface HealthScoreCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  healthScore: number;
}
function HealthScoreCard({ healthScore, ...props }: HealthScoreCardProps) {
  const getScoreLabel = function (score: number) {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Poor";
  };

  return (
    <Card className="p-4" {...props}>
      <CardContent className="p-0">
        <div className="mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-green-500" />
          <p className="text-base font-medium">Health Score</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-green-600">{healthScore}</div>
          <div className="text-muted-foreground text-sm">
            <div>/10</div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${(healthScore / 10) * 100}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          {getScoreLabel(healthScore)}
        </p>
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
