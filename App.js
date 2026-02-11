import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { notificationService } from './src/service/NotificationService';

const App = () => {
  useEffect(() => {
    notificationService.initialize();
  }, []);

  return <AppNavigator />;
};

export default App;