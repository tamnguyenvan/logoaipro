import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockUsageData } from "@/lib/mock-data"

export function UsageActivity() {
  const { generations_remaining, last_free_generations_reset } = mockUsageData
  const usagePercentage = ((10 - generations_remaining) / 10) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Free Generations Remaining</p>
            <Progress value={usagePercentage} className="mt-2" />
            <p className="mt-2 text-sm text-gray-500">
              {generations_remaining} / 10 generations left
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Next Reset</p>
            <p className="text-sm text-gray-500">
              {new Date(last_free_generations_reset).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

