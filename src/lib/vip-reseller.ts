import axios from 'axios'
import CryptoJS from 'crypto-js'

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
  stock?: boolean
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
  stock?: number
}

interface VipOrderRequest {
  type: 'order'
  service: string
  data_no: string
  data_zone?: string
  custom?: string
}

interface VipOrderResponse {
  result: boolean
  data: {
    trxid: string
    data: string
    zone?: string
    service: string
    status: string
    note?: string
    balance: number
    price: number
    sn?: string
  }
  message: string
}

interface VipStatusResponse {
  result: boolean
  data: {
    trxid: string
    service: string
    data: string
    zone?: string
    status: string
    sn?: string
    note?: string
    price: number
    created_date: string
    last_update: string
  }
  message: string
}

interface VipStockResponse {
  result: boolean
  data: Array<{
    service: string
    name: string
    stock: number
    status: string
  }>
  message: string
}

interface VipNicknameRequest {
  type: 'get-nickname'
  service: string
  data_no: string
  data_zone?: string
}

interface VipNicknameResponse {
  result: boolean
  data: {
    nickname: string
    data: string
    zone?: string
  }
  message: string
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

  private getSignature(): string {
    // Generate MD5 signature: md5(API_ID + API_KEY)
    return CryptoJS.MD5(this.apiId + this.apiKey).toString()
  }

  private async makeRequest<T = unknown>(data: Record<string, unknown> = {}): Promise<T> {
    try {
      const requestData = {
        key: this.apiKey,
        sign: this.getSignature(),
        ...data
      }

      const response = await axios.post(`${this.baseURL}/game-feature`, requestData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000
      })

      return response.data
    } catch (error) {
      console.error(`VIP-Reseller API Error:`, error)
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get available services/games
  async getServices(): Promise<VipService[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipService[] }>({ type: 'services' })
    return response.data || []
  }

  // Get price list for all services
  async getPriceList(): Promise<VipProduct[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipProduct[] }>({ type: 'price-list' })
    return response.data || []
  }

  // Get stock information
  async getStock(): Promise<VipStockResponse> {
    return this.makeRequest({ type: 'get-stock' })
  }

  // Create new order
  async createOrder(orderData: VipOrderRequest): Promise<VipOrderResponse> {
    return this.makeRequest(orderData)
  }

  // Check order status
  async getOrderStatus(trxId: string): Promise<VipStatusResponse> {
    return this.makeRequest({ type: 'status', trxid: trxId })
  }

  // Get nickname for certain games (if supported)
  async getNickname(service: string, dataNo: string, dataZone?: string): Promise<VipNicknameResponse> {
    const requestData: VipNicknameRequest = {
      type: 'get-nickname',
      service: service,
      data_no: dataNo
    }
    
    if (dataZone) {
      requestData.data_zone = dataZone
    }
    
    return this.makeRequest(requestData)
  }

  // Get account balance
  async getBalance(): Promise<{ balance: number }> {
    const response = await this.makeRequest<{ result: boolean, data: { balance: number } }>({ type: 'balance' })
    return { balance: response.data?.balance || 0 }
  }
}

export const vipResellerAPI = new VipResellerAPI()
export type { VipProfile, VipService, VipProduct, VipOrderRequest, VipOrderResponse, VipStatusResponse }
