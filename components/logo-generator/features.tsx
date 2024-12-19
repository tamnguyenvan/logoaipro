'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Sparkles, Layout, Palette, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    title: "AI-Powered Design",
    subtitle: "Intelligent Logo Creation",
    description: "Our advanced algorithms create unique, tailored logos based on your brand's characteristics, ensuring each design is perfectly matched to your vision.",
    image: "/placeholder.png",
    icon: Sparkles,
    benefits: [
      "Unique, custom-tailored designs",
      "Instant generation in seconds",
      "Unlimited revisions and customizations",
    ],
    stats: [
      { label: "Logos Generated", value: "100K+" },
      { label: "Happy Users", value: "50K+" },
      { label: "Generation Speed", value: "<5s" },
    ]
  },
  {
    title: "Vast Style Library",
    subtitle: "Endless Possibilities",
    description: "Access a wide range of logo styles, from minimalist to elaborate, suiting every industry and preference. Stay ahead with regularly updated trending designs.",
    image: "/placeholder.png",
    icon: Layout,
    benefits: [
      "Diverse design options",
      "Industry-specific suggestions",
      "Trending styles updated regularly",
    ],
    stats: [
      { label: "Design Styles", value: "1000+" },
      { label: "Industries", value: "50+" },
      { label: "Monthly Updates", value: "100+" },
    ]
  },
  {
    title: "Easy Customization",
    subtitle: "Perfect Your Design",
    description: "Fine-tune your chosen logo with our intuitive editor, adjusting colors, fonts, and layouts effortlessly. Preview changes in real-time for the perfect result.",
    image: "/placeholder.png",
    icon: Palette,
    benefits: [
      "User-friendly interface",
      "Real-time preview",
      "Professional design tools",
    ],
    stats: [
      { label: "Color Palettes", value: "500+" },
      { label: "Pro Fonts", value: "200+" },
      { label: "Export Formats", value: "10+" },
    ]
  },
]

export default function Features() {
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
            Packed with Professional Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Create
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              The Perfect Logo
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features designed to make your logo creation process smooth and professional.
          </p>
        </motion.div>

        {features.map((feature, index) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            key={index}
            className="group relative mb-32 last:mb-0"
          >
            <div className={`grid gap-12 lg:grid-cols-2 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-dense' : ''
            }`}> 
              {/* Conditional Rendering */}
              {index % 2 === 0 ? (
                <>  
                  {/* Image Section */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 z-10" />
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-6 left-6">
                        <div className="bg-card/80 backdrop-blur-sm border shadow-lg rounded-full px-6 py-2 flex items-center space-x-2">
                          <feature.icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{feature.subtitle}</span>
                        </div>
                      </div>
                    </motion.div>
                    {/* Decorative Elements */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  </div>

                  {/* Content Section */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h3 className="text-3xl font-bold mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        {feature.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {feature.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center p-4 rounded-lg bg-muted/50">
                            <div className="font-bold text-xl text-primary mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Benefits List */}
                      <ul className="space-y-4 mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 * benefitIndex }}
                            key={benefitIndex}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="w-5 h-5 text-primary mt-1" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button asChild className="group">
                        <Link href="/logo-generator" className="flex items-center">
                          Try This Feature
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </>
              ) : (
                <>  
                  {/* Content Section First */}
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h3 className="text-3xl font-bold mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        {feature.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {feature.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center p-4 rounded-lg bg-muted/50">
                            <div className="font-bold text-xl text-primary mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Benefits List */}
                      <ul className="space-y-4 mb-8">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 * benefitIndex }}
                            key={benefitIndex}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="w-5 h-5 text-primary mt-1" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button asChild className="group">
                        <Link href="/logo-generator" className="flex items-center">
                          Try This Feature
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Image Section */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 z-10" />
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-6 left-6">
                        <div className="bg-card/80 backdrop-blur-sm border shadow-lg rounded-full px-6 py-2 flex items-center space-x-2">
                          <feature.icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{feature.subtitle}</span>
                        </div>
                      </div>
                    </motion.div>
                    {/* Decorative Elements */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  </div>
                </>
              )
            }</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}