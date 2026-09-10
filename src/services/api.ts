const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const BASE_URL = RAW_API_URL.replace(/\/+$/, '').endsWith('/api')
  ? RAW_API_URL.replace(/\/+$/, '')
  : `${RAW_API_URL.replace(/\/+$/, '')}/api`

let accessToken: string | null = localStorage.getItem('accessToken')

export const setAccessToken = (token: string | null) => {
  accessToken = token
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export const getAccessToken = () => accessToken

// Helper to make API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`
  
  // Set default headers
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // Include cookies for refresh token endpoint
  const finalOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // crucial for sending cookies
  }

  let response = await fetch(url, finalOptions)

  // Handle Token Refresh on 401 Unauthorized
  if (response.status === 401 && accessToken && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    try {
      console.log('Access token expired. Attempting token refresh...')
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setAccessToken(refreshData.accessToken)
        
        // Retry original request with new token
        headers.set('Authorization', `Bearer ${refreshData.accessToken}`)
        response = await fetch(url, { ...finalOptions, headers })
      } else {
        // Refresh token failed/expired
        console.warn('Session expired. Logging out...')
        setAccessToken(null)
      }
    } catch (err) {
      console.error('Failed to refresh access token:', err)
      setAccessToken(null)
    }
  }

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

// Student APIs
export const getTodayMealsAPI = () => apiRequest('/student/meals')
export const voteMealAPI = (mealId: string, vote: 'yes' | 'no') =>
  apiRequest('/student/vote', {
    method: 'POST',
    body: JSON.stringify({ mealId, vote })
  })
export const getMyLeavesAPI = () => apiRequest('/student/leaves')
export const submitLeaveAPI = (startDate: string, endDate: string, reason: string) =>
  apiRequest('/student/leaves', {
    method: 'POST',
    body: JSON.stringify({ startDate, endDate, reason })
  })
export const getMealHistoryAPI = () => apiRequest('/student/history')

// Staff APIs
export const getInventoryAPI = () => apiRequest('/staff/inventory')
export const updateInventoryAPI = (id: string, quantity: number) =>
  apiRequest(`/staff/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  })
export const getFeedbackAPI = () => apiRequest('/staff/feedback')
export const processScanAPI = (rollNo: string, mealName: string) =>
  apiRequest('/staff/scan', {
    method: 'POST',
    body: JSON.stringify({ rollNo, mealName })
  })
export const updateMenuAPI = (id: string, updates: { menuText?: string; time?: string; cutoffTime?: string; limit?: number }) =>
  apiRequest(`/staff/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })

// Warden APIs
export const getStudentsDirectoryAPI = () => apiRequest('/warden/students')
export const notifyParentSMSAPI = (rollNo: string) =>
  apiRequest(`/warden/students/${rollNo}/notify`, {
    method: 'POST'
  })
export const getPendingLeavesAPI = () => apiRequest('/warden/leaves')
export const reviewLeaveAPI = (id: string, status: 'approved' | 'rejected') =>
  apiRequest(`/warden/leaves/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
export const createAnnouncementAPI = (title: string, message: string) =>
  apiRequest('/warden/announcements', {
    method: 'POST',
    body: JSON.stringify({ title, message })
  })



