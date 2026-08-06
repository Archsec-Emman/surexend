import axios, { AxiosError } from 'axios'
import { withRetry } from './utils'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// ── Axios instance with auth interceptor ─────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT from storage on every request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('surexend_access_token')
    : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh token flow on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('surexend_refresh_token')
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        localStorage.setItem('surexend_access_token', data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(original)
      } catch {
        // Refresh failed — force logout
        localStorage.clear()
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth API ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (payload: { email: string; phone: string; password: string; referralCode?: string }) =>
    apiClient.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    apiClient.post('/auth/login', payload),
  verifyOTP: (payload: { identifier: string; otp: string; type: 'email' | 'phone' }) =>
    apiClient.post('/auth/verify-otp', payload),
  resendOTP: (payload: { identifier: string; type: 'email' | 'phone' }) =>
    apiClient.post('/auth/resend-otp', payload),
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload: { token: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', payload),
}

// ── Wallet API ────────────────────────────────────────────────────────────
export const walletAPI = {
  getBalance: () =>
    withRetry(() => apiClient.get('/wallets/balance').then(r => r.data)),
  getDepositAddress: (network: 'TRC20' | 'BEP20' | 'POLYGON') =>
    apiClient.get(`/wallets/deposit-address?network=${network}`).then(r => r.data),
  send: (payload: { address: string; amount: number; network: string; pin: string }) =>
    apiClient.post('/wallets/send', payload).then(r => r.data),
  getNetworks: () =>
    apiClient.get('/wallets/networks').then(r => r.data),
}

// ── Transaction API ───────────────────────────────────────────────────────
export const transactionAPI = {
  getHistory: (params: { page?: number; limit?: number; year?: number; month?: number; week?: number; day?: string; type?: string }) =>
    apiClient.get('/transactions', { params }).then(r => r.data),
  getById: (id: string) =>
    apiClient.get(`/transactions/${id}`).then(r => r.data),
  downloadStatement: (params: { year?: number; month?: number; week?: number; format?: 'pdf' | 'csv' }) =>
    apiClient.get('/transactions/statement', { params, responseType: 'blob' }).then(r => r.data),
}

// ── Conversion API ────────────────────────────────────────────────────────
export const conversionAPI = {
  getRates: (fiatCurrency: string) =>
    withRetry(() => apiClient.get(`/conversions/rates?currency=${fiatCurrency}`).then(r => r.data)),
  preview: (payload: { amount: number; currency: string }) =>
    apiClient.post('/conversions/preview', payload).then(r => r.data),
  execute: (payload: { amount: number; currency: string; bankAccountId: string; pin: string }) =>
    apiClient.post('/conversions/execute', payload).then(r => r.data),
}

// ── Bank Accounts API ─────────────────────────────────────────────────────
export const bankAPI = {
  list: () => apiClient.get('/bank-accounts').then(r => r.data),
  add: (payload: { bankCode: string; accountNumber: string; country: string }) =>
    apiClient.post('/bank-accounts', payload).then(r => r.data),
  remove: (id: string) => apiClient.delete(`/bank-accounts/${id}`),
  getBanks: (country: string) =>
    apiClient.get(`/bank-accounts/banks?country=${country}`).then(r => r.data),
}

// ── Bills API ─────────────────────────────────────────────────────────────
export const billsAPI = {
  getProviders: (type: 'airtime' | 'data' | 'electricity' | 'tv' | 'water', country?: string) =>
    apiClient.get(`/bills/providers?type=${type}&country=${country || 'NG'}`).then(r => r.data),
  getDataPlans: (provider: string) =>
    apiClient.get(`/bills/data-plans?provider=${provider}`).then(r => r.data),
  purchase: (payload: {
    type: string; provider: string; recipient: string;
    amount?: number; planCode?: string; pin: string
  }) =>
    apiClient.post('/bills/purchase', payload).then(r => r.data),
  validateMeter: (meterNumber: string, provider: string) =>
    apiClient.get(`/bills/validate-meter?meter=${meterNumber}&provider=${provider}`).then(r => r.data),
}

// ── Referrals API ─────────────────────────────────────────────────────────
export const referralAPI = {
  getStats: () => apiClient.get('/referrals/stats').then(r => r.data),
  getReferrals: (page = 1, limit = 20) =>
    apiClient.get(`/referrals?page=${page}&limit=${limit}`).then(r => r.data),
  getEarnings: () => apiClient.get('/referrals/earnings').then(r => r.data),
}

// ── User API ──────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => apiClient.get('/users/me').then(r => r.data),
  updateProfile: (payload: Partial<{ firstName: string; lastName: string; avatar: string }>) =>
    apiClient.patch('/users/me', payload).then(r => r.data),
  changePin: (payload: { currentPin: string; newPin: string }) =>
    apiClient.post('/users/change-pin', payload).then(r => r.data),
  setup2FA: () => apiClient.post('/users/2fa/setup').then(r => r.data),
  verify2FA: (token: string) =>
    apiClient.post('/users/2fa/verify', { token }).then(r => r.data),
  getKYCStatus: () => apiClient.get('/users/kyc').then(r => r.data),
  submitKYC: (payload: FormData) =>
    apiClient.post('/users/kyc', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ── Support API ───────────────────────────────────────────────────────────
export const supportAPI = {
  chat: (payload: { message: string; sessionId: string }) =>
    apiClient.post('/support/chat', payload).then(r => r.data),
  createTicket: (payload: { subject: string; message: string; category: string }) =>
    apiClient.post('/support/tickets', payload).then(r => r.data),
  getTickets: () => apiClient.get('/support/tickets').then(r => r.data),
}
