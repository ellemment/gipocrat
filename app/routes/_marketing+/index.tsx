import { type MetaFunction } from '@remix-run/node'
import { TextHoverEffect } from '#app/ellemment-ui/components/coming'

export const meta: MetaFunction = () => [{ title: 'ellemment' }]

export default function Index() {
  return (
    <main className="font-poppins grid h-full place-items-center">

      <div className="w-full max-w-2xl h-32 my-8">
        <TextHoverEffect text="Gipocrat" duration={0.3} />
      </div>
    </main>
  )
}