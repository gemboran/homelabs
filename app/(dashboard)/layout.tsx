import { AppSidebar } from "@/components/organisms/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {ReactNode} from "react";

type Props = {
  children: ReactNode
}

export default async function DashboardLayout({children}: Props) {
  const { cookies } = await import("next/headers")
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out relative">
        <SidebarTrigger className="absolute" />
        {children}
      </main>
    </SidebarLayout>
  )
}
