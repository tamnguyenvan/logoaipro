import { BillingSection } from "@/components/dashboard/billing-section"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage your subscription and billing information."
      />
      <BillingSection />
    </DashboardShell>
  )
}

