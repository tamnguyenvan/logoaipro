import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Basic",
    price: "$9",
    description: "Perfect for individuals and small businesses",
    features: [
      "5 AI-generated logos per month",
      "Basic customization options",
      "PNG downloads",
      "Email support",
    ],
  },
]

export default function Pricing() {
  return (
    <section className="py-24 px-4 bg-secondary">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="cute-underline">Pricing Plans</span>
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your logo design needs
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center md:justify-center">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${index === 1 ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{index === 2 ? 'Contact Sales' : 'Get Started'}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

