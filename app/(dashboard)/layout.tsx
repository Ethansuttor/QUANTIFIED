import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/navigation/Sidebar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BottomMobileNav } from '@/components/navigation/BottomMobileNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <TopNavBar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 bg-surface-container-low p-4 md:p-10 pb-32 md:pb-10 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
      <BottomMobileNav />
    </div>
  )
}
