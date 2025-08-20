import CryptoJS from 'crypto-js';

// Vercel API Route for VIP Reseller Proxy
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      result: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { apiId, apiKey, ...requestData } = req.body;

    // Validate required fields
    if (!apiId || !apiKey) {
      return res.status(400).json({
        result: false,
        message: 'API ID and API Key are required'
      });
    }

    // Generate MD5 signature
    const signature = CryptoJS.MD5(apiId + apiKey).toString();

    // Prepare request payload
    const payload = {
      key: apiKey,
      sign: signature,
      ...requestData
    };

    console.log('VIP Reseller API Request:', {
      type: requestData.type,
      service: requestData.service,
      timestamp: new Date().toISOString()
    });

    // Make request to VIP Reseller API
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WMX-TOPUP/1.0'
      },
      body: JSON.stringify(payload)
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`VIP Reseller API responded with status: ${response.status}`);
    }

    const result = await response.json();

    console.log('VIP Reseller API Response:', {
      success: result.result,
      type: requestData.type,
      message: result.message,
      timestamp: new Date().toISOString()
    });

    // Return the result
    res.status(200).json(result);

  } catch (error) {
    console.error('VIP Reseller Proxy Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      result: false,
      message: `Proxy Error: ${error.message}`,
      data: null
    });
  }
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};