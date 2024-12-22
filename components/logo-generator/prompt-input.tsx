import { useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Command } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from 'lucide-react'
import { PromptFormData } from './types'

interface PromptInputProps {
  formData: PromptFormData;
  isGenerating: boolean;
  rateLimitLeft: number;
  generationsLeft?: number;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PromptInput({
  formData,
  isGenerating,
  rateLimitLeft,
  generationsLeft,
  onInputChange,
  onKeyDown,
  onSubmit
}: PromptInputProps) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          name="prompt"
          placeholder="Describe your business or logo ideas..."
          value={formData.prompt}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          rows={6}
          className="w-full resize-none pr-24"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Command className="h-3 w-3" />
          <span>+ ↵</span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isGenerating || rateLimitLeft <= 0 || (generationsLeft !== undefined && generationsLeft <= 0)}
        className="w-full font-semibold">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Logo
          </>
        )}
      </Button>
    </form>
  )
}