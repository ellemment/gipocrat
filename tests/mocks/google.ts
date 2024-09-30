import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, passthrough, http, type HttpHandler } from 'msw'

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const here = (...s: Array<string>) => path.join(__dirname, ...s)

const googleUserFixturePath = path.join(
  here(
    '..',
    'fixtures',
    'google',
    `users.${process.env.VITEST_POOL_ID || 0}.local.json`,
  ),
)

await fsExtra.ensureDir(path.dirname(googleUserFixturePath))

function createGoogleUser(code?: string | null) {
  code ??= faker.string.uuid()
  return {
    code,
    accessToken: `${code}_mock_access_token`,
    profile: {
      sub: faker.string.uuid(),
      name: faker.person.fullName(),
      given_name: faker.person.firstName(),
      family_name: faker.person.lastName(),
      picture: 'https://example.com/mock-google-photo.jpg',
      email: faker.internet.email(),
      email_verified: true,
      locale: 'en',
    },
  }
}

export type GoogleUser = ReturnType<typeof createGoogleUser>

async function getGoogleUsers(): Promise<Array<GoogleUser>> {
  try {
    if (await fsExtra.pathExists(googleUserFixturePath)) {
      const json = await fsExtra.readJson(googleUserFixturePath)
      return json as Array<GoogleUser>
    }
    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function deleteGoogleUser(email: string) {
  const users = await getGoogleUsers()
  const user = users.find((u) => u.profile.email === email)
  if (!user) return null
  await setGoogleUsers(users.filter((u) => u.profile.email !== email))
  return user
}

export async function deleteGoogleUsers() {
  await fsExtra.remove(googleUserFixturePath)
}

async function setGoogleUsers(users: Array<GoogleUser>) {
  await fsExtra.writeJson(googleUserFixturePath, users, { spaces: 2 })
}

export async function insertGoogleUser(code?: string | null) {
  const googleUsers = await getGoogleUsers()
  let user = googleUsers.find((u) => u.code === code)
  if (user) {
    Object.assign(user, createGoogleUser(code))
  } else {
    user = createGoogleUser(code)
    googleUsers.push(user)
  }
  await setGoogleUsers(googleUsers)
  return user
}

const passthroughGoogle =
  !process.env.GOOGLE_CLIENT_ID?.startsWith('MOCK_') &&
  process.env.NODE_ENV !== 'test'

export const handlers: Array<HttpHandler> = [
  http.get('https://accounts.google.com/.well-known/openid-configuration', () => {
    if (passthroughGoogle) return passthrough()
    return json({
      issuer: 'https://accounts.google.com',
      authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      token_endpoint: 'https://oauth2.googleapis.com/token',
      userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
      revocation_endpoint: 'https://oauth2.googleapis.com/revoke',
      jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
      response_types_supported: [
        'code',
        'token',
        'id_token',
        'code token',
        'code id_token',
        'token id_token',
        'code token id_token',
        'none',
      ],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid', 'email', 'profile'],
      token_endpoint_auth_methods_supported: [
        'client_secret_post',
        'client_secret_basic',
      ],
      claims_supported: [
        'aud',
        'email',
        'email_verified',
        'exp',
        'family_name',
        'given_name',
        'iat',
        'iss',
        'locale',
        'name',
        'picture',
        'sub',
      ],
      code_challenge_methods_supported: ['plain', 'S256'],
    })
  }),

  http.post('https://oauth2.googleapis.com/token', async ({ request }) => {
    if (passthroughGoogle) return passthrough()
    const body = await request.json() as { code: string }
    if (!body || typeof body.code !== 'string') {
      return new Response('Bad Request', { status: 400 })
    }
    const code = body.code
    const googleUsers = await getGoogleUsers()
    let user = googleUsers.find((u) => u.code === code)
    if (!user) {
      user = await insertGoogleUser(code)
    }

    return json({
      access_token: user.accessToken,
      token_type: 'Bearer',
      expires_in: 3599,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      id_token: 'mock_id_token',
    })
  }),

  http.get('https://www.googleapis.com/oauth2/v3/userinfo', async ({ request }) => {
    if (passthroughGoogle) return passthrough()

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    const accessToken = authHeader.replace('Bearer ', '')
    const user = (await getGoogleUsers()).find((u) => u.accessToken === accessToken)

    if (!user) {
      return new Response('Not Found', { status: 404 })
    }

    return json(user.profile)
  }),
]