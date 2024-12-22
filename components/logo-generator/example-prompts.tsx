import { Button } from "@/components/ui/button"
import { promptExamples } from '@/lib/data/logo'
import { LogoStyle } from '@/types/generation'

interface ExamplePromptsProps {
  onExampleClick: (example: { label: string; text: string; style: LogoStyle }) => void;
}

export function ExamplePrompts({ onExampleClick }: ExamplePromptsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Example prompts:</label>
      <div className="flex flex-wrap gap-2">
        {promptExamples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onExampleClick(example)}
            className="text-xs"
          >
            {example.label}
          </Button>
        ))}
      </div>
    </div>
  )
}