import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Bus, Mail, Lock, User as UserIcon, Shield, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleLogin = async (role: 'student' | 'admin') => {
        await login(role);
        // After login, the root _layout.tsx will handle the redirect to /(tabs)
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 pt-16 pb-10">
                    <View className="items-center mb-16">
                        <View className="w-24 h-24 bg-emerald-500 rounded-[32px] items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50">
                            <Bus size={48} color="white" />
                        </View>
                        <Text className="text-4xl font-bold text-white tracking-[4px]">CAMPUSTRANSIT</Text>
                        <Text className="text-emerald-400 mt-2 text-base font-medium">University of Port Harcourt</Text>
                    </View>

                    <View className="space-y-4">
                        <Text className="text-2xl font-bold text-white mb-6">Welcome Back</Text>
                        
                        <Input 
                            label="Email Address"
                            placeholder="e.g. chidi@uniph.edu.ng"
                            placeholderTextColor="#64748b"
                            leftIcon={<Mail size={20} color="#94a3b8" />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                        />

                        <Input 
                            label="Password"
                            placeholder="Enter your password"
                            placeholderTextColor="#64748b"
                            secureTextEntry
                            leftIcon={<Lock size={20} color="#94a3b8" />}
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />

                        <TouchableOpacity 
                            onPress={() => router.push('/forgot-password')}
                            className="items-end mb-6"
                        >
                            <Text className="text-emerald-400 font-bold text-sm">Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button 
                            onPress={() => handleLogin('student')}
                            isLoading={loading}
                            icon={<UserIcon size={20} color="white" />}
                            className="h-16 rounded-2xl shadow-lg shadow-emerald-500/20"
                        >
                            Student Login
                        </Button>

                        <Button 
                            onPress={() => handleLogin('admin')}
                            variant="outline"
                            isLoading={loading}
                            icon={<Shield size={20} color="#94a3b8" />}
                            className="h-16 rounded-2xl border-slate-700 bg-white/5"
                        >
                            <Text className="text-slate-300 font-bold">Admin Dashboard</Text>
                        </Button>

                        <View className="flex-row justify-center items-center mt-10">
                            <Text className="text-slate-400 text-sm">Don't have an account? </Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text className="text-emerald-400 font-bold text-sm">Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    <Text className="text-center text-slate-600 text-xs mt-auto pt-10">© 2026 UNIPH Transport Services</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
