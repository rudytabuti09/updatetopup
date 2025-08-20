import { useState, useEffect } from 'react';
import { vipResellerApi, gameHelpers, handleApiError } from '../services/vipResellerApi';
import { useNotification } from '../contexts/NotificationContext';

export const useVipResellerApi = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Get available services
  const getServices = async (filterValue = null) => {
    setLoading(true);
    try {
      const response = await vipResellerApi.getServices('game', filterValue, 'available');
      setServices(response.data || []);
      return response.data;
    } catch (error) {
      showError(handleApiError(error), 'Error Loading Services');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get service stock
  const getServiceStock = async (serviceCode) => {
    try {
      const response = await vipResellerApi.getServiceStock(serviceCode);
      return response.data;
    } catch (error) {
      showError(handleApiError(error), 'Error Checking Stock');
      return null;
    }
  };

  // Get game nickname
  const getGameNickname = async (gameType, userId, zoneId = null) => {
    setLoading(true);
    try {
      let response;
      
      switch (gameType.toLowerCase()) {
        case 'mobile-legends':
        case 'mobilelegends':
          response = await gameHelpers.mobileLegends.getNickname(userId, zoneId);
          break;
        case 'pubg-mobile':
        case 'pubgmobile':
          response = await gameHelpers.pubgMobile.getNickname(userId);
          break;
        case 'free-fire':
        case 'freefire':
          response = await gameHelpers.freeFire.getNickname(userId);
          break;
        case 'genshin-impact':
        case 'genshinimpact':
          response = await gameHelpers.genshinImpact.getNickname(userId, zoneId);
          break;
        default:
          throw new Error('Game type not supported');
      }
      
      return response.data;
    } catch (error) {
      showError(handleApiError(error), 'Error Getting Nickname');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create game order
  const createGameOrder = async (gameType, serviceCode, userId, zoneId = null) => {
    setLoading(true);
    try {
      let response;
      
      switch (gameType.toLowerCase()) {
        case 'mobile-legends':
        case 'mobilelegends':
          response = await gameHelpers.mobileLegends.topUp(serviceCode, userId, zoneId);
          break;
        case 'pubg-mobile':
        case 'pubgmobile':
          response = await gameHelpers.pubgMobile.topUp(serviceCode, userId);
          break;
        case 'free-fire':
        case 'freefire':
          response = await gameHelpers.freeFire.topUp(serviceCode, userId);
          break;
        case 'genshin-impact':
        case 'genshinimpact':
          response = await gameHelpers.genshinImpact.topUp(serviceCode, userId, zoneId);
          break;
        default:
          response = await vipResellerApi.createGameOrder(serviceCode, userId, zoneId);
      }
      
      if (response.result) {
        showSuccess(
          `Order berhasil dibuat! Transaction ID: ${response.data.trxid}`,
          'Order Success'
        );
        setOrderStatus(response.data);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showError(handleApiError(error), 'Order Failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check order status
  const checkOrderStatus = async (trxId = null) => {
    setLoading(true);
    try {
      const response = await vipResellerApi.checkOrderStatus(trxId);
      setOrderStatus(response.data);
      return response.data;
    } catch (error) {
      showError(handleApiError(error), 'Error Checking Status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Validate user ID and zone (for games that require it)
  const validateGameAccount = async (gameType, userId, zoneId = null) => {
    try {
      const nickname = await getGameNickname(gameType, userId, zoneId);
      if (nickname) {
        showSuccess(`Account found: ${nickname}`, 'Account Validated');
        return { valid: true, nickname };
      } else {
        showError('Account not found. Please check your User ID and Zone ID.', 'Invalid Account');
        return { valid: false, nickname: null };
      }
    } catch (error) {
      showError(handleApiError(error), 'Validation Error');
      return { valid: false, nickname: null };
    }
  };

  return {
    loading,
    services,
    orderStatus,
    getServices,
    getServiceStock,
    getGameNickname,
    createGameOrder,
    checkOrderStatus,
    validateGameAccount
  };
};

// Hook for specific game operations
export const useGameTopUp = (gameType) => {
  const vipApi = useVipResellerApi();
  const [gameServices, setGameServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [userAccount, setUserAccount] = useState({
    userId: '',
    zoneId: '',
    nickname: '',
    validated: false
  });

  // Load services for specific game
  useEffect(() => {
    const loadGameServices = async () => {
      const services = await vipApi.getServices(gameType);
      setGameServices(services);
    };

    if (gameType) {
      loadGameServices();
    }
  }, [gameType]);

  // Validate account
  const validateAccount = async (userId, zoneId = null) => {
    const result = await vipApi.validateGameAccount(gameType, userId, zoneId);
    setUserAccount({
      userId,
      zoneId: zoneId || '',
      nickname: result.nickname || '',
      validated: result.valid
    });
    return result;
  };

  // Process top-up
  const processTopUp = async (serviceCode) => {
    if (!userAccount.validated) {
      throw new Error('Please validate your account first');
    }

    return await vipApi.createGameOrder(
      gameType,
      serviceCode,
      userAccount.userId,
      userAccount.zoneId || null
    );
  };

  return {
    ...vipApi,
    gameServices,
    selectedService,
    setSelectedService,
    userAccount,
    validateAccount,
    processTopUp
  };
};

export default useVipResellerApi;