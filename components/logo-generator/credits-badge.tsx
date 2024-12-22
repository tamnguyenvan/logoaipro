import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

interface GenerationsLeftBadgeProps {
  generationsLeft: number;
}

export function GenerationsLeftBadge({ generationsLeft }: GenerationsLeftBadgeProps) {
  const getBadgeStyle = (count: number) => {
    if (count <= 3) {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30"
    }
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
  }

  return (
    <Badge 
      variant="outline"
      className={`
        ${getBadgeStyle(generationsLeft)}
        px-3 
        py-1.5 
        flex 
        items-center 
        gap-1.5 
        rounded-full 
        font-medium 
        border 
        shadow-sm
        transition-all
        duration-200
      `}
    >
      <Coins className="h-3.5 w-3.5" />
      <span>{generationsLeft} generations left</span>
    </Badge>
  )
}