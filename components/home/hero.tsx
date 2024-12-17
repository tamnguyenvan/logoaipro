import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="py-24 px-4 overflow-hidden relative  bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
          <span className="cute-underline mb-4">Generate Logos</span> <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">with AI Magic</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your brand with our cutting-edge AI logo generator. Unleash creativity at the speed of thought!
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link href="/logo-generator">
            <Button size="lg" className="rounded-full text-lg px-8">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full text-lg px-8">Learn More</Button>
        </div>
      </div>
      <div className="mt-12">
        <Image src="/public-banner.png" alt="AI Generated Logos" width={900} height={450} className="mx-auto rounded-2xl shadow-lg" />
      </div>
    </section>
  )
}

