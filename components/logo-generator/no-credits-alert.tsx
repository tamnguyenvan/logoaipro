import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface NoCreditsAlertProps {
  onBuyCredits: () => void;
}

export function NoCreditsAlert({ onBuyCredits }: NoCreditsAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Attention</AlertTitle>
      <AlertDescription>
        You've run out of logo generations. Purchase more to continue creating logos.
      </AlertDescription>
      <Button onClick={onBuyCredits} className="mt-2">
        Buy More Credits
      </Button>
    </Alert>
  )
}