import { UsageActivity } from "@/components/dashboard/usage-activity"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function UsageActivityPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Usage Activity"
        text="Manage your usage activity and view your usage history."
      />
      <UsageActivity />
    </DashboardShell>
  )
}

