import Image from "next/image"
import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: "AI-Powered Design",
    description: "Our advanced algorithms create unique, tailored logos based on your brand's characteristics.",
    image: "/placeholder.png",
    benefits: [
      "Unique, custom-tailored designs",
      "Instant generation in seconds",
      "Unlimited revisions and customizations",
    ],
  },
  {
    title: "Vast Style Library",
    description: "Access a wide range of logo styles, from minimalist to elaborate, suiting every industry and preference.",
    image: "/placeholder.png",
    benefits: [
      "Diverse design options",
      "Industry-specific suggestions",
      "Trending styles updated regularly",
    ],
  },
  {
    title: "Easy Customization",
    description: "Fine-tune your chosen logo with our intuitive editor, adjusting colors, fonts, and layouts effortlessly.",
    image: "/placeholder.png",
    benefits: [
      "User-friendly interface",
      "Real-time preview",
      "Professional design tools",
    ],
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="cute-underline">Powerful Features</span>
        </h2>
        {features.map((feature, index) => (
          <div key={index} className="grid gap-12 md:grid-cols-2 items-center mb-24 last:mb-0">
            <div className={`relative ${index % 2 === 1 ? 'md:order-last' : ''}`}>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden relative z-10">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute w-full h-full top-4 left-4 bg-primary rounded-2xl -z-10"></div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-lg text-muted-foreground mb-8">{feature.description}</p>
              <ul className="space-y-4">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-3">
                    <CheckCircle className="text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

