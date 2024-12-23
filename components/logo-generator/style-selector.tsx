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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Choose a style
        </label>
        <span className="text-xs text-muted-foreground">
          Select the perfect style for your brand
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {logoStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`
              group relative flex flex-col items-center p-3 sm:p-4 
              rounded-xl border-2 transition-all duration-200
              hover:shadow-lg hover:-translate-y-0.5
              ${selectedStyle.id === style.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
              }
            `}
          >
            {/* Preview Image Container */}
            <div className="w-full aspect-square mb-2.5 rounded-lg bg-white dark:bg-gray-800 
                          flex items-center justify-center p-3 sm:p-4
                          group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 
                          transition-colors duration-200">
              <img 
                src={style.preview} 
                alt={style.directive} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text Content */}
            <div className="w-full text-center space-y-1">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                {style.name}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2 h-8 opacity-85">
                {style.description}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedStyle.id === style.id && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground 
                            rounded-full p-1.5 shadow-sm ring-2 ring-white dark:ring-gray-900">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}

            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-primary 
                          opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  )
}