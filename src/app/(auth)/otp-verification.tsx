import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput, StyleSheet, ViewStyle, Alert } from 'react-native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../stores/auth';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function OTPVerificationScreen() {
    const router = useRouter();
    const { email, user_id } = useLocalSearchParams();
    const { verifyOTP, resendOTP, loading } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOTPChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setError(null);
        const code = otp.join('');
        if (code.length < 4) {
            setError("Please enter the full 4-digit code");
            return;
        }
        if (!user_id) {
            setError("User ID is missing. Please try signing up again.");
            return;
        }
        try {
            await verifyOTP({ user_id, otp: code });
            Alert.alert("Success", "Email verified successfully!", [
                { text: "Continue", onPress: () => router.replace('/(auth)/login' as any) }
            ]);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Verification failed";
            setError(msg);
        }
    };

    const handleResend = async () => {
        setError(null);
        if (!user_id) {
            setError("User ID is missing.");
            return;
        }
        try {
            await resendOTP(user_id as string);
            Alert.alert("Success", "A new code has been sent to your email.");
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Resend failed";
            setError(msg);
        }
    };

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1 as ViewStyle}
            >
                <View style={styles.header as ViewStyle}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton as ViewStyle}>
                        <ArrowLeft size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer as ViewStyle} style={styles.flex1 as ViewStyle} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero as ViewStyle}>
                        <View style={styles.logoContainer as ViewStyle}>
                            <CheckCircle2 size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Verification</Text>
                        <Text style={styles.subtitle}>Enter the 4-digit code sent to {email || 'your email'}</Text>
                    </View>

                    <View style={styles.otpRow as ViewStyle}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                style={[
                                    styles.otpInput,
                                    focusedIndex === index ? styles.otpInputFocused : null
                                ]}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onFocus={() => setFocusedIndex(index)}
                                onBlur={() => setFocusedIndex(null)}
                                onChangeText={(text) => handleOTPChange(text, index)}
                            />
                        ))}
                    </View>

                    {error && (
                        <View style={styles.errorContainer as ViewStyle}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <Button 
                        onPress={handleVerify}
                        isLoading={loading}
                        style={styles.verifyButton as ViewStyle}
                    >
                        Verify Code
                    </Button>

                    <View style={styles.resendRow as ViewStyle}>
                        <Text style={styles.resendLabel}>Didn't receive code? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={loading}>
                            <Text style={[styles.resendText, loading && { opacity: 0.5 }]}>Resend Code</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.copyright}>© 2026 UNIPH Transport Services</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.slate900,
    },
    flex1: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    backButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
        flexGrow: 1,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: Colors.primary,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: Colors.white,
        letterSpacing: 2,
    },
    subtitle: {
        color: Colors.primary,
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 48,
        paddingHorizontal: Spacing.md,
    },
    otpInput: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: BorderRadius.xl,
        color: Colors.white,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: Colors.slate700,
    },
    otpInputFocused: {
        borderColor: Colors.primary,
    },
    verifyButton: {
        height: 64,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    resendLabel: {
        color: Colors.slate400,
        fontSize: 14,
    },
    resendText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    copyright: {
        textAlign: 'center',
        color: Colors.slate700,
        fontSize: 12,
        marginTop: 40,
    },
});
