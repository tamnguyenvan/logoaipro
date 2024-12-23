import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { GradientBackground } from "@/components/misc/gradient-background"

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

export default function Faq() {
  return (
    <GradientBackground from="rgba(253, 186, 116, 0.1)" to="rgba(254, 205, 211, 0.1)" className="py-24">
      <div className="container max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our logo maker
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </GradientBackground>
  )
}

