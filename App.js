import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { notificationService } from './src/service/NotificationService';
import Toast from 'react-native-toast-message';
import { BrandingProvider } from './src/context/BrandingContext';

const App = () => {
  useEffect(() => {
    notificationService.initialize();
  }, []);

  return (
    <BrandingProvider>
      <AppNavigator />
      <Toast />
    </BrandingProvider>
  );
};


export default App;
