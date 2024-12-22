import { GenerationGallery } from "@/components/dashboard/generation-gallery"
import { UsageActivity } from "@/components/dashboard/activity"
import { TransactionHistory } from "@/components/dashboard/billing"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="View your generation history, usage activity, and transactions."
      />
      <div className="grid gap-8">
        <GenerationGallery />
        <div className="grid gap-8 md:grid-cols-2">
          <UsageActivity />
          <TransactionHistory />
        </div>
      </div>
    </DashboardShell>
  )
}
