import axios from 'axios'
import crypto from 'crypto'

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true'

const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION 
  ? 'https://api.midtrans.com/v2' 
  : 'https://api.sandbox.midtrans.com/v2'

const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1'

if (!MIDTRANS_SERVER_KEY) {
  console.warn('Midtrans server key not configured')
}

interface MidtransCustomerDetail {
  first_name: string
  last_name?: string
  email: string
  phone: string
}

interface MidtransItemDetail {
  id: string
  price: number
  quantity: number
  name: string
  brand?: string
  category?: string
}

interface MidtransTransactionRequest {
  transaction_details: {
    order_id: string
    gross_amount: number
  }
  credit_card?: {
    secure: boolean
  }
  customer_details?: MidtransCustomerDetail
  item_details?: MidtransItemDetail[]
  custom_expiry?: {
    expiry_duration: number
    unit: 'second' | 'minute' | 'hour' | 'day'
  }
  callbacks?: {
    finish?: string
  }
}

interface MidtransSnapResponse {
  token: string
  redirect_url: string
}

interface MidtransTransactionStatus {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  gross_amount: string
  payment_type: string
  transaction_time: string
  transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'failure'
  fraud_status?: 'accept' | 'deny' | 'challenge'
  approval_code?: string
  signature_key?: string
  bank?: string
  va_numbers?: Array<{
    bank: string
    va_number: string
  }>
  permata_va_number?: string
  bca_va_number?: string
  bill_key?: string
  biller_code?: string
  pdf_url?: string
  finish_redirect_url?: string
}

interface MidtransNotification extends MidtransTransactionStatus {
  currency: string
}

class MidtransAPI {
  private serverKey: string
  private clientKey: string
  private isProduction: boolean

  constructor() {
    this.serverKey = MIDTRANS_SERVER_KEY || ''
    this.clientKey = MIDTRANS_CLIENT_KEY || ''
    this.isProduction = MIDTRANS_IS_PRODUCTION
  }

  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.serverKey}:`).toString('base64')
    return `Basic ${auth}`
  }

  private generateSignatureKey(orderId: string, statusCode: string, grossAmount: string): string {
    const signatureString = `${orderId}${statusCode}${grossAmount}${this.serverKey}`
    return crypto.createHash('sha512').update(signatureString).digest('hex')
  }

  // Create Snap transaction token
  async createSnapTransaction(transactionData: MidtransTransactionRequest): Promise<MidtransSnapResponse> {
    try {
      const response = await axios.post(
        `${MIDTRANS_SNAP_URL}/transactions`,
        transactionData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.getAuthHeader()
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Midtrans Snap API Error:', error)
      throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get transaction status
  async getTransactionStatus(orderId: string): Promise<MidtransTransactionStatus> {
    try {
      const response = await axios.get(
        `${MIDTRANS_API_URL}/${orderId}/status`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.getAuthHeader()
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Midtrans Status API Error:', error)
      throw new Error(`Failed to get transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Cancel transaction
  async cancelTransaction(orderId: string): Promise<MidtransTransactionStatus> {
    try {
      const response = await axios.post(
        `${MIDTRANS_API_URL}/${orderId}/cancel`,
        {},
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.getAuthHeader()
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Midtrans Cancel API Error:', error)
      throw new Error(`Failed to cancel transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Verify notification signature
  verifySignature(notification: MidtransNotification): boolean {
    const { order_id, status_code, gross_amount, signature_key } = notification
    const expectedSignature = this.generateSignatureKey(order_id, status_code, gross_amount)
    return signature_key === expectedSignature
  }

  // Helper method to create payment for WMX orders
  async createWMXPayment({
    orderId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
    items
  }: {
    orderId: string
    amount: number
    customerName: string
    customerEmail: string
    customerPhone: string
    items: MidtransItemDetail[]
  }): Promise<MidtransSnapResponse> {
    const transactionData: MidtransTransactionRequest = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      item_details: items,
      custom_expiry: {
        expiry_duration: 15,
        unit: 'minute'
      },
      callbacks: {
        finish: `${process.env.APP_URL}/payment/finish?order_id=${orderId}`
      }
    }

    return this.createSnapTransaction(transactionData)
  }

  // Get Snap client key for frontend
  getClientKey(): string {
    return this.clientKey
  }

  // Get environment info
  getEnvironment(): { isProduction: boolean, snapUrl: string } {
    return {
      isProduction: this.isProduction,
      snapUrl: this.isProduction 
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js'
    }
  }
}

export const midtransAPI = new MidtransAPI()
export type { 
  MidtransCustomerDetail, 
  MidtransItemDetail, 
  MidtransTransactionRequest, 
  MidtransSnapResponse, 
  MidtransTransactionStatus,
  MidtransNotification
}
