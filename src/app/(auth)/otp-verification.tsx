import { useState, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function OTPVerificationScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleOTPChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/reset-password');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.flex1} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <View style={styles.logoContainer}>
                            <CheckCircle2 size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Verification</Text>
                        <Text style={styles.subtitle}>Enter the 4-digit code sent to your email</Text>
                    </View>

                    <View style={styles.otpRow}>
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

                    <Button 
                        onPress={handleVerify}
                        isLoading={isLoading}
                        style={styles.verifyButton}
                    >
                        Verify Code
                    </Button>

                    <View style={styles.resendRow}>
                        <Text style={styles.resendLabel}>Didn't receive code? </Text>
                        <TouchableOpacity>
                            <Text style={styles.resendText}>Resend Code</Text>
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
