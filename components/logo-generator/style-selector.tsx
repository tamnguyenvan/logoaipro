import { Check } from 'lucide-react'
import { logoStyles } from '@/lib/data/logo'
import { LogoStyle } from '@/types/generation'

interface StyleSelectorProps {
  selectedStyle: LogoStyle;
  onStyleSelect: (style: LogoStyle) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Choose a style</label>
        <span className="text-xs text-muted-foreground">Select the perfect style for your brand</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {logoStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              selectedStyle.id === style.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="w-full aspect-square mb-3 rounded-lg bg-background flex items-center justify-center p-4">
              <img 
                src={style.preview} 
                alt={style.directive} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-full text-center space-y-1">
              <div className="font-medium text-sm line-clamp-1">{style.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 h-8">
                {style.description}
              </div>
            </div>
            {selectedStyle.id === style.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}