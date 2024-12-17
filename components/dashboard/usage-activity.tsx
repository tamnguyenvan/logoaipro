'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGenerations } from "@/hooks/useGenerations"

export function UsageActivity() {
  const { freeGenerationsRemaining, purchasedGenerationsRemaining, lastFreeGenerationsReset, freeGenerationsLimit } = useGenerations()
  const freeUsagePercentage = ((freeGenerationsRemaining) / freeGenerationsLimit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Free Generations Remaining</p>
            <Progress value={freeUsagePercentage} className="mt-2" />
            <p className="mt-2 text-sm text-gray-500">
              {freeGenerationsRemaining} / {freeGenerationsLimit} generations left
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Next Reset</p>
            <p className="text-sm text-gray-500">
              {lastFreeGenerationsReset?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Purchased Generations Remaining</p>
            <p className="mt-2 text-sm text-gray-500">
              {purchasedGenerationsRemaining} generations left
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

