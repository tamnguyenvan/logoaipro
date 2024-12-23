'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientBackground } from "@/components/misc/gradient-background"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <GradientBackground from="rgba(255, 255, 255, 0)" to="rgba(219, 234, 254, 0.1)" className="py-24">
      <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Generate {" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
            Logos
          </span>{" "}
          in Seconds
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Create professional logos in minutes!
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Button size="lg" className="mt-8" asChild>
            <Link href="/design">
              Start My Design
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <div className="mt-16 w-full max-w-5xl">
          <div className="relative rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Image
              src="/placeholder.svg?height=720&width=1280"
              alt="Logo Editor Interface"
              width={1280}
              height={720}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}

