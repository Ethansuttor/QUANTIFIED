import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/navigation/Sidebar'
import { TopNavBar } from '@/components/navigation/TopNavBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNavBar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 bg-surface-container-low p-6 md:p-10 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
