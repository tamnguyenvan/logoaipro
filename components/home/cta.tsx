import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Create Your Perfect Logo?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and start designing now!
        </p>
        <Button size="lg" variant="secondary" className="rounded-full text-lg px-8">
          Get Started for Free
        </Button>
      </div>
    </section>
  )
}

