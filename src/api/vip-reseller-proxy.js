// This would be a backend API route (e.g., in Express.js, Next.js API routes, or Netlify Functions)
// Since this is a frontend-only project, we'll create a mock implementation

import CryptoJS from 'crypto-js';

// Mock implementation for development
// In production, this should be implemented as a backend API route
export const vipResellerProxy = {
    async makeRequest(data) {
        // This is a mock implementation
        // In production, you would implement this as a backend API route

        console.warn('VIP Reseller Proxy: This is a mock implementation');
        console.log('Request data:', data);

        // Simulate different responses based on request type
        switch (data.type) {
            case 'services':
                return {
                    result: true,
                    data: [
                        {
                            code: "ML86-S1",
                            game: "Mobile Legends",
                            name: "86 Diamonds",
                            price: { basic: 20000, premium: 19000, special: 18500 },
                            server: "1",
                            status: "available"
                        },
                        {
                            code: "ML172-S1",
                            game: "Mobile Legends",
                            name: "172 Diamonds",
                            price: { basic: 40000, premium: 38000, special: 37000 },
                            server: "1",
                            status: "available"
                        },
                        {
                            code: "PUBG60-S1",
                            game: "PUBG Mobile",
                            name: "60 UC",
                            price: { basic: 15000, premium: 14500, special: 14000 },
                            server: "1",
                            status: "available"
                        }
                    ],
                    message: "Mock services data"
                };

            case 'get-nickname':
                return {
                    result: true,
                    data: "MockPlayer123",
                    message: "Mock nickname (real API would return actual nickname)"
                };

            case 'service-stock':
                return {
                    result: true,
                    data: {
                        code: data.service,
                        name: "Mock Service",
                        price: { basic: 20000, premium: 19000, special: 18500 },
                        description: "Mock service description",
                        stock: 100,
                        server: 1,
                        status: "available"
                    },
                    message: "Mock stock data"
                };

            case 'order':
                return {
                    result: true,
                    data: {
                        trxid: `MOCK${Date.now()}`,
                        data: data.data_no,
                        zone: data.data_zone || "",
                        service: "Mock Service",
                        status: "waiting",
                        note: "Mock order - not processed",
                        balance: 1000000,
                        price: 20000
                    },
                    message: "Mock order created (not real)"
                };

            case 'status':
                return {
                    result: true,
                    data: [
                        {
                            trxid: data.trxid || `MOCK${Date.now()}`,
                            data: "123456789",
                            zone: "2685",
                            service: "Mock Service",
                            status: "success",
                            note: "Mock transaction completed",
                            price: 20000
                        }
                    ],
                    message: "Mock status data"
                };

            default:
                return {
                    result: false,
                    message: "Unknown request type",
                    data: null
                };
        }
    }
};

// Backend implementation example (for reference)
export const backendImplementationExample = `
// Example backend implementation (Express.js)
app.post('/api/vip-reseller-proxy', async (req, res) => {
  try {
    const { apiId, apiKey, ...requestData } = req.body;
    
    // Generate signature
    const signature = CryptoJS.MD5(apiId + apiKey).toString();
    
    // Make request to VIP Reseller
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        sign: signature,
        ...requestData
      })
    });
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      result: false, 
      message: error.message 
    });
  }
});

// Example Netlify Function implementation
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const { apiId, apiKey, ...requestData } = JSON.parse(event.body);
    
    const signature = CryptoJS.MD5(apiId + apiKey).toString();
    
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        sign: signature,
        ...requestData
      })
    });
    
    const result = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        result: false, 
        message: error.message 
      })
    };
  }
};
`;

export default vipResellerProxy;