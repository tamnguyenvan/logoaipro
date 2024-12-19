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
      "Our AI analyzes your brand information and generates unique logo designs based on that input. It combines elements, colors, and typography to create custom logos.",
  },
  {
    question: "Can I edit the generated logos?",
    answer:
      "Yes, you can customize and edit the generated logos to fine-tune them to your preferences.",
  },
  {
    question: "What file formats do I receive?",
    answer:
      "You'll receive your logo in various formats including PNG, JPG, SVG, and PDF, suitable for both digital and print use.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We offer various pricing plans to suit different needs. Check our pricing page for detailed information.",
  },
]

export default function FAQ() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="cute-underline">Frequently Asked Questions</span>
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-2 border-primary/10">
              <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
