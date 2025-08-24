import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Blend, 
  Tag, 
  Image, 
  RefreshCw, 
  Pipette, 
  Layers,
  Eye,
  Type,
  Sliders,
  Contrast
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "available" | "coming-soon" | "in-development";
  link?: string;
}

const colorTools: Tool[] = [
  {
    id: "color-mixer",
    name: "Color Mixer",
    description: "Mix two or more colors to create new ones. Set custom mixing ratios and explore color combinations.",
    icon: Blend,
    status: "coming-soon"
  },
  {
    id: "color-naming",
    name: "Color Naming Tool",
    description: "Input any color and instantly see its descriptive name. Perfect for identifying colors quickly.",
    icon: Tag,
    status: "available",
    link: "/app/color-test"
  },
  {
    id: "palette-extractor",
    name: "Color Palette Extractor",
    description: "Extract dominant colors from images with a simplified, focused interface for quick color extraction.",
    icon: Image,
    status: "coming-soon"
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert colors between different formats: Hex, RGB, HSL, CMYK, and more with instant results.",
    icon: RefreshCw,
    status: "coming-soon"
  },
  {
    id: "eyedropper",
    name: "Eyedropper Tool",
    description: "Pick colors from anywhere on your screen within the browser. Advanced color picking capabilities.",
    icon: Pipette,
    status: "in-development"
  },
  {
    id: "shade-generator",
    name: "Shade Generator",
    description: "Generate lighter and darker shades of any base color. Create complete tonal ranges instantly.",
    icon: Layers,
    status: "coming-soon"
  }
];

const accessibilityTools: Tool[] = [
  {
    id: "colorblind-simulator",
    name: "Color Blindness Simulator",
    description: "Simulate how your palettes appear to users with different types of color blindness for better accessibility.",
    icon: Eye,
    status: "coming-soon"
  },
  {
    id: "contrast-checker",
    name: "Text & Background Contrast Checker",
    description: "Check if color combinations meet WCAG contrast guidelines for both normal and large text.",
    icon: Type,
    status: "coming-soon"
  },
  {
    id: "hsl-explorer",
    name: "HSL Color Explorer",
    description: "Interactive tool with sliders for Hue, Saturation, and Lightness to explore color space in real-time.",
    icon: Sliders,
    status: "coming-soon"
  },
  {
    id: "wcag-checker",
    name: "WCAG Compliance Checker",
    description: "Advanced contrast checker with AA and AAA level compliance testing for professional accessibility standards.",
    icon: Contrast,
    status: "coming-soon"
  }
];

const getStatusBadge = (status: Tool["status"]) => {
  switch (status) {
    case "available":
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Available</Badge>;
    case "coming-soon":
      return <Badge variant="secondary">Coming Soon</Badge>;
    case "in-development":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">In Development</Badge>;
  }
};

const ToolCard = ({ tool }: { tool: Tool }) => {
  const IconComponent = tool.icon;
  
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
            </div>
          </div>
          {getStatusBadge(tool.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed mb-4">
          {tool.description}
        </CardDescription>
        <Button 
          variant={tool.status === "available" ? "default" : "outline"} 
          className="w-full"
          disabled={tool.status !== "available"}
          onClick={() => {
            if (tool.link && tool.status === "available") {
              window.location.href = tool.link;
            }
          }}
        >
          {tool.status === "available" ? "Open Tool" : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Color Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover powerful tools to enhance your color workflow. From mixing and naming colors to accessibility testing and palette extraction.
        </p>
      </div>

      {/* Color Tools Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Color Tools</h2>
            <p className="text-muted-foreground">Essential tools for color manipulation and exploration</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Accessibility & Utility Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Accessibility & Utility</h2>
            <p className="text-muted-foreground">Tools to ensure your colors work for everyone</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibilityTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
          <RefreshCw className="h-4 w-4" />
          More tools are being added regularly. Check back soon!
        </div>
      </div>
    </div>
  );
}
