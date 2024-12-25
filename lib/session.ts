import 'server-only'
import { cookies } from 'next/headers'

const expiredDay = 7 // days

export async function createSession(access_token: string) {
  const expiresAt = new Date(Date.now() + expiredDay * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
 
  cookieStore.set('session', access_token, {
    httpOnly: false,
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession() {
    const session = (await cookies()).get('session')?.value
   
    if (!session) {
      return null
    }
   
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
   
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
    })
  }

  export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
  }