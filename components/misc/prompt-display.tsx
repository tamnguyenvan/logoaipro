'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PromptDisplayProps {
  prompt: string
  maxLength?: number
}

export function PromptDisplay({ prompt, maxLength = 100 }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false)

  const truncatedPrompt = prompt.length > maxLength 
    ? `${prompt.slice(0, maxLength)}...` 
    : prompt

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <p className="text-sm text-muted-foreground flex-1 truncate" title={prompt}>
        {truncatedPrompt}
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? 'Copied!' : 'Copy prompt'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

