import axios from 'axios'

const VIP_API_URL = process.env.VIP_RESELLER_API_URL || 'https://vip-reseller.co.id/api'
const VIP_API_KEY = process.env.VIP_RESELLER_API_KEY
const VIP_API_ID = process.env.VIP_RESELLER_API_ID

if (!VIP_API_KEY || !VIP_API_ID) {
  console.warn('VIP-Reseller API credentials not configured')
}

interface VipProfile {
  id: string
  username: string
  name: string
  balance: number
  level: string
  status: string
}

interface VipService {
  id: string
  service: string
  name: string
  category: string
  brand: string
  type: string
  status: string
  note: string
}

interface VipProduct {
  id: string
  service: string
  name: string
  price: {
    basic: number
    premium: number
    special: number
  }
  status: string
  multi: string
  min: string
  max: string
  cut_off: string
}

interface VipOrderRequest {
  service: string
  data: string
  custom?: string
}

interface VipOrderResponse {
  id: string
  data: {
    trxid: string
    service: string
    data: string
    status: string
    balance: number
    message: string
    sn?: string
    created_date: string
    last_update: string
  }
}

interface VipStatusResponse {
  data: {
    trxid: string
    service: string
    data: string
    status: string
    sn?: string
    created_date: string
    last_update: string
  }
}

class VipResellerAPI {
  private apiKey: string
  private apiId: string
  private baseURL: string

  constructor() {
    this.apiKey = VIP_API_KEY || ''
    this.apiId = VIP_API_ID || ''
    this.baseURL = VIP_API_URL
  }

  private async getSignature(data: Record<string, unknown> | VipOrderRequest): Promise<string> {
    // Generate MD5 signature for VIP-Reseller API
    const crypto = await import('crypto')
    const string = JSON.stringify(data) + this.apiKey
    return crypto.createHash('md5').update(string).digest('hex')
  }

  private async makeRequest<T = unknown>(endpoint: string, data: Record<string, unknown> | VipOrderRequest = {}): Promise<T> {
    try {
      const requestData = {
        key: this.apiKey,
        sign: await this.getSignature(data),
        ...data
      }

      const response = await axios.post(`${this.baseURL}/${endpoint}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      })

      return response.data
    } catch (error) {
      console.error(`VIP-Reseller API Error (${endpoint}):`, error)
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get account profile and balance
  async getProfile(): Promise<VipProfile> {
    return this.makeRequest('profile')
  }

  // Get available services/games
  async getServices(): Promise<VipService[]> {
    const response = await this.makeRequest<{ data: VipService[] }>('services')
    return response.data || []
  }

  // Get price list for specific service
  async getPriceList(serviceId?: string): Promise<VipProduct[]> {
    const data = serviceId ? { filter_type: 'service', filter_value: serviceId } : {}
    const response = await this.makeRequest<{ data: VipProduct[] }>('price-list', data)
    return response.data || []
  }

  // Create new order
  async createOrder(orderData: VipOrderRequest): Promise<VipOrderResponse> {
    return this.makeRequest('order', orderData)
  }

  // Check order status
  async getOrderStatus(trxId: string): Promise<VipStatusResponse> {
    return this.makeRequest('status', { trxid: trxId })
  }

  // Get nickname for certain games (if supported)
  async getNickname(service: string, userId: string): Promise<{ nickname?: string, error?: string }> {
    try {
      const response = await this.makeRequest<{ nickname?: string, error?: string }>('get-nickname', {
        service: service,
        data: userId
      })
      return response
    } catch (error) {
      return { error: 'Nickname service not available' }
    }
  }
}

export const vipResellerAPI = new VipResellerAPI()
export type { VipProfile, VipService, VipProduct, VipOrderRequest, VipOrderResponse, VipStatusResponse }
