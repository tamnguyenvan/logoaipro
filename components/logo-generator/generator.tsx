'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Sparkles, Download, Pencil } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation'
import { useGenerations } from '@/hooks/useGenerations'
import { useAuth } from '@/hooks/useAuth'
import { useDownload } from '@/hooks/useDownload'
import { useCheckout } from '@/hooks/usePayment'
import { usePrice } from '@/hooks/usePrice'

interface LogoGeneration {
  generationId: string;
}

const loadingMessages = [
  "Crafting your unique logo...",
  "Unleashing creativity...",
  "Designing something awesome...",
  "Bringing your vision to life...",
  "Generating logo magic...",
  "Mixing colors and shapes...",
  "Transforming your ideas...",
  "Almost there..."
];

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [logoGeneration, setLogoGeneration] = useState<LogoGeneration | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const { generationsRemaining, generationsLoading, refetchGenerations } = useGenerations()
  const { downloadImage, isDownloading } = useDownload()
  const router = useRouter()
  const { session } = useAuth()
  const { checkout } = useCheckout()
  const { hiresPrice, isPriceLoading } = usePrice()

  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.href)}&prompt=${encodeURIComponent(prompt)}`);
    }

    if (!generationsLoading && (generationsRemaining ?? 0) <= 0) {
      alert("You've run out of generations. Please purchase more to continue.")
      return
    }

    if (!prompt) {
      alert("Please enter a prompt.")
      return
    }

    setLogoGeneration(null)
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      setIsLoading(false)

      if (response.status === 401) {
        const returnTo = encodeURIComponent(window.location.href);
        const encodedPrompt = encodeURIComponent(prompt);
        router.push(`/login?returnTo=${returnTo}&prompt=${encodedPrompt}`);
        return;
      }

      const data = await response.json() as LogoGeneration
      setLogoGeneration(data)
      await refetchGenerations();
    } catch (error) {
      console.error('Error generating logo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let messageIndex = 0;
    let messageInterval: NodeJS.Timeout | null = null;

    if (isLoading) {
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
  }, [isLoading]);

  useEffect(() => {
  }, [])

  const handleBuyCredits = async () => {
    try {
      const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BUY_CREDITS_PLAN_ID as string;
      const checkoutUrl = await checkout(variantId);
      if (!checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }
      router.push(checkoutUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  }

  const handleDownload = async (imageId: string) => {
    try {
      await downloadImage(imageId);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleBuyHires = async (generationId: string) => {
    try {
      const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_DOWNLOAD_HIRES_ID as string;
      const checkoutUrl = await checkout(variantId, generationId);
      if (!checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }
      router.push(checkoutUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="relative">
            <CardTitle>Describe Your Logo</CardTitle>
            <div className="absolute top-4 right-4 flex items-center">
              {generationsLoading ? (
                <Skeleton className="h-4 w-1/2 bg-red-500" />
              ) : (
                session && (
                  <Badge>
                    <span className="font-medium">Generations left: {generationsRemaining ?? 0}</span>
                  </Badge>
                )
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Describe your business or logo ideas (e.g., 'A modern tech startup focused on sustainability')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={6}
                  className="w-full resize-none"
                />
                <div className="flex justify-between items-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={session !== null && (isLoading || (generationsRemaining ?? 0) <= 0)}
                    className="w-full font-semibold">
                    {isLoading ? (
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
                </div>
              </form>

              {session && !generationsLoading && generationsRemaining <= 0 && (
                <Alert variant="destructive" className="mt-8">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    You've run out of logo generations. Purchase more to continue creating logos.
                  </AlertDescription>
                  <Button onClick={() => handleBuyCredits()} className="mt-2">
                    Buy More Credits
                  </Button>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square flex flex-col items-center justify-center bg-muted rounded-lg overflow-hidden relative">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground text-lg font-medium animate-pulse">
                    {loadingMessage}
                  </p>
                </div>
              ) : logoGeneration ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="flex-grow flex items-center justify-center p-4">
                    <img
                      src={logoGeneration.generationId ? `/api/logo/${logoGeneration.generationId}` : '/placeholder-image.svg'}
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
                          : <DropdownMenuItem className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out text-sm font-medium cursor-pointer" onClick={() => handleDownload(logoGeneration.generationId)}>
                            Download Preview (Free)
                          </DropdownMenuItem>
                        }
                        <DropdownMenuItem className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out text-sm font-medium cursor-pointer" onClick={() => handleBuyHires(logoGeneration.generationId)}>
                          Buy Hi-Res ({isPriceLoading ? '...' : `$${hiresPrice}`})
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