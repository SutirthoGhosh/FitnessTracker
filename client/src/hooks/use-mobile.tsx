import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    // Check if running on native mobile platform
    const isNative = Capacitor.isNativePlatform();
    const currentPlatform = Capacitor.getPlatform();
    
    setIsMobile(isNative);
    setPlatform(currentPlatform);
  }, []);

  return {
    isMobile,
    platform,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web'
  };
}