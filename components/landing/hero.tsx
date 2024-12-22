'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/90 to-background/85">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-purple-500/5" />
      
      <div className="container relative pt-12 pb-20 md:pt-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border bg-muted/50 text-muted-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Logo Generator
            <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">New</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block mb-4">Generate Logos</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              with AI Magic
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground"
          >
            Transform your brand identity instantly with our cutting-edge AI logo generator. 
            Create professional, unique logos tailored to your vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link href="/logo-generator" className="flex items-center group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              More Details
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
            <div className="h-full w-full bg-gradient-to-t from-background via-background/50 to-transparent absolute bottom-0 z-10" />
          </div>
          
          <div className="relative z-0">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 z-10" />
              <Image
                src="/public-banner.png"
                alt="AI Generated Logos"
                width={1200}
                height={600}
                className="w-full object-cover rounded-xl"
                priority
              />
            </div>
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-card/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border flex items-center space-x-2"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">AI-Powered • Generate Logos in Seconds</span>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 blur-3xl opacity-20" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
