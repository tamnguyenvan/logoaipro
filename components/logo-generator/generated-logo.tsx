import { Download, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface GeneratedLogoProps {
  isGenerating: boolean;
  isDownloading: boolean;
  generationId?: string;
  loadingMessage: string;
  onDownload: (generationId: string) => void;
  onDownloadHires: (generationId: string) => void;
}

export function GeneratedLogo({
  isGenerating,
  isDownloading,
  generationId,
  loadingMessage,
  onDownload,
  onDownloadHires
}: GeneratedLogoProps) {
  return (
    <div className="aspect-square flex flex-col items-center justify-center bg-muted rounded-lg overflow-hidden relative">
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg font-medium animate-pulse">
            {loadingMessage}
          </p>
        </div>
      ) : generationId ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="flex-grow flex items-center justify-center p-4">
            <img
              src={`/api/logo/${generationId}`}
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
                  className="font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center"
                className="w-64 p-2"
              >
                {isDownloading ? (
                  <DropdownMenuItem disabled className="flex items-center justify-center py-3">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Downloading...</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="flex flex-col items-start py-3 cursor-pointer"
                    onClick={() => onDownload(generationId)}
                  >
                    <span className="font-medium">Preview Quality</span>
                    <span className="text-xs text-muted-foreground">Free • Web resolution</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="flex flex-col items-start py-3 cursor-pointer"
                  onClick={() => onDownloadHires(generationId)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">High Resolution</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      PRO
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Perfect for printing & branding</span>
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
  )
}