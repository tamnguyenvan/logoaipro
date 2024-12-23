'use client'

import { z } from 'zod'
import { useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton'
import { ExamplePrompts } from './example-prompts'
import { PromptInput } from './prompt-input'
import { StyleSelector } from './style-selector'
import { GeneratedLogo } from './generated-logo'
import { NoCreditsAlert } from './no-credits-alert'
import { GenerationsLeftBadge } from './credits-badge'
import { GradientBackground } from '@/components/misc/gradient-background'
import { getUserAction } from '@/app/actions/session'
import {
  fetchGenerationsLeftAction,
  generateLogoAction
} from '@/app/actions/generation'
import { checkoutAction } from '@/app/actions/checkout'
import { downloadLogoAction } from '@/app/actions/download'
import { logoStyles, loadingMessages } from '@/lib/data/logo'
import { LogoStyle } from '@/types/generation'
import { promptSchema } from '@/lib/validations/generation'
import { PromptFormData } from './types'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function LogoGenerator() {
  const {
    execute: getUser,
    result: userResult,
    isPending
  } = useAction(getUserAction, {});

  useEffect(() => {
    getUser();
  }, [getUser]);

  const {
    execute: fetchGenerationsLeft,
    result: generationsLeftResult,
    isPending: isFetchingGenerationsLeft
  } = useAction(fetchGenerationsLeftAction, {
    onSuccess: (data) => {
    },
    onError: (data) => {
      toast.error(data.error.serverError || 'Failed to fetch generation left')
    }
  })

  const {
    execute: generateLogo,
    result: generationResult,
    isPending: isGenerating
  } = useAction(generateLogoAction, {
    onSuccess: (data) => {
      toast.success('Logo generated successfully!')
      fetchGenerationsLeft()
    },
    onError: (data) => {
      toast.error(data.error.serverError || 'Failed to generate logo')
    }
  })

  const {
    execute: checkout,
    result: checkoutResult,
    isPending: isCheckingOut
  } = useAction(checkoutAction, {
    onSuccess: (data) => {
      if (checkoutResult.data?.checkoutUrl) {
        router.push(checkoutResult.data.checkoutUrl)
      }
    },
    onError: (data) => {
      toast.error(data.error.serverError || 'Failed to initiate checkout')
    }
  })

  useEffect(() => {
    fetchGenerationsLeft()
  }, [fetchGenerationsLeft])

  const {
    execute: downloadLogo,
    result: downloadResult,
    isPending: isDownloading
  } = useAction(downloadLogoAction, {
    onSuccess: (result) => {
      if (result.data?.downloadUrl) {
        console.log(result.data?.downloadUrl)
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = result.data.downloadUrl; // Use the presigned URL
        link.download = 'generated-logo.png'; // Suggested file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Logo downloaded successfully!');
      } else {
        console.error('Error: No download URL found in the response');
        toast.error('Failed to download logo.');
      }
    },
    onError: (data) => {
      toast.error(data.error.serverError || 'Failed to download logo')
    }
  })

  // Track prompt
  const [prompt, setPrompt] = useState('')

  // Track selected style
  const [selectedStyle, setSelectedStyle] = useState(logoStyles[0])

  // Messages during generation
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])

  // Router
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<PromptFormData>({
    prompt: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PromptFormData, string>>>({})

  const validateForm = () => {
    try {
      promptSchema.parse(formData)
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof PromptFormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof PromptFormData] = err.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrompt(value); // Update the prompt state
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleExampleClick = (example: { label: string; text: string; style: LogoStyle }) => {
    setFormData(prev => ({
      ...prev,
      prompt: example.text
    }))
    setValidationErrors(prev => ({
      ...prev,
      prompt: ""
    }))
    setSelectedStyle(example.style)
  }

  // Rate limiting
  const [rateLimitLeft, setRateLimitLeft] = useState<number>(5) // 5 requests per minute
  const [rateLimitReset, setRateLimitReset] = useState<Date>(new Date())

  useEffect(() => {
    // Reset rate limit every minute
    const interval = setInterval(() => {
      if (new Date() >= rateLimitReset) {
        setRateLimitLeft(5)
        setRateLimitReset(new Date(Date.now() + 60000))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [rateLimitReset])

  // Submit prompt
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error(validationErrors.prompt || 'Invalid prompt')
      return
    }

    if (!userResult.data?.user) {
      router.push('/login')
      return
    }

    if (rateLimitLeft <= 0) {
      const timeLeft = Math.ceil((rateLimitReset.getTime() - Date.now()) / 1000)
      toast.error(`Rate limit exceeded. Please try again in ${timeLeft} seconds.`)
      return
    }

    if ((generationsLeftResult.data?.generationsLeft ?? 0) <= 0) {
      toast.error('You\'ve run out of generations. Purchase more to continue.')
      return
    }

    try {
      setRateLimitLeft(prev => prev - 1)
      const sanitizedPrompt = formData.prompt.trim().replace(/<[^>]*>?/gm, '') // Basic XSS protection
      generateLogo({
        prompt: sanitizedPrompt,
        // style: selectedStyle.id
      })
    } catch (error) {
      console.error('Error generating logo:', error)
    }
  }

  // Update message during generation
  useEffect(() => {
    let messageIndex = 0;
    let messageInterval: NodeJS.Timeout | null = null;

    if (isGenerating) {
      messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 10000);
    }

    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [isGenerating]);

  const handleBuyCredits = async () => {
    try {
      const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BUY_CREDITS_PLAN_ID
      if (!variantId) {
        throw new Error('Invalid variant ID')
      }

      checkout({ variantId })

      if (checkoutResult.serverError) {
        throw new Error('Failed to create checkout session')
      }

      if (!checkoutResult.data?.checkoutUrl) {
        throw new Error('Invalid checkout URL')
      }
      router.push(checkoutResult.data.checkoutUrl)
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  const handleDownload = async (generationId: string) => {
    try {
      downloadLogo({ generationId })
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  };

  const handleDownloadHires = async (generationId: string) => {
    try {
      const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_DOWNLOAD_HIRES_ID as string;
      checkout({ variantId, generationId });
      if (checkoutResult.serverError) {
        throw new Error('Failed to create checkout session');
      }

      if (!checkoutResult.data?.checkoutUrl) {
        throw new Error('Invalid checkout URL');
      }
      router.push(checkoutResult.data.checkoutUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session. Please try again.');
    }
  }

  return (
    <GradientBackground
      from="rgba(255, 255, 255, 0)"
      to="rgba(219, 234, 254, 0.1)"
      className="py-12 sm:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Enhanced Title Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-sm font-medium text-primary">
            Create Your Perfect Logo
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            <span className="relative cute-underline">
              AI Logo Generator
              <span className="absolute -right-12 top-0">✨</span>
            </span>
          </h1>
          <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Describe your brand and let our AI create a unique logo for you in seconds.
            <span className="hidden sm:inline"> It's that simple!</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Card */}
          <Card className="bg-white/50 backdrop-blur-sm border dark:bg-gray-800/50">
            <CardHeader className="relative">
              <CardTitle>Describe Your Logo</CardTitle>
              <div className="absolute top-4 right-4 flex items-center">
                {isFetchingGenerationsLeft ? (
                  <Skeleton className="h-4 w-1/2" />
                ) : (
                  userResult.data?.user && (
                    <GenerationsLeftBadge
                      generationsLeft={generationsLeftResult.data?.generationsLeft ?? 0}
                    />
                  )
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <ExamplePrompts onExampleClick={handleExampleClick} />
                <PromptInput
                  formData={formData}
                  isGenerating={isGenerating}
                  rateLimitLeft={rateLimitLeft}
                  generationsLeft={generationsLeftResult.data?.generationsLeft}
                  onInputChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onSubmit={handleSubmit}
                />
                {userResult.data?.user && !isGenerating && generationsLeftResult.data?.generationsLeft <= 0 && (
                  <NoCreditsAlert onBuyCredits={handleBuyCredits} />
                )}

                {/* Divider before StyleSelector */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                </div>

                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleSelect={setSelectedStyle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Card */}
          <Card className="bg-white/50 backdrop-blur-sm border dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>Generated Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <GeneratedLogo
                isGenerating={isGenerating}
                isDownloading={isDownloading}
                generationId={generationResult.data?.generationId}
                loadingMessage={loadingMessage}
                onDownload={handleDownload}
                onDownloadHires={handleDownloadHires}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </GradientBackground>
  )
}