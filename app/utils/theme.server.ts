import * as cookie from 'cookie'

const cookieName = 'en_theme'

export type Theme = 'light' | 'dark'

export function getTheme(request: Request): Theme {
  const cookieHeader = request.headers.get('cookie')
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : 'dark'
  return parsed === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  return cookie.serialize(cookieName, theme, { path: '/', maxAge: 31536000 })
}