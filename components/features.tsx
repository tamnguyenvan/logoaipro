'use client';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Wand2, Palette, Settings } from "lucide-react"
import { GradientBackground } from "@/components/misc/gradient-background"

export default function Features() {
  const features = [
    {
      title: "AI-Powered Logo Generator",
      description: "Transform your ideas into stunning logos instantly. Our advanced AI understands your requirements and generates unique, professional logos tailored to your brand identity.",
      icon: <Wand2 className="h-6 w-6 text-emerald-600" />,
      imageSrc: "/images/features/placeholder.png",
      imageAlt: "AI logo generator interface",
      buttonText: "Create Logo"
    },
    {
      title: "Choose Your Style",
      description: "Select from a variety of design styles to match your brand personality. From minimalist to modern, artistic to corporate, find the perfect style that represents your brand.",
      icon: <Palette className="h-6 w-6 text-emerald-600" />,
      imageSrc: "/images/features/placeholder.png",
      imageAlt: "Logo style selection interface",
      buttonText: "Explore Styles"
    },
    {
      title: "Advanced Editing Tools",
      description: "Fine-tune your logo with our comprehensive editing suite. Adjust colors, fonts, spacing, and more to perfect every detail of your design.",
      icon: <Settings className="h-6 w-6 text-emerald-600" />,
      imageSrc: "/images/features/placeholder.png",
      imageAlt: "Advanced editing tools interface",
      buttonText: "Try Editor"
    }
  ];

  return (
    <GradientBackground 
      from="rgba(254, 215, 170, 0.1)" 
      to="rgba(253, 186, 116, 0.1)" 
      className="py-12 sm:py-24"
    >
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 sm:mb-20 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Create Your Perfect Logo
        </h2>
        
        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`grid gap-8 md:gap-12 lg:gap-16 items-center ${
                index % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-2 md:flex-row-reverse'
              }`}
            >
              <div className={`relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden ${
                index % 2 === 1 ? 'md:order-2' : ''
              }`}>
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              <div className="flex flex-col space-y-6">
                <h3 className="text-2xl font-bold sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  {feature.icon}
                </div>
                <Button size="lg" className="w-full sm:w-auto">
                  {feature.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}