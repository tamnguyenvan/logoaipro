'use client'

import { z } from 'zod'
import { useRef, useState, useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Sparkles, Download, Command, Check } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { promptSchema } from '@/lib/validations/generation'
import toast from 'react-hot-toast'
import { generateLogoAction } from '@/app/actions/generation'
import { fetchGenerationsLeftAction } from '@/app/actions/generation'
import { downloadLogoAction } from '@/app/actions/download'
import { checkoutAction } from '@/app/actions/checkout'
import { useAction } from 'next-safe-action/hooks';
import { getUserAction } from '@/app/actions/session';
import { type LogoStyle } from '@/types/generation'
import { logoStyles, loadingMessages, promptExamples } from '@/lib/data/logo'

type PromptFormData = z.infer<typeof promptSchema>;

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
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="relative">
            <CardTitle>Describe Your Logo</CardTitle>
            <div className="absolute top-4 right-4 flex items-center">
              {isFetchingGenerationsLeft ? (
                <Skeleton className="h-4 w-1/2" />
              ) : (
                userResult.data?.user && (
                  <Badge variant="secondary">
                    <span className="font-medium">Generations left: {generationsLeftResult.data?.generationsLeft ?? 0}</span>
                  </Badge>
                )
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Example prompts:</label>
                <div className="flex flex-wrap gap-2">
                  {promptExamples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs"
                    >
                      {example.label}
                    </Button>
                  ))}
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    name="prompt"
                    placeholder="Describe your business or logo ideas..."
                    value={formData.prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
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
                  disabled={isGenerating || rateLimitLeft <= 0 || (userResult.data?.user !== null && (generationsLeftResult.data?.generationsLeft ?? 0) <= 0)}
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

              {userResult.data?.user && !isGenerating && generationsLeftResult.data?.generationsLeft <= 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    You've run out of logo generations. Purchase more to continue creating logos.
                  </AlertDescription>
                  <Button onClick={handleBuyCredits} className="mt-2">
                    Buy More Credits
                  </Button>
                </Alert>
              )}
              {/* Style Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Choose a style:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {logoStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative group p-4 rounded-lg border-2 transition-all ${selectedStyle.id === style.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <div className="aspect-square mb-2 text-primary">
                        <img src={style.preview} alt={style.directive} className="object-contain max-w-[50px] max-h-[50px]" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{style.name}</div>
                        <div className="text-xs text-muted-foreground">{style.description}</div>
                      </div>
                      {selectedStyle.id === style.id && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square flex flex-col items-center justify-center bg-muted rounded-lg overflow-hidden relative">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground text-lg font-medium animate-pulse">
                    {loadingMessage}
                  </p>
                </div>
              ) : (generationResult.data?.generationId) ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="flex-grow flex items-center justify-center p-4">
                    <img
                      src={generationResult.data?.generationId ? `/api/logo/${generationResult.data.generationId}` : '/placeholder-image.svg'}
                      alt="Generated Logo"
                      width={128}
                      height={128}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-row w-full items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="lg"
                          variant="default"
                          className="font-semibold"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 transition-all duration-200 ease-in-out">
                        {isDownloading ? <DropdownMenuItem className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out text-sm font-medium cursor-pointer" disabled>
                          Downloading...
                        </DropdownMenuItem>
                          : <DropdownMenuItem className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out text-sm font-medium cursor-pointer"
                            onClick={() => handleDownload(generationResult.data?.generationId || '')}>
                            Download Preview (Free)
                          </DropdownMenuItem>
                        }
                        <DropdownMenuItem className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out text-sm font-medium cursor-pointer"
                          onClick={() => handleDownloadHires(generationResult.data?.generationId || '')}>
                          {/* Buy Hi-Res ({isPriceLoading ? '...' : `$${hiresPrice}`}) */}
                          Buy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                  <p>Your generated logo will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}