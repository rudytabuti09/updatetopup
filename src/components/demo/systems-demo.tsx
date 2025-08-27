"use client"

import * as React from "react"
import { Display, Heading, Text, Lead, Caption } from "@/components/ui/typography"
import { 
  Spinner, 
  LoadingDots, 
  LoadingBars, 
  Skeleton, 
  ProgressBar, 
  LoadingOverlay, 
  LoadingButton 
} from "@/components/ui/loading"
import { useToast, createToast } from "@/components/ui/toast"

export default function SystemsDemo() {
  const { toast } = useToast()
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [loadingButton, setLoadingButton] = React.useState(false)

  // Simulate progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  // Auto-hide overlay after 3 seconds
  React.useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setShowOverlay(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showOverlay])

  const showToastExamples = () => {
    toast(createToast.success("Operation completed successfully!"))
    
    setTimeout(() => {
      toast(createToast.error("Something went wrong. Please try again."))
    }, 1000)
    
    setTimeout(() => {
      toast(createToast.warning("This action cannot be undone."))
    }, 2000)
    
    setTimeout(() => {
      toast(createToast.info("New features available in settings."))
    }, 3000)
    
    setTimeout(() => {
      toast(createToast.neon("System override initiated!", {
        duration: 7000,
        action: {
          label: "Abort",
          onClick: () => console.log("Aborted")
        }
      }))
    }, 4000)
  }

  const handleLoadingButton = () => {
    setLoadingButton(true)
    setTimeout(() => {
      setLoadingButton(false)
      toast(createToast.success("Task completed!"))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 p-fluid-lg space-y-fluid-2xl">
      
      {/* Fluid Typography System Demo */}
      <section className="glass-card p-fluid-xl space-y-fluid-lg">
        <Display size="lg" color="neon-magenta" className="text-center">
          Fluid Typography System
        </Display>
        
        <div className="space-y-fluid-base">
          <Heading size="xl" color="gradient">Display Sizes</Heading>
          <div className="space-y-fluid-sm">
            <Display size="sm">Small Display</Display>
            <Display size="md">Medium Display</Display>
            <Display size="lg">Large Display</Display>
            <Display size="xl">Extra Large Display</Display>
          </div>
        </div>

        <div className="space-y-fluid-base">
          <Heading size="lg" color="neon-cyan">Heading Variants</Heading>
          <div className="space-y-fluid-sm">
            <Heading size="xs">Extra Small Heading</Heading>
            <Heading size="sm">Small Heading</Heading>
            <Heading size="md">Medium Heading</Heading>
            <Heading size="lg">Large Heading</Heading>
            <Heading size="xl">Extra Large Heading</Heading>
          </div>
        </div>

        <div className="space-y-fluid-base">
          <Heading size="lg" color="retro-gold">Text Components</Heading>
          <Lead color="neon" balance>
            This is a lead paragraph that introduces the content with fluid typography
            that scales beautifully across all device sizes.
          </Lead>
          <Text size="lg" balance>
            This is regular text that demonstrates the fluid typography system. 
            The text scales smoothly between minimum and maximum sizes using CSS clamp().
          </Text>
          <Text size="base" color="muted">
            Secondary text with muted coloring for supporting information.
          </Text>
          <Caption>This is caption text for additional context</Caption>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-fluid-lg">
          <div className="space-y-fluid-sm">
            <Heading size="sm" color="neon-magenta">Neon Colors</Heading>
            <Text color="neon-magenta">Neon Magenta Text</Text>
            <Text color="neon-cyan">Neon Cyan Text</Text>
          </div>
          <div className="space-y-fluid-sm">
            <Heading size="sm" color="gradient">Gradient Text</Heading>
            <Text color="gradient">Gradient colored text</Text>
            <Text color="retro-gold">Retro gold text</Text>
          </div>
          <div className="space-y-fluid-sm">
            <Heading size="sm">Responsive Spacing</Heading>
            <Text>Using fluid spacing utilities</Text>
            <div className="p-fluid-base bg-accent/10 rounded-lg">
              <Caption>This container uses fluid padding</Caption>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Loading System Demo */}
      <section className="glass-card p-fluid-xl space-y-fluid-lg">
        <Display size="md" color="neon-cyan" className="text-center">
          Enhanced Loading System
        </Display>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-lg">
          
          <div className="space-y-fluid-base">
            <Heading size="md">Spinners</Heading>
            <div className="flex items-center gap-fluid-base">
              <Spinner variant="default" size="sm" />
              <Spinner variant="primary" size="md" />
              <Spinner variant="neon" size="lg" />
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Loading Dots</Heading>
            <div className="space-y-fluid-sm">
              <LoadingDots size="sm" color="default" />
              <LoadingDots size="md" color="primary" />
              <LoadingDots size="lg" color="neon" />
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Loading Bars</Heading>
            <div className="space-y-fluid-sm">
              <LoadingBars size="sm" color="default" />
              <LoadingBars size="md" color="primary" />
              <LoadingBars size="lg" color="neon" />
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Skeletons</Heading>
            <div className="space-y-fluid-sm">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton variant="neon" className="h-6 w-1/2" />
              <Skeleton variant="pulse" className="h-8 w-full" />
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Progress Bars</Heading>
            <div className="space-y-fluid-sm">
              <ProgressBar value={progress} variant="default" showPercentage />
              <ProgressBar value={75} variant="neon" size="lg" />
              <ProgressBar indeterminate variant="gradient" />
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Interactive</Heading>
            <div className="space-y-fluid-sm">
              <LoadingButton 
                isLoading={loadingButton}
                onClick={handleLoadingButton}
                variant="neon"
              >
                {loadingButton ? "Processing..." : "Start Task"}
              </LoadingButton>
              
              <button
                onClick={() => setShowOverlay(true)}
                className="btn-neon"
              >
                Show Loading Overlay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification System Demo */}
      <section className="glass-card p-fluid-xl space-y-fluid-lg">
        <Display size="md" color="retro-gold" className="text-center">
          Toast Notification System
        </Display>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-lg">
          <div className="space-y-fluid-base">
            <Heading size="md">Toast Variants</Heading>
            <div className="space-y-fluid-sm">
              <button
                onClick={() => toast(createToast.success("Success! Operation completed."))}
                className="btn-retro"
              >
                Success Toast
              </button>
              <button
                onClick={() => toast(createToast.error("Error! Something went wrong."))}
                className="btn-retro"
              >
                Error Toast
              </button>
              <button
                onClick={() => toast(createToast.warning("Warning! Please check your input."))}
                className="btn-retro"
              >
                Warning Toast
              </button>
              <button
                onClick={() => toast(createToast.info("Info: New update available."))}
                className="btn-retro"
              >
                Info Toast
              </button>
              <button
                onClick={() => toast(createToast.neon("Neon Alert! System override active."))}
                className="btn-neon"
              >
                Neon Toast
              </button>
            </div>
          </div>

          <div className="space-y-fluid-base">
            <Heading size="md">Advanced Features</Heading>
            <div className="space-y-fluid-sm">
              <button
                onClick={() => toast({
                  title: "Custom Toast",
                  description: "This toast has a custom action button.",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo clicked")
                  }
                })}
                className="btn-retro"
              >
                Toast with Action
              </button>
              
              <button
                onClick={() => toast({
                  title: "Persistent Toast",
                  description: "This toast won't auto-dismiss.",
                  persistent: true,
                  variant: "neon"
                })}
                className="btn-neon"
              >
                Persistent Toast
              </button>
              
              <button
                onClick={showToastExamples}
                className="btn-neon"
              >
                Show All Toast Types
              </button>
            </div>
          </div>
        </div>

        <div className="p-fluid-base bg-accent/5 rounded-lg">
          <Text size="sm" color="muted" className="text-center">
            Toasts appear in the top-right corner with smooth animations, 
            proper accessibility, and swipe-to-dismiss functionality on mobile.
          </Text>
        </div>
      </section>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={showOverlay}
        variant="neon"
        text="Processing your request..."
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setShowOverlay(false)
          }
        }}
      />
    </div>
  )
}
