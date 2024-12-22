export const runtime = "edge";

import { ProfileSection } from "@/components/dashboard/profile-section"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Profile"
        text="Manage your account settings and preferences."
      />
      <ProfileSection />
    </DashboardShell>
  )
}

