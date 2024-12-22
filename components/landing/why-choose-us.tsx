'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Palette, Rocket, HeadphonesIcon, CreditCard, ShieldCheck, ArrowRight, Star } from 'lucide-react'
import Link from "next/link"

const reasons = [
  { 
    title: "AI-powered design intelligence", 
    icon: Zap,
    description: "Experience cutting-edge AI technology that creates unique, tailored logos based on your brand's characteristics.",
    stats: { label: "Logos Generated", value: "100K+" }
  },
  { 
    title: "Customizable to your brand", 
    icon: Palette,
    description: "Fine-tune your chosen logo with our intuitive editor, adjusting colors, fonts, and layouts effortlessly.",
    stats: { label: "Design Options", value: "1000+" }
  },
  { 
    title: "Fast and efficient process", 
    icon: Rocket,
    description: "Generate professional logos in seconds, saving you time and effort in your branding process.",
    stats: { label: "Generation Speed", value: "<5s" }
  },
  { 
    title: "24/7 customer support", 
    icon: HeadphonesIcon,
    description: "Our dedicated support team is always ready to assist you with any questions or concerns.",
    stats: { label: "Response Time", value: "<1h" }
  },
  { 
    title: "Affordable pricing options", 
    icon: CreditCard,
    description: "Choose from a range of pricing plans that suit your budget and business needs.",
    stats: { label: "Starting from", value: "$9.99" }
  },
  { 
    title: "Secure and confidential", 
    icon: ShieldCheck,
    description: "Your designs and data are protected with state-of-the-art security measures.",
    stats: { label: "Data Protection", value: "256-bit" }
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border bg-muted/50 text-muted-foreground text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Unmatched Features and Benefits
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              LogoAIPro?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the advantages that set us apart and make your logo creation experience exceptional.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{reason.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-bold text-primary">{reason.stats.value}</span>
                      <span className="text-muted-foreground ml-1">{reason.stats.label}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="group" asChild>
                      <Link href="/learn-more" className="flex items-center">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

