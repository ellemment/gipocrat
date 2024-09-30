// app/routes/_marketing+/index.tsx
import { type MetaFunction } from '@remix-run/node'
import Discover from '#app/components/landing/discover'
import Hero from '#app/components/landing/hero'


export const meta: MetaFunction = () => [{ title: 'ellemment' }]

export default function Index() {
  return (
    <main className="font-poppins grid h-full place-items-center">
      <Hero />
      <Discover />
    </main>
  )
}