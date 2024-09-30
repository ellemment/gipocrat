import React from 'react'
import { type Theme } from '#app/utils/theme.server.ts'
import { AccountIsland } from './account-island'
import { AccountNavLinks } from './account-navlinks'
import {
  Sidebar,
  SidebarHeader,
  SidebarSection,
} from './sidebar'

type Content = {
  id: string;
  title: string;
};

interface User {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image?: { id: string } | null;
  content: Content[];
}

interface AccountLayoutProps {
  user: User | null;
  children: React.ReactNode;
  userPreference: Theme | null;
}


export function AccountLayout({ user, children }: AccountLayoutProps) {
  const isAuthenticated = !!user;

  const sidebarContent = (
    <Sidebar>
      {isAuthenticated && (
        <SidebarHeader className='p-4'>
          <div className="flex justify-between items-center">
            <AccountIsland user={user} />
          </div>
          <SidebarSection>
            <AccountNavLinks username={user.username} />
          </SidebarSection>
        </SidebarHeader>
      )}
    </Sidebar>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="flex justify-center w-full max-lg:hidden">
        <div className="max-w-7xl w-full relative isolate flex min-h-svh pb-1 rounded-2xl bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          {/* Sidebar */}
          <div className="w-80 max-lg:hidden">
            {sidebarContent}
          </div>
          {/* Content */}
          <main className="hidden dark:bg-inherit rounded-2xl lg:flex lg:flex-1 lg:flex-col lg:pb-2 lg:pl-2 lg:pr-2 lg:pt-2">
            <div className="border-s border-zinc-950/5 dark:border-white/5 grow p-6 rounded-e-2xl flex flex-col">
              <div className="flex-grow w-full">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Mobile View */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className='h-14'></div>
        <main className="flex-1 p-4 pb-20">
          {children}
        </main>
      </div>
    </>
  );
}