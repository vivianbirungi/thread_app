import Bottombar from '@/components/shared/Bottombar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Topbar from '@/components/shared/Topbar'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata ={
  title:'Threads',
  description:'a Next js thread application'
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Topbar/>
        <main className='flex flex-row'>
          <LeftSidebar/>
          <section className='main-container'>
            <div className="wfull max-width">
              {children}
            </div>
          </section>
          <RightSidebar/>
        </main>
        <Bottombar/>
      </body>
    </html>
    </ClerkProvider>
  )
}
