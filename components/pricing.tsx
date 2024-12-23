import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { GradientBackground } from "@/components/misc/gradient-background"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our AI logo generator",
    features: [
      "10 credits per day",
      "1 credit = 1 logo generation",
      "Preview image download (128x128)",
      "Basic editing tools",
      "Community support"
    ]
  },
  {
    name: "Download Package",
    price: "$6.99",
    description: "High-quality logo for your business",
    features: [
      "Everything in Free",
      "High-resolution logo download",
      "Multiple file formats (PNG, JPG, SVG)",
      "Full editing capabilities",
      "Commercial usage rights",
      "30-day money-back guarantee"
    ]
  },
  {
    name: "Credits Package",
    price: "$5",
    description: "For power users and agencies",
    features: [
      "50 credits",
      "Bulk logo generation",
      "Preview image downloads",
      "Access to all editing tools",
      "Priority support",
      "API access (on request)"
    ]
  }
]

export default function Pricing() {
  return (
    <GradientBackground from="rgba(254, 205, 211, 0.1)" to="rgba(219, 234, 254, 0.1)" className="py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your logo needs
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.name === "Credits Package" && <span className="text-muted-foreground">/50 credits</span>}
                  {plan.name === "Download Package" && <span className="text-muted-foreground">/logo</span>}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {plan.name === "Free" ? "Start Free" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </GradientBackground>
  )
}

