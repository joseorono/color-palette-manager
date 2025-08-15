import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoaderAnim from "@/components/loaders/loader-anim";

interface LoadingCardProps {
  title?: string;
  description?: string;
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  className?: string;
}

export function LoadingCard({
  title = "Loading",
  description = "Please wait while we fetch your data...",
  className,
}: LoadingCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex justify-center pb-8 pt-2">
        <LoaderAnim size={48} />
      </CardContent>
    </Card>
  );
}
