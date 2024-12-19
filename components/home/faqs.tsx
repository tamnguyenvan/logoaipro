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
    question: "How does AI logo generation work?",
    answer:
      "Our AI analyzes your brand information and generates unique logo designs based on that input. It combines elements, colors, and typography to create custom logos that align with your brand identity and preferences.",
  },
  {
    question: "Can I edit the generated logos?",
    answer:
      "You can customize and edit the generated logos to fine-tune them to your preferences. Our intuitive editor allows you to adjust colors, fonts, layouts, and more to ensure your logo perfectly represents your brand.",
  },
  {
    question: "What file formats do I receive?",
    answer:
      "You'll receive your logo in various formats including PNG, JPG, SVG, and PDF, suitable for both digital and print use. This ensures you have the right format for any application, from websites and social media to business cards and signage.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We offer various pricing plans to suit different needs and budgets. Our plans start from as low as $9.99, with options for one-time purchases or subscriptions. Check our pricing page for detailed information on features and pricing tiers.",
  },
  {
    question: "Is my logo unique and copyright protected?",
    answer:
      "Yes, each logo generated is unique to your brand. Once you purchase a logo, you receive full copyright ownership. We ensure that no two customers receive the same logo design.",
  },
  {
    question: "How long does it take to generate a logo?",
    answer:
      "Our AI can generate initial logo concepts in just a few seconds. However, the entire process, including customization and finalization, typically takes 10-15 minutes, depending on your specific requirements and the number of revisions you make.",
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
