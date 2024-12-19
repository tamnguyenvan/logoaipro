'use client'

import { motion } from "framer-motion"
import { Check, Star, Download, CreditCard, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free Plan",
    price: "Free",
    description: "Perfect for trying out our AI logo generator",
    features: [
      "Download generated logo preview (128x128)",
      "10 free credits per day",
      "1 credit = 1 logo generation",
    ],
    cta: "Start Free",
    icon: Download,
    popular: false
  },
  {
    name: "High Resolution",
    price: "$9.99",
    description: "Get a high-quality version of your logo",
    features: [
      "One-time purchase per image",
      "High resolution logo (1024x1024)",
      "Perfect for professional use",
    ],
    cta: "Purchase Now",
    icon: Zap,
    popular: true
  },
  {
    name: "Credit Pack",
    price: "$5",
    description: "For users who need multiple generations",
    features: [
      "50 credits",
      "One-time purchase",
      "Generate more logos at a discount",
    ],
    cta: "Buy Credits",
    icon: CreditCard,
    popular: false
  }
]

export default function Pricing() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border bg-muted/50 text-muted-foreground text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Flexible Options for Every Need
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your logo design needs and start creating stunning logos today.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full lg:w-1/3"
            >
              <Card className={`flex flex-col h-full ${plan.popular ? 'border-primary shadow-lg relative overflow-hidden' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-6">
                    {plan.price}
                    {plan.name === "High Resolution" && <span className="text-lg font-normal text-muted-foreground">/image</span>}
                    {plan.name === "Credit Pack" && <span className="text-lg font-normal text-muted-foreground">/50 credits</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="text-primary mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                    <Zap className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

