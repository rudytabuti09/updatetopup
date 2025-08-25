import axios from 'axios'
import CryptoJS from 'crypto-js'

const VIP_API_URL = process.env.VIP_RESELLER_API_URL || 'https://vip-reseller.co.id/api'
const VIP_API_KEY = process.env.VIP_RESELLER_API_KEY
const VIP_API_ID = process.env.VIP_RESELLER_API_ID

if (!VIP_API_KEY || !VIP_API_ID) {
  console.warn('VIP-Reseller API credentials not configured')
}

// VIP-Reseller API Endpoints
enum VipEndpoint {
  PROFILE = 'profile',
  PREPAID = 'prepaid',
  SOCIAL_MEDIA = 'social-media',
  GAME_FEATURE = 'game-feature'
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

// ===========================================
// PREPAID API INTERFACES
// ===========================================

interface VipPrepaidOrderRequest {
  type: 'order'
  service: string
  data_no: string
}

interface VipPrepaidOrderResponse {
  result: boolean
  data: {
    trxid: string
    data: string
    code: string
    service: string
    status: string
    note?: string
    balance: number
    price: number
    sn?: string
  }
  message: string
}

interface VipPrepaidStatusResponse {
  result: boolean
  data: Array<{
    trxid: string
    data: string
    code: string
    service: string
    status: string
    note?: string
    price: number
    created_date?: string
    last_update?: string
  }>
  message: string
}

// ===========================================
// SOCIAL MEDIA API INTERFACES
// ===========================================

interface VipSocialMediaOrderRequest {
  type: 'order'
  service: string
  quantity: number
  data: string
}

interface VipSocialMediaOrderResponse {
  result: boolean
  data: {
    trxid: string
    data: string
    service: string
    quantity: number
    status: string
    note?: string
    balance: number
    price: number
  }
  message: string
}

interface VipSocialMediaStatusResponse {
  result: boolean
  data: Array<{
    trxid: string
    data: string
    service: string
    quantity: number
    status: string
    note?: string
    price: number
    created_date?: string
    last_update?: string
  }>
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

  private async makeRequest<T = unknown>(endpoint: VipEndpoint, data: Record<string, unknown> = {}): Promise<T> {
    try {
      const requestData = {
        key: this.apiKey,
        sign: this.getSignature(),
        ...data
      }

      const response = await axios.post(`${this.baseURL}/${endpoint}`, requestData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000
      })

      return response.data
    } catch (error) {
      console.error(`VIP-Reseller API Error (${endpoint}):`, error)
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ===========================================
  // PROFILE API METHODS
  // ===========================================
  
  // Get profile information
  async getProfile(): Promise<VipProfile> {
    const response = await this.makeRequest<{ result: boolean, data: VipProfile }>(VipEndpoint.PROFILE)
    if (!response.result) {
      throw new Error('Failed to get profile information')
    }
    return response.data
  }

  // Get account balance
  async getBalance(): Promise<{ balance: number }> {
    const profile = await this.getProfile()
    return { balance: profile.balance }
  }

  // ===========================================
  // GAME FEATURE API METHODS
  // ===========================================

  // Get available services/games
  async getServices(): Promise<VipService[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipService[] }>(VipEndpoint.GAME_FEATURE, { type: 'services' })
    return response.data || []
  }

  // Get price list for all services
  async getPriceList(): Promise<VipProduct[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipProduct[] }>(VipEndpoint.GAME_FEATURE, { type: 'price-list' })
    return response.data || []
  }

  // Get stock information
  async getStock(): Promise<VipStockResponse> {
    return this.makeRequest(VipEndpoint.GAME_FEATURE, { type: 'get-stock' })
  }

  // Create new game order
  async createGameOrder(orderData: VipOrderRequest): Promise<VipOrderResponse> {
    return this.makeRequest(VipEndpoint.GAME_FEATURE, orderData as unknown as Record<string, unknown>)
  }

  // Check game order status
  async getGameOrderStatus(trxId: string): Promise<VipStatusResponse> {
    return this.makeRequest(VipEndpoint.GAME_FEATURE, { type: 'status', trxid: trxId })
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
    
    return this.makeRequest(VipEndpoint.GAME_FEATURE, requestData as unknown as Record<string, unknown>)
  }

  // ===========================================
  // PREPAID API METHODS (Pulsa & PPOB)
  // ===========================================

  // Get prepaid services
  async getPrepaidServices(): Promise<VipService[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipService[] }>(VipEndpoint.PREPAID, { type: 'services' })
    return response.data || []
  }

  // Create prepaid order (pulsa, data, PLN, etc.)
  async createPrepaidOrder(orderData: VipPrepaidOrderRequest): Promise<VipPrepaidOrderResponse> {
    return this.makeRequest(VipEndpoint.PREPAID, orderData as unknown as Record<string, unknown>)
  }

  // Check prepaid order status
  async getPrepaidOrderStatus(trxId?: string, limit?: number): Promise<VipPrepaidStatusResponse> {
    const requestData: Record<string, unknown> = { type: 'status' }
    
    if (trxId) {
      requestData.trxid = trxId
    }
    
    if (limit) {
      requestData.limit = limit
    }
    
    return this.makeRequest(VipEndpoint.PREPAID, requestData)
  }

  // ===========================================
  // SOCIAL MEDIA API METHODS
  // ===========================================

  // Get social media services
  async getSocialMediaServices(): Promise<VipService[]> {
    const response = await this.makeRequest<{ result: boolean, data: VipService[] }>(VipEndpoint.SOCIAL_MEDIA, { type: 'services' })
    return response.data || []
  }

  // Create social media order (followers, likes, etc.)
  async createSocialMediaOrder(orderData: VipSocialMediaOrderRequest): Promise<VipSocialMediaOrderResponse> {
    return this.makeRequest(VipEndpoint.SOCIAL_MEDIA, orderData as unknown as Record<string, unknown>)
  }

  // Check social media order status
  async getSocialMediaOrderStatus(trxId?: string, limit?: number): Promise<VipSocialMediaStatusResponse> {
    const requestData: Record<string, unknown> = { type: 'status' }
    
    if (trxId) {
      requestData.trxid = trxId
    }
    
    if (limit) {
      requestData.limit = limit
    }
    
    return this.makeRequest(VipEndpoint.SOCIAL_MEDIA, requestData)
  }

  // ===========================================
  // BACKWARD COMPATIBILITY METHODS (deprecated)
  // ===========================================

  /** @deprecated Use createGameOrder instead */
  async createOrder(orderData: VipOrderRequest): Promise<VipOrderResponse> {
    return this.createGameOrder(orderData)
  }

  /** @deprecated Use getGameOrderStatus instead */
  async getOrderStatus(trxId: string): Promise<VipStatusResponse> {
    return this.getGameOrderStatus(trxId)
  }
}

export const vipResellerAPI = new VipResellerAPI()
export type { 
  VipProfile, 
  VipService, 
  VipProduct, 
  VipOrderRequest, 
  VipOrderResponse, 
  VipStatusResponse,
  VipPrepaidOrderRequest,
  VipPrepaidOrderResponse,
  VipPrepaidStatusResponse,
  VipSocialMediaOrderRequest,
  VipSocialMediaOrderResponse,
  VipSocialMediaStatusResponse,
  VipEndpoint
}
