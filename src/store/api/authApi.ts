import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserProfile, UserRole } from '../slices/authSlice'

interface LoginResponse {
  message: string
  accessToken: string
  user: UserProfile
}

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const BASE_URL = RAW_API_URL.replace(/\/+$/, '').endsWith('/api')
  ? RAW_API_URL.replace(/\/+$/, '')
  : `${RAW_API_URL.replace(/\/+$/, '')}/api`

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { rollNo: string; password?: string; role: UserRole }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          rollNo: credentials.rollNo,
          password: credentials.password || 'password123'
        }
      }),
      invalidatesTags: ['User']
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      invalidatesTags: ['User']
    }),
    getCurrentUser: builder.query<{ user: UserProfile }, void>({
      query: () => '/auth/me',
      providesTags: ['User']
    })
  })
})

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } = authApi
