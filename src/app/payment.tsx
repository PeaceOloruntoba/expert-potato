import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useBookings } from '@/stores/bookings';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function PaymentScreen() {
    const router = useRouter();
    const { authUrl, reference } = useLocalSearchParams();
    const { verifyPayment } = useBookings();
    const [loading, setLoading] = React.useState(true);

    const handleNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        
        // Check if the URL matches Paystack's default close/callback pattern
        if (url.includes('callback') || url.includes('finish') || url.includes('success')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const paystackRef = urlParams.get('reference');
            const finalReference = paystackRef || (reference as string);

            if (!finalReference) {
                Alert.alert("Payment Error", "Payment reference not found.");
                router.back();
                return;
            }
            try {
                const result = await verifyPayment(finalReference);
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
                router.replace('/(tabs)/tickets' as any);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={20} color={Colors.slate600} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Secure Payment</Text>
            </View>

            <View style={styles.webViewContainer}>
                <WebView
                    source={{ uri: authUrl as string }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    style={styles.webView}
                />
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Loading Secure Checkout...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl + 10,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: Colors.slate50,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.slate900,
    },
    webViewContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loadingText: {
        marginTop: Spacing.md,
        color: Colors.slate500,
        fontWeight: '500',
    },
});
