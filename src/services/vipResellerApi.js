import CryptoJS from 'crypto-js';

// VIP Reseller API Configuration
const VIP_RESELLER_CONFIG = {
  baseUrl: 'https://vip-reseller.co.id/api/game-feature',
  apiId: import.meta.env.VITE_VIP_RESELLER_API_ID,
  apiKey: import.meta.env.VITE_VIP_RESELLER_API_KEY,
};

// Generate signature for API requests (MD5 of API_ID + API_KEY)
const generateSignature = () => {
  if (!VIP_RESELLER_CONFIG.apiId || !VIP_RESELLER_CONFIG.apiKey) {
    throw new Error('VIP Reseller API credentials not configured');
  }
  return CryptoJS.MD5(VIP_RESELLER_CONFIG.apiId + VIP_RESELLER_CONFIG.apiKey).toString();
};

// Base API request function
const apiRequest = async (data) => {
  try {
    // Check if we're in development mode and use proxy
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // Use mock proxy for development (CORS workaround)
      const { vipResellerProxy } = await import('../api/vip-reseller-proxy.js');
      console.warn('Using VIP Reseller Mock Proxy for development');
      return await vipResellerProxy.makeRequest(data);
    }
    
    // Production: Use backend proxy endpoint
    const proxyUrl = import.meta.env.VITE_VIP_RESELLER_PROXY_URL || '/api/vip-reseller-proxy';
    
    console.log('Using VIP Reseller Proxy URL:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiId: VIP_RESELLER_CONFIG.apiId,
        apiKey: VIP_RESELLER_CONFIG.apiKey,
        ...data
      })
    });

    const result = await response.json();
    
    if (!result.result) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('VIP Reseller API Error:', error);
    throw error;
  }
};

// VIP Reseller API Service
export const vipResellerApi = {
  // Get available services/games
  async getServices(filterType = 'game', filterValue = null, filterStatus = 'available') {
    const data = {
      type: 'services',
      filter_type: filterType
    };

    if (filterValue) {
      data.filter_value = filterValue;
    }

    if (filterStatus) {
      data.filter_status = filterStatus;
    }

    return await apiRequest(data);
  },

  // Get service stock
  async getServiceStock(serviceCode) {
    return await apiRequest({
      type: 'service-stock',
      service: serviceCode
    });
  },

  // Get game nickname
  async getGameNickname(code, userId, zoneId = null) {
    const data = {
      type: 'get-nickname',
      code: code,
      target: userId
    };

    if (zoneId) {
      data.additional_target = zoneId;
    }

    return await apiRequest(data);
  },

  // Create order for game top-up
  async createGameOrder(serviceCode, userId, zoneId = null) {
    const data = {
      type: 'order',
      service: serviceCode,
      data_no: userId
    };

    if (zoneId) {
      data.data_zone = zoneId;
    }

    return await apiRequest(data);
  },

  // Create joki order
  async createJokiOrder(serviceCode, email, password, additionalData, quantity = 1) {
    return await apiRequest({
      type: 'order',
      service: serviceCode,
      data_no: email,
      data_zone: password,
      additional_data: additionalData,
      quantity: quantity
    });
  },

  // Check order status
  async checkOrderStatus(trxId = null, limit = 10) {
    const data = {
      type: 'status'
    };

    if (trxId) {
      data.trxid = trxId;
    } else {
      data.limit = limit;
    }

    return await apiRequest(data);
  }
};

// Helper functions for game-specific operations
export const gameHelpers = {
  // Mobile Legends helper
  mobileLegends: {
    async getNickname(userId, zoneId) {
      return await vipResellerApi.getGameNickname('mobilelegends', userId, zoneId);
    },
    
    async topUp(serviceCode, userId, zoneId) {
      return await vipResellerApi.createGameOrder(serviceCode, userId, zoneId);
    }
  },

  // PUBG Mobile helper
  pubgMobile: {
    async getNickname(userId) {
      return await vipResellerApi.getGameNickname('pubgmobile', userId);
    },
    
    async topUp(serviceCode, userId) {
      return await vipResellerApi.createGameOrder(serviceCode, userId);
    }
  },

  // Free Fire helper
  freeFire: {
    async getNickname(userId) {
      return await vipResellerApi.getGameNickname('freefire', userId);
    },
    
    async topUp(serviceCode, userId) {
      return await vipResellerApi.createGameOrder(serviceCode, userId);
    }
  },

  // Genshin Impact helper
  genshinImpact: {
    async getNickname(userId, serverId) {
      return await vipResellerApi.getGameNickname('genshinimpact', userId, serverId);
    },
    
    async topUp(serviceCode, userId, serverId) {
      return await vipResellerApi.createGameOrder(serviceCode, userId, serverId);
    }
  }
};

// Service code mapping for popular games
export const SERVICE_CODES = {
  MOBILE_LEGENDS: {
    '86_diamonds': 'ML86-S1',
    '172_diamonds': 'ML172-S1',
    '257_diamonds': 'ML257-S1',
    '344_diamonds': 'ML344-S1',
    '429_diamonds': 'ML429-S1',
    '878_diamonds': 'ML878-S1'
  },
  PUBG_MOBILE: {
    '60_uc': 'PUBG60-S1',
    '325_uc': 'PUBG325-S1',
    '660_uc': 'PUBG660-S1',
    '1800_uc': 'PUBG1800-S1'
  },
  FREE_FIRE: {
    '70_diamonds': 'FF70-S1',
    '140_diamonds': 'FF140-S1',
    '355_diamonds': 'FF355-S1',
    '720_diamonds': 'FF720-S1'
  },
  GENSHIN_IMPACT: {
    '60_genesis': 'GI60-S1',
    '300_genesis': 'GI300-S1',
    '980_genesis': 'GI980-S1',
    '1980_genesis': 'GI1980-S1'
  }
};

// Error handling helper
export const handleApiError = (error) => {
  if (error.message) {
    return error.message;
  }
  
  return 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.';
};

export default vipResellerApi;