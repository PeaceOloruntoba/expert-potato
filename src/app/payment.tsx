import React from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useBookings } from '@/stores/bookings';

export default function PaymentScreen() {
    const router = useRouter();
    const { authUrl, reference } = useLocalSearchParams();
    const { verifyPayment } = useBookings();
    const [loading, setLoading] = React.useState(true);

    const handleNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        
        // Paystack callback URL or success page
        if (url.includes('checkout.paystack.com') && url.includes('status=success')) {
            // This is just one way, better to check for the reference in the URL or wait for the user to close
        }

        // Check if the URL matches Paystack's default close/callback pattern
        // Or if it matches our own callback URL if we provided one
        if (url.includes('callback') || url.includes('finish') || url.includes('success')) {
            try {
                const result = await verifyPayment(reference as string);
                if (result.success) {
                    Alert.alert("Success", "Payment verified successfully!", [
                        { text: "View Tickets", onPress: () => router.replace('/(tabs)/tickets' as any) }
                    ]);
                } else {
                    Alert.alert("Payment Failed", "Could not verify payment. Please contact support.");
                    router.back();
                }
            } catch (err) {
                console.error("Verification error:", err);
                // Even if verification fails here, the user might have paid. 
                // We should probably redirect to tickets anyway and let them refresh.
                router.replace('/(tabs)/tickets' as any);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-6 pt-12 pb-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-4">
                    <ArrowLeft size={20} color="#475569" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Secure Payment</Text>
            </View>

            <View className="flex-1">
                <WebView
                    source={{ uri: authUrl as string }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    style={{ flex: 1 }}
                />
                {loading && (
                    <View className="absolute inset-0 items-center justify-center bg-white/80">
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text className="mt-4 text-slate-500 font-medium">Loading Secure Checkout...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
