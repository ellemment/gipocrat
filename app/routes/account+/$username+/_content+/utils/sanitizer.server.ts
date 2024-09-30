// app/routes/account+/$username+/_content+/utils/sanitizer.server.ts


import DOMPurify from 'isomorphic-dompurify'

export async function sanitizeHtml(html: string): Promise<string> {
  return DOMPurify.sanitize(html)
}