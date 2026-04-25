import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle, Alert } from 'react-native';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useRouter } from 'expo-router';
import { useAuth } from '../../stores/auth';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { forgotPassword, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleReset = async () => {
        setError(null);
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        try {
            const result = await forgotPassword(email);
            Alert.alert("Success", "Reset code sent to your email!", [
                { text: "Continue", onPress: () => router.push({ 
                    pathname: '/reset-password' as any, 
                    params: { email, user_id: result.user_id } 
                }) }
            ]);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Request failed";
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
                            <AlertCircle size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>Don't worry! Enter your email to reset your password</Text>
                    </View>

                    <View style={styles.form as ViewStyle}>
                        <Input 
                            label="Email Address"
                            placeholder="e.g. chidi@uniph.edu.ng"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<Mail size={20} color={Colors.slate400} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {error && (
                            <View style={styles.errorContainer as ViewStyle}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Button 
                            onPress={handleReset}
                            isLoading={loading}
                            style={styles.resetButton as ViewStyle}
                        >
                            Send Reset Code
                        </Button>
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
        textAlign: 'center',
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
        marginTop: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    resetButton: {
        height: 64,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.primary,
        marginTop: Spacing.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    copyright: {
        textAlign: 'center',
        color: Colors.slate700,
        fontSize: 12,
        marginTop: 40,
    },
});
