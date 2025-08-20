import React, { useState } from 'react';
import { useVipResellerApi } from '../hooks/useVipResellerApi';
import Button from './ui/Button';
import Icon from './AppIcon';

const VipResellerTest = () => {
  const {
    loading,
    services,
    getServices,
    getServiceStock,
    getGameNickname,
    createGameOrder,
    checkOrderStatus
  } = useVipResellerApi();

  const [testResults, setTestResults] = useState([]);
  const [testUserId, setTestUserId] = useState('123456789');
  const [testZoneId, setTestZoneId] = useState('2685');

  const addTestResult = (test, result, success = true) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result: JSON.stringify(result, null, 2),
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testGetServices = async () => {
    try {
      const result = await getServices('game', 'Mobile Legends', 'available');
      addTestResult('Get Services', result, true);
    } catch (error) {
      addTestResult('Get Services', { error: error.message }, false);
    }
  };

  const testGetNickname = async () => {
    try {
      const result = await getGameNickname('mobilelegends', testUserId, testZoneId);
      addTestResult('Get Nickname', { nickname: result }, true);
    } catch (error) {
      addTestResult('Get Nickname', { error: error.message }, false);
    }
  };

  const testGetStock = async () => {
    try {
      // Use a sample service code - you'll need to get real ones from the services API
      const result = await getServiceStock('ML172-S1');
      addTestResult('Get Stock', result, true);
    } catch (error) {
      addTestResult('Get Stock', { error: error.message }, false);
    }
  };

  const testCheckStatus = async () => {
    try {
      // This will get recent transactions
      const result = await checkOrderStatus(null, 5);
      addTestResult('Check Status', result, true);
    } catch (error) {
      addTestResult('Check Status', { error: error.message }, false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-xl border border-border shadow-gaming">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-foreground">
          VIP Reseller API Test
        </h2>
        <Button onClick={clearResults} variant="outline" size="sm">
          Clear Results
        </Button>
      </div>

      {/* Test Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-surface/20 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Test User ID
          </label>
          <input
            type="text"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded text-foreground"
            placeholder="Enter User ID for testing"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Test Zone ID
          </label>
          <input
            type="text"
            value={testZoneId}
            onChange={(e) => setTestZoneId(e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded text-foreground"
            placeholder="Enter Zone ID for testing"
          />
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button
          onClick={testGetServices}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Icon name="List" size={16} />
          Test Services
        </Button>
        
        <Button
          onClick={testGetNickname}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Icon name="User" size={16} />
          Test Nickname
        </Button>
        
        <Button
          onClick={testGetStock}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Icon name="Package" size={16} />
          Test Stock
        </Button>
        
        <Button
          onClick={testCheckStatus}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Icon name="Clock" size={16} />
          Test Status
        </Button>
      </div>

      {/* API Status */}
      <div className="mb-6 p-4 bg-surface/20 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-2">API Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              import.meta.env.VITE_VIP_RESELLER_API_ID ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-text-secondary">
              API ID: {import.meta.env.VITE_VIP_RESELLER_API_ID ? 'Configured' : 'Missing'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              import.meta.env.VITE_VIP_RESELLER_API_KEY ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-text-secondary">
              API Key: {import.meta.env.VITE_VIP_RESELLER_API_KEY ? 'Configured' : 'Missing'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-text-secondary">
              Status: {loading ? 'Loading...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Test Results</h3>
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Icon name="TestTube" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No tests run yet. Click a test button above to start.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon 
                      name={result.success ? "CheckCircle" : "XCircle"} 
                      size={16} 
                      className={result.success ? "text-green-500" : "text-red-500"}
                    />
                    <span className="font-semibold text-foreground">
                      {result.test}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {result.timestamp}
                  </span>
                </div>
                <pre className="text-xs text-text-secondary bg-surface/30 p-2 rounded overflow-x-auto">
                  {result.result}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Help */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-semibold text-warning mb-1">Configuration Required</h4>
            <p className="text-warning/80 text-sm mb-2">
              To test the VIP Reseller API, you need to configure your API credentials in the .env file:
            </p>
            <pre className="text-xs bg-surface/30 p-2 rounded text-text-secondary">
{`VITE_VIP_RESELLER_API_ID=your-api-id-here
VITE_VIP_RESELLER_API_KEY=your-api-key-here`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipResellerTest;