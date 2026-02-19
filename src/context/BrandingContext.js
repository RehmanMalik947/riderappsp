import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme/theme';

const BrandingContext = createContext();

export const BrandingProvider = ({ children }) => {
    const [branding, setBranding] = useState({
        companyName: 'Rider Fleet',
        logoUrl: null,
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.primaryLight,
        thirdColor: theme.colors.white,
    });
    const [loadingBranding, setLoadingBranding] = useState(true);

    useEffect(() => {
        loadBranding();
    }, []);

    const loadBranding = async () => {
        try {
            const storedBranding = await AsyncStorage.getItem('branding');
            if (storedBranding) {
                setBranding(JSON.parse(storedBranding));
            }
        } catch (error) {
            console.error('Failed to load branding:', error);
        } finally {
            setLoadingBranding(false);
        }
    };

    const updateBranding = async (newBranding) => {
        try {
            const updated = {
                companyName: newBranding.companyName || branding.companyName,
                logoUrl: newBranding.logoUrl || branding.logoUrl,
                primaryColor: newBranding.primaryColor || theme.colors.primary,
                secondaryColor: newBranding.secondaryColor || theme.colors.primaryLight,
                thirdColor: newBranding.thirdColor || theme.colors.white,
            };
            setBranding(updated);
            await AsyncStorage.setItem('branding', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to update branding:', error);
        }
    };

    const resetBranding = async () => {
        const defaultBranding = {
            companyName: 'Rider Fleet',
            logoUrl: null,
            primaryColor: theme.colors.primary,
            secondaryColor: theme.colors.primaryLight,
            thirdColor: theme.colors.white,
        };
        setBranding(defaultBranding);
        await AsyncStorage.removeItem('branding');
    };

    // Helper to get dynamic theme based on current branding
    const dynamicTheme = {
        ...theme,
        colors: {
            ...theme.colors,
            primary: branding.primaryColor,
            primaryDark: branding.primaryColor,
            primaryLight: branding.secondaryColor,
            accent: branding.secondaryColor,
        },
    };

    return (
        <BrandingContext.Provider value={{
            branding,
            updateBranding,
            resetBranding,
            loadingBranding,
            theme: dynamicTheme
        }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
