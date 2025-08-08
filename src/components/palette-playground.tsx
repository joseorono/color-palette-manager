import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Palette as PaletteIcon, Copy, Heart, Star, ArrowRight } from 'lucide-react';
import { Palette, Color, ColorRole, CSSColorVariablesObject, ColorRoles } from '@/types/palette';

// Types


// Utility types for the playground
interface PlaygroundProps {
  palette?: Palette;
  className?: string;
}

interface PreviewContainerProps {
  colorVariables: CSSColorVariablesObject;
  children: React.ReactNode;
}

// Helper functions
const hexToHsl = (hex: string): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const createColorVariables = (palette: Palette): CSSColorVariablesObject => {
  const variables: Partial<CSSColorVariablesObject> = {};

  // Initialize all roles with default values
  const defaults: CSSColorVariablesObject = {
    'primary': '220 90% 56%',
    'secondary': '220 14.3% 95.9%',
    'accent': '220 14.3% 95.9%',
    'background': '0 0% 100%',
    'foreground': '220 8.9% 46.1%',
    'card': '0 0% 100%',
    'border': '220 13% 91%',
    'muted': '220 14.3% 95.9%',
    'primary-foreground': '0 0% 98%',
    'secondary-foreground': '220 8.9% 46.1%',
    'accent-foreground': '220 8.9% 46.1%',
    'card-foreground': '220 8.9% 46.1%',
    'muted-foreground': '220 5.9% 57.9%',
  };

  // Apply colors from palette
  palette.colors.forEach((color: Color) => {
    if (color.role) {
      variables[color.role] = hexToHsl(color.hex);
    }
  });

  // Merge with defaults
  return { ...defaults, ...variables } as CSSColorVariablesObject;
};

const PreviewContainer: React.FC<PreviewContainerProps> = ({ colorVariables, children }) => {
  const containerStyle = React.useMemo(() => {
    const style: Record<string, string> = {};

    (Object.keys(colorVariables) as ColorRole[]).forEach((role: ColorRole) => {
      style[`--${role}`] = colorVariables[role];
    });

    return style;
  }, [colorVariables]);

  return (
    <div
      className="preview-container flex-1 p-8 overflow-auto bg-background"
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// For demo purposes, provide a default palette
const defaultPalette: Palette = {
  id: "demo-1",
  name: "Ocean Breeze",
  description: "A calming palette inspired by ocean waters",
  colors: [
    { id: "1", hex: "#3B82F6", locked: false, name: "Ocean Blue", role: "primary" },
    { id: "2", hex: "#F1F5F9", locked: false, name: "Light Gray", role: "secondary" },
    { id: "3", hex: "#06B6D4", locked: false, name: "Cyan", role: "accent" },
    { id: "4", hex: "#FFFFFF", locked: false, name: "White", role: "background" },
    { id: "5", hex: "#334155", locked: false, name: "Slate", role: "foreground" },
    { id: "6", hex: "#FFFFFF", locked: false, name: "Card White", role: "card" },
    { id: "7", hex: "#E2E8F0", locked: false, name: "Border Gray", role: "border" },
    { id: "8", hex: "#F8FAFC", locked: false, name: "Muted", role: "muted" },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublic: true,
  tags: ["blue", "ocean", "calm"],
  favoriteCount: 42,
  isFavorite: true,
};

const PalettePlayground: React.FC<PlaygroundProps> = ({ palette = defaultPalette, className = '' }) => {
  const colorVariables = React.useMemo(() => createColorVariables(palette), [palette]);

  const getColorByRole = (role: ColorRole): Color | undefined => {
    return palette.colors.find((color: Color) => color.role === role);
  };

  const formatColorInfo = (role: ColorRole): { hex: string; hsl: string } => {
    const color = getColorByRole(role);
    const hsl = colorVariables[role];
    const hex = color?.hex || '#000000';

    return { hex, hsl };
  };

  return (
    <div className={`min-h-screen flex bg-gray-50 ${className}`}>
      {/* Palette Info Panel */}
      <div className="w-80 bg-white shadow-lg p-6 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <PaletteIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Preview: {palette.name}</h2>
        </div>

        {palette.description && (
          <p className="text-sm text-gray-600 mb-6">{palette.description}</p>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Color Assignments</h3>

          {ColorRoles.map((role: ColorRole) => {
            const colorInfo = formatColorInfo(role);
            const assignedColor = getColorByRole(role);

            return (
              <div key={role} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">
                    {role.replace('-', ' ')}
                  </label>
                  <div
                    className="w-8 h-8 rounded border shadow-sm flex-shrink-0"
                    style={{ backgroundColor: colorInfo.hex }}
                    title={`${colorInfo.hex} (${colorInfo.hsl})`}
                  />
                </div>

                {assignedColor ? (
                  <div className="text-xs space-y-1">
                    <div className="font-mono text-gray-600">{colorInfo.hex}</div>
                    <div className="font-mono text-gray-500">{colorInfo.hsl}</div>
                    {assignedColor.name && (
                      <div className="text-gray-700">"{assignedColor.name}"</div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">Using default</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Colors: {palette.colors.length}</div>
            <div>Assigned: {palette.colors.filter(c => c.role).length}</div>
            {palette.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {palette.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <PreviewContainer colorVariables={colorVariables}>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center py-16 bg-card rounded-lg border">
            <Badge variant="secondary" className="mb-4">Live Preview</Badge>
            <h1 className="text-4xl font-bold text-card-foreground mb-4">
              {palette.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {palette.description || 'Experience your color palette in action across various UI components and layouts.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <PaletteIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Dynamic Theming</CardTitle>
                <CardDescription>
                  Your palette colors applied across all components
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Copy className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Real-time Preview</CardTitle>
                <CardDescription>
                  See instant changes as you modify your palette
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Export-ready color values for your design system
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Component Showcase */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Component Showcase</h2>

            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Different button variants with your palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground block mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground block mb-2">Name</label>
                    <Input type="text" placeholder="Your name" />
                  </div>
                </div>
                <Button>Submit Form</Button>
              </CardContent>
            </Card>

            {/* Badges & Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Progress</CardTitle>
                <CardDescription>Badges and progress indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Progress</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertTitle>Palette Applied Successfully!</AlertTitle>
              <AlertDescription>
                Your "{palette.name}" palette is now being previewed across all components.
                {palette.colors.filter(c => c.role).length} colors are actively assigned to roles.
              </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Colors', value: palette.colors.length.toString(), change: 'assigned' },
                { label: 'Color Roles', value: palette.colors.filter(c => c.role).length.toString(), change: 'active' },
                { label: 'Tags', value: palette.tags.length.toString(), change: 'labels' },
                { label: 'Status', value: palette.isPublic ? 'Public' : 'Private', change: 'visibility' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-sm text-accent font-medium mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PreviewContainer>
    </div>
  );
};

export default PalettePlayground;