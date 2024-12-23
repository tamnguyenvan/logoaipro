'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientBackground } from "./misc/gradient-background";

const steps = [
  {
    number: 1,
    title: "Describe Your Idea",
    description: "Share the concept of your logo to help our AI generate tailored designs.",
    details: "Provide insights about your business or the logo you envision for optimal results."
  },
  {
    number: 2,
    title: "Generate Logos",
    description: "Let the AI create multiple unique logo concepts within seconds.",
    details: "Watch as the AI provides you with a variety of logos based on your description."
  },
  {
    number: 3,
    title: "Customize and Save",
    description: "Refine your chosen logo and save it with high resolution.",
    details: "Use editing tools to tweak your design before downloading the final version."
  },
];

export default function Steps() {
  return (
    <GradientBackground
      from="rgba(219, 234, 254, 0.1)"
      to="rgba(254, 215, 170, 0.1)"
      className="py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            How to generate logos in seconds?
          </h1>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="bg-gray-200/50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 p-2"
            >
              <CardHeader>
                {/* Step Number */}
                <div className="mb-4">
                  <div className="inline-block bg-gray-200/90 dark:bg-slate-700 rounded-xl px-4 py-2 font-medium text-blue-600">
                    Step {step.number}
                  </div>
                </div>

                {/* Step Title */}
                <CardTitle className="text-2xl mb-4">{step.title}</CardTitle>

                {/* Step Description */}
                <p className="text-gray-600/80 dark:text-gray-400 mb-4">
                  {step.description}
                </p>
              </CardHeader>

              <CardContent>
                {/* Step Details */}
                <p className="text-gray-600/80 dark:text-gray-400">
                  {step.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
