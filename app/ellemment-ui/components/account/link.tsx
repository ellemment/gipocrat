import * as Headless from '@headlessui/react'
import { Link as RemixLink, type LinkProps as RemixLinkProps } from '@remix-run/react'
import React, { forwardRef } from 'react'

type LinkProps = Omit<RemixLinkProps, 'to'> & {
  href: RemixLinkProps['to']
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<'a'>

export const Link = forwardRef(function Link(
  { href, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <RemixLink to={href} {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})