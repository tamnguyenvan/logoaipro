'use client'

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Sparkles, Download, Pencil } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import { useGenerations } from '@/hooks/useGenerations'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

interface ModelResponse {
  image: string;
}

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { generationsRemaining, generationsLoading, refetchGenerations } = useGenerations()
  const router = useRouter()
  const { session } = useAuth()

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
      redirect(`/login?returnTo=${encodeURIComponent(window.location.href)}&prompt=${encodeURIComponent(prompt)}`);
    }

    if (!generationsLoading && (generationsRemaining ?? 0) <= 0) {
      alert("You've run out of generations. Please purchase more to continue.")
      return
    }

    if (!prompt) {
      alert("Please enter a prompt.")
      return
    }

    setGeneratedLogo(null)
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

      const data = await response.json() as ModelResponse
      setGeneratedLogo(data.image)
      await refetchGenerations();
    } catch (error) {
      console.error('Error generating logo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyGenerations = () => {
    // TODO: Implement purchase logic
    alert("Redirecting to purchase page...")
  }
  
  const editImage = (generatedLogo: string) => {
    redirect(`/logo-editor?imageUrl=${encodeURIComponent(generatedLogo)}`);
  }

  const downloadImage = async (url: string) => {
    try {
      // Fetch the image data
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'generated-logo.png';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
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
                  <Button type="submit" size="lg" disabled={session !== null && (isLoading || (generationsRemaining ?? 0) <= 0)} className="w-full">
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
                  <Button onClick={handleBuyGenerations} className="mt-2">
                    Buy More Generations
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
                    Generating logo...
                  </p>
                </div>
              ) : generatedLogo ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="flex-grow flex items-center justify-center p-4">
                    <img
                      src={generatedLogo}
                      alt="Generated Logo"
                      width={128}
                      height={128}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-row w-full items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
                    <Button
                      onClick={() => editImage(generatedLogo)} // Assuming you have an editImage function
                      className="mr-2" // Add margin to the right for spacing
                      size="lg"
                      variant="outline"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Logo
                    </Button>
                    <Button
                      onClick={() => downloadImage(generatedLogo)}
                      size="lg"
                      variant="default"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
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