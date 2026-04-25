import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle, Alert } from 'react-native';
import { Bus, Mail, Lock, User as UserIcon } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Link, useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        if (!form.email || !form.password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            const result = await login(form);
            if (!result.verified) {
                Alert.alert("Verify Account", "Please verify your account to continue.", [
                    { text: "Verify Now", onPress: () => router.push({ 
                        pathname: '/otp-verification' as any, 
                        params: { email: form.email, user_id: result.user_id } 
                    }) }
                ]);
            }
            // RootLayout handles redirection for verified users
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Login failed";
            setError(msg);
        }
    };

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1 as ViewStyle}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer as ViewStyle} style={styles.flex1 as ViewStyle} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero as ViewStyle}>
                        <View style={styles.logoContainer as ViewStyle}>
                            <Bus size={48} color={Colors.white} />
                        </View>
                        <Text style={styles.appName}>PAULO</Text>
                        <Text style={styles.uniName}>University of Port Harcourt</Text>
                    </View>

                    <View style={styles.form as ViewStyle}>
                        <Text style={styles.welcomeTitle}>Welcome Back</Text>
                        
                        <Input 
                            label="Email Address"
                            placeholder="e.g. chidi@uniph.edu.ng"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<Mail size={20} color={Colors.slate400} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                        />

                        <Input 
                            label="Password"
                            placeholder="Enter your password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />

                        <TouchableOpacity 
                            onPress={() => router.push('/forgot-password' as any)}
                            style={styles.forgotPassword as ViewStyle}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {error && (
                            <View style={styles.errorContainer as ViewStyle}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Button 
                            onPress={handleLogin}
                            isLoading={loading}
                            icon={<UserIcon size={20} color={Colors.white} />}
                            style={styles.studentButton as ViewStyle}
                        >
                            Sign In
                        </Button>

                        <View style={styles.signupRow as ViewStyle}>
                            <Text style={styles.signupLabel}>Don't have an account? </Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signupText}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
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
    scrollContainer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl * 2,
        paddingBottom: Spacing.xl,
        flexGrow: 1,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 64,
    },
    logoContainer: {
        width: 96,
        height: 96,
        backgroundColor: Colors.primary,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: 4,
    },
    uniName: {
        color: Colors.primary,
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
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
    form: {
        flex: 1,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: Spacing.xl,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: Spacing.xl,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    studentButton: {
        height: 64,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.primary,
        marginBottom: Spacing.md,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    signupLabel: {
        color: Colors.slate400,
        fontSize: 14,
    },
    signupText: {
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
