import Image from "next/image"
import { GradientBackground } from "@/components/misc/gradient-background"

const examples = [
  { title: "Tech Startup", src: "/placeholder.svg?height=300&width=300&text=Tech" },
  { title: "Food & Beverage", src: "/placeholder.svg?height=300&width=300&text=Food" },
  { title: "Fashion Brand", src: "/placeholder.svg?height=300&width=300&text=Fashion" },
  { title: "Creative Agency", src: "/placeholder.svg?height=300&width=300&text=Creative" },
  { title: "Fitness Studio", src: "/placeholder.svg?height=300&width=300&text=Fitness" },
  { title: "Education", src: "/placeholder.svg?height=300&width=300&text=Education" },
]

export default function Examples() {
  return (
    <GradientBackground from="rgba(219, 234, 254, 0.1)" to="rgba(254, 215, 170, 0.1)" className="py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Logo Examples</h2>
          <p className="text-lg text-muted-foreground">
            Discover what you can create with our AI-powered logo generator
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {examples.map((example, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-lg bg-background shadow-md transition-shadow hover:shadow-xl"
            >
              <Image
                src={example.src}
                alt={example.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity group-hover:opacity-100 sm:opacity-0">
                <p className="mt-auto text-sm font-medium text-white">{example.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GradientBackground>
  )
}

