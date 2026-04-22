import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [passwords, setPasswords] = useState({ password: '', confirm: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/login');
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
                            <ShieldCheck size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Set your new password below</Text>
                    </View>

                    <View style={styles.form}>
                        <Input 
                            label="New Password"
                            placeholder="Enter new password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={passwords.password}
                            onChangeText={(text) => setPasswords({ ...passwords, password: text })}
                        />

                        <Input 
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            placeholderTextColor={Colors.slate500}
                            secureTextEntry
                            leftIcon={<Lock size={20} color={Colors.slate400} />}
                            value={passwords.confirm}
                            onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                        />

                        <Button 
                            onPress={handleReset}
                            isLoading={isLoading}
                            style={styles.resetButton}
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
