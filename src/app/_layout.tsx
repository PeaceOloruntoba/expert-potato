import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useColorScheme, Text, View } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState, SplashScreen } from 'expo-router';
import { useAuth } from '../stores/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { user, token } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const [isNavigationReady, setNavigationReady] = useState(false);

    useEffect(() => {
        if (rootNavigationState?.key) {
            setNavigationReady(true);
            SplashScreen.hideAsync();
        }
    }, [rootNavigationState?.key]);

    useEffect(() => {
        if (!isNavigationReady) return;

        const inAuthGroup = segments[0] === '(auth)';
        const isAuthenticated = !!token && !!user;

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, token, segments, isNavigationReady]);

    if (!isNavigationReady) {
        return null; // Or a custom loading component
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="seat-picker" options={{ presentation: 'modal' }} />
                <Stack.Screen name="ticket-detail" options={{ presentation: 'modal' }} />
            </Stack>
        </ThemeProvider>
    );
}
