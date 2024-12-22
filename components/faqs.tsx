'use client'

import { motion } from "framer-motion"
import { Star, HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does LogoAIPro work?",
    answer:
      "Our advanced AI model analyzes your prompt or business description and generates unique logo images for you. Simply input your ideas, and our AI will create custom logos based on your specifications.",
  },
  {
    question: "Is LogoAIPro free to use?",
    answer:
      "Yes, users can generate logos for free with a limited number of free generations per day. If you need more, you can easily purchase additional credits to continue creating logos.",
  },
  {
    question: "Why are the generated logos small in size?",
    answer:
      "The initial generated logos are provided in a smaller size for preview purposes. Users can purchase high-resolution versions of their chosen logo designs, ensuring professional quality for all uses.",
  },
  {
    question: "What are credits and how do they work?",
    answer:
      "Credits are the currency used in LogoAIPro to generate logos. You can buy credits to create more logos beyond the free daily limit, giving you the flexibility to design as many logos as you need.",
  },
  {
    question: "How long does it take to generate a logo?",
    answer:
      "On average, it takes between 40 seconds to 1 minute to generate a logo. This quick turnaround allows you to explore multiple design options in a short amount of time.",
  },
  {
    question: "Can I edit the generated logos?",
    answer:
      "LogoAIPro offers advanced editing features. You can crop the logo, create transparent backgrounds, and make other adjustments to perfect your design after generation.",
  },
]

export default function FAQ() {
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
            Got Questions? We've Got Answers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common queries about our AI-powered logo generation service.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border-b-2 border-primary/10 py-2">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors">
                  <div className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-3 text-primary" />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  <p className="mt-2 mb-4">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
