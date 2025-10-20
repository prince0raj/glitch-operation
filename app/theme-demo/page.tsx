"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function ThemeDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Theme Demo</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Card Component</h2>
            <p className="text-muted-foreground mb-4">
              This card demonstrates how the theme system works with shadcn/ui components.
            </p>
            <div className="space-x-2">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Muted Background</h3>
            <p className="text-muted-foreground">
              This section uses muted colors that adapt to the theme.
            </p>
          </div>
        </div>
        
        <div className="bg-primary text-primary-foreground p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Primary Colors</h3>
          <p>This section uses primary theme colors.</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Theme Colors Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border p-4 rounded text-center">
              <div className="w-full h-8 bg-background border rounded mb-2"></div>
              <span className="text-sm">background</span>
            </div>
            <div className="bg-card border p-4 rounded text-center">
              <div className="w-full h-8 bg-card border rounded mb-2"></div>
              <span className="text-sm">card</span>
            </div>
            <div className="bg-primary p-4 rounded text-center text-primary-foreground">
              <div className="w-full h-8 bg-primary rounded mb-2"></div>
              <span className="text-sm">primary</span>
            </div>
            <div className="bg-secondary p-4 rounded text-center text-secondary-foreground">
              <div className="w-full h-8 bg-secondary rounded mb-2"></div>
              <span className="text-sm">secondary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
