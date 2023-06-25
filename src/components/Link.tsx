import { Link as RemixLink, LinkProps as RemixLinkProps, useParams } from '@remix-run/react'
import { FC, PropsWithChildren } from 'react'

export const Link: FC<PropsWithChildren<RemixLinkProps>> = ({ children, to, ...props }) => {
  const { lang } = useParams();
  const localizedTo = lang ? `/${lang}${to}` : to;
  return (
    <RemixLink to={localizedTo} {...props}>
      {children}
    </RemixLink>
  )
}
