import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ThemeTest() {
  return (
    <div className="space-y-8 p-6">
      {/* Buttons */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      {/* Card */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Theme Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a card to test background, text, and border colors.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Form Elements */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Form Elements</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Type here..." />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="theme-switch" />
            <Label htmlFor="theme-switch">Enable Dark Mode</Label>
          </div>
        </div>
      </section>

      <Separator />

      {/* Progress */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Progress</h2>
        <Progress value={45} />
      </section>

      <Separator />

      {/* Tabs */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Tabs</h2>
        <Tabs defaultValue="account" className="w-[300px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <p>Account settings go here.</p>
          </TabsContent>
          <TabsContent value="password">
            <p>Password settings go here.</p>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Alerts */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Alerts</h2>
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is a default alert to test background and text colors.
          </AlertDescription>
        </Alert>
      </section>

      <Separator />

      {/* Tooltip */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Tooltip</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </section>
    </div>
  );
}
