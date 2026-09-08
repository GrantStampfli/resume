// Augments nuxt-auth-utils with the shape stored in the session cookie.
declare module '#auth-utils' {
  interface User {
    name: string
    role: 'admin'
  }

  interface UserSession {
    loggedInAt: number
  }
}

export {}
