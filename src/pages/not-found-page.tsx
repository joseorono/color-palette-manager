import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Palette, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from an /app/ route
  const isFromApp = location.pathname.startsWith('/app/');
  const homeButtonText = isFromApp ? 'Back to Dashboard' : 'Home';
  const HomeIcon = isFromApp ? LayoutDashboard : Home;
  const homeButtonPath = isFromApp ? '/app/dashboard' : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-muted-foreground/20 shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          {/* 404 Number with gradient */}
          <div className="relative">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 text-8xl font-bold text-muted-foreground/10 blur-sm">
              404
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Palette className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFromApp ? (
                "Looks like this color palette got lost in the spectrum. The page you're looking for doesn't exist or has been moved."
              ) : (
                "Looks like this page got lost. The page you're looking for doesn't exist or has been moved."
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 group hover:bg-muted/50 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate(homeButtonPath)}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              {homeButtonText}
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl opacity-60" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-pink-500/20 to-primary/20 rounded-full blur-xl opacity-40" />
        </CardContent>
      </Card>
    </div>
  );
}
