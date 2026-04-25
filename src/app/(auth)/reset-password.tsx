import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle, Alert } from 'react-native';
import { Lock, ArrowLeft, ShieldCheck, Hash } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../stores/auth';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { email: emailParam, user_id } = useLocalSearchParams();
    const { resetPassword, loading } = useAuth();
    const [form, setForm] = useState({ email: (emailParam as string) || '', otp: '', password: '', confirm: '' });
    const [error, setError] = useState<string | null>(null);

    const handleReset = async () => {
        setError(null);
        if (!form.email || !form.otp || !form.password || !form.confirm) {
            setError("Please fill in all fields");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match");
            return;
        }
        if (!user_id) {
            setError("User ID is missing. Please try again.");
            return;
        }
        try {
            await resetPassword({ user_id, otp: form.otp, password: form.password });
            Alert.alert("Success", "Password reset successfully!", [
                { text: "Sign In", onPress: () => router.replace('/login' as any) }
            ]);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Reset failed";
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
                            <ShieldCheck size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Set your new password below</Text>
                    </View>

                    <View style={styles.form as ViewStyle}>
                        {!emailParam && (
                            <Input 
                                label="Email Address"
                                placeholder="Enter your email"
                                placeholderTextColor={Colors.slate500}
                                value={form.email}
                                onChangeText={(text) => setForm({ ...form, email: text })}
                            />
                        )}

                        <Input 
                            label="Verification Code"
                            placeholder="Enter 4-digit code"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<Hash size={20} color={Colors.slate400} />}
                            keyboardType="number-pad"
                            value={form.otp}
                            onChangeText={(text) => setForm({ ...form, otp: text })}
                        />

                        <Input 
                            label="New Password"
                            placeholder="Enter new password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />

                        <Input 
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={form.confirm}
                            onChangeText={(text) => setForm({ ...form, confirm: text })}
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
                            Reset Password
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
