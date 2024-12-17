import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Palette, Rocket, HeadphonesIcon, CreditCard, ShieldCheck } from 'lucide-react'

const reasons = [
  { title: "AI-powered design intelligence", icon: Zap },
  { title: "Customizable to your brand", icon: Palette },
  { title: "Fast and efficient process", icon: Rocket },
  { title: "24/7 customer support", icon: HeadphonesIcon },
  { title: "Affordable pricing options", icon: CreditCard },
  { title: "Secure and confidential", icon: ShieldCheck },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-4 bg-secondary">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="cute-underline">Why Choose LogoAIPro?</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <Card key={index} className="bg-background border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {<reason.icon className="w-6 h-6 text-primary" />}
                </div>
                <CardTitle className="text-xl">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Experience the difference with our cutting-edge AI technology.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

