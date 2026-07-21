import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/v1/auth/login'

          const res = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const response = await res.json()

          if (!res.ok) {
            throw new Error(response.message || 'Login failed')
          }

          const { user, accessToken } = response.data

          return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            accessToken,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error('Authentication failed. Please try again.')
        }
      },
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
        token.role = user.role
        token.profileImage = user.profileImage
        token.accessToken = user.accessToken
      }
      return token
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        firstName: token.firstName,
        lastName: token.lastName,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
      }
      return session
    },
  },
  trustHost: true,
  // cookies: {
  //   sessionToken: {
  //     name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : 'next-auth.session-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production',
  //     },
  //   },
  // },
})
