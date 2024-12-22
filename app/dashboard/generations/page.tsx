import { GenerationGallery } from "@/components/dashboard/generation-gallery"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function GenerationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your Generations"
        text="View and manage your generated images."
      />
      <GenerationGallery />
    </DashboardShell>
  )
}

