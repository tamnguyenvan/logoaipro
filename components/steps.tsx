'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Wand2, Download, ArrowRight, CheckCircle2, PenTool } from 'lucide-react'
import { motion } from "framer-motion"

const steps = [
  {
    title: "Describe Your Logo",
    description: "Input a description of your business or the logo you envision. Our AI uses this to create tailored designs just for you.",
    icon: Lightbulb,
    benefits: ["AI-powered prompt analysis", "Business-specific designs", "Unlimited description length"],
  },
  {
    title: "AI Logo Generation",
    description: "Watch as our advanced AI transforms your input into multiple unique logo concepts in just 40-60 seconds.",
    icon: Wand2,
    benefits: ["Fast generation (40s-1min)", "Multiple design options", "AI-powered creativity"],
  },
  {
    title: "Edit and Download",
    description: "Fine-tune your chosen logo with our editing tools, then download your high-resolution files by using credits.",
    icon: Download,
    benefits: ["Advanced editing features", "Transparent background option", "High-res downloads with credits"],
  },
]

export default function Steps() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background/50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 max-w-md blur-[120px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(var(--primary), 0.15), transparent 70%)',
        }}
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border bg-background text-sm font-medium">
            <span className="text-primary mr-2">Simple Process</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Quick Results</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Generate Your Logo in
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"> Three Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI Logo Generator helps you turn logo ideas into designs in seconds.
            Follow these steps to bring your brand to life.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3 relative"
        >
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20" />
          
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="relative group bg-background/50 backdrop-blur-sm border-2 hover:border-primary/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                <CardHeader className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardHeader>

                <CardContent className="relative">
                  <div className="space-y-3 mt-4">
                    {step.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </section>
  )
}