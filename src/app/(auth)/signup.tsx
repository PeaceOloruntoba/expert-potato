import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle, Alert } from 'react-native';
import { Bus, Mail, Lock, User as UserIcon, ArrowLeft, Hash, Phone } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Link, useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function SignupScreen() {
    const { signup, loading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', phone: '', matric_number: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        setError(null);
        if (!form.name || !form.email || !form.phone || !form.matric_number || !form.password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            const result = await signup(form);
            Alert.alert("Success", "Account created successfully! Please verify your email.", [
                { text: "Verify Now", onPress: () => router.push({ 
                    pathname: '/otp-verification' as any, 
                    params: { email: form.email, user_id: result.user_id } 
                }) }
            ]);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Signup failed";
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
                            <Bus size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join UNIPH Campus Transit</Text>
                    </View>

                    <View style={styles.form as ViewStyle}>
                        <Input 
                            label="Full Name"
                            placeholder="e.g. Chidi Nwosu"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<UserIcon size={20} color={Colors.slate400} />}
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                        />

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
                            label="Phone Number"
                            placeholder="e.g. 08012345678"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<Phone size={20} color={Colors.slate400} />}
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(text) => setForm({ ...form, phone: text })}
                        />

                        <Input 
                            label="Matric Number"
                            placeholder="e.g. CSC/2021/042"
                            placeholderTextColor={Colors.slate500}
                            leftIcon={<Hash size={20} color={Colors.slate400} />}
                            autoCapitalize="characters"
                            value={form.matric_number}
                            onChangeText={(text) => setForm({ ...form, matric_number: text })}
                        />

                        <Input 
                            label="Password"
                            placeholder="Create a password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />

                        {error && (
                            <View style={styles.errorContainer as ViewStyle}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Button 
                            onPress={handleSignup}
                            isLoading={loading}
                            style={styles.signupButton as ViewStyle}
                        >
                            Create Account
                        </Button>

                        <View style={styles.loginRow as ViewStyle}>
                            <Text style={styles.loginLabel}>Already have an account? </Text>
                            <Link href="/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.loginText}>Sign In</Text>
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
    signupButton: {
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
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    loginLabel: {
        color: Colors.slate400,
        fontSize: 14,
    },
    loginText: {
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
