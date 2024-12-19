import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Wand2, Download } from 'lucide-react'

const steps = [
  {
    title: "Describe Your Brand",
    description: "Tell us about your brand's personality, values, and target audience.",
    icon: Lightbulb,
  },
  {
    title: "AI Generation",
    description: "Our AI creates multiple logo concepts based on your input.",
    icon: Wand2,
  },
  {
    title: "Download & Use",
    description: "Choose your favorite design, customize if needed, and download.",
    icon: Download,
  },
]

export default function Steps() {
  return (
    <section className="py-24 px-4 bg-secondary">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="cute-underline">How It Works</span>
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Create your perfect logo in just three simple steps with our AI-powered platform.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {<step.icon className="w-6 h-6 text-primary" />}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

