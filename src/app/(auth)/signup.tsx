import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Bus, Mail, Lock, User as UserIcon, Shield, ChevronRight, ArrowLeft, Hash } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Link, useRouter } from 'expo-router';

export default function SignupScreen() {
    const { loading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', matric: '', password: '' });

    const handleSignup = async () => {
        // Mock signup
        console.log('Signup payload:', form);
        router.push('/otp-verification');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="px-8 pt-12 pb-6">
                    <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 pt-4 pb-10">
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 bg-emerald-500 rounded-[28px] items-center justify-center mb-5 shadow-2xl shadow-emerald-500/50">
                            <Bus size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-white tracking-[2px]">Create Account</Text>
                        <Text className="text-emerald-400 mt-2 text-sm font-medium text-center">Join UNIPH Campus Transit</Text>
                    </View>

                    <View className="space-y-4">
                        <Input 
                            label="Full Name"
                            placeholder="e.g. Chidi Nwosu"
                            placeholderTextColor="#64748b"
                            leftIcon={<UserIcon size={20} color="#94a3b8" />}
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                        />

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
                            label="Matric Number"
                            placeholder="e.g. CSC/2021/042"
                            placeholderTextColor="#64748b"
                            leftIcon={<Hash size={20} color="#94a3b8" />}
                            autoCapitalize="characters"
                            value={form.matric}
                            onChangeText={(text) => setForm({ ...form, matric: text })}
                        />

                        <Input 
                            label="Password"
                            placeholder="Create a password"
                            placeholderTextColor="#64748b"
                            secureTextEntry
                            leftIcon={<Lock size={20} color="#94a3b8" />}
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />

                        <Button 
                            onPress={handleSignup}
                            isLoading={loading}
                            className="h-16 rounded-2xl mt-8 shadow-lg shadow-emerald-500/20"
                        >
                            Create Account
                        </Button>

                        <View className="flex-row justify-center items-center mt-10">
                            <Text className="text-slate-400 text-sm">Already have an account? </Text>
                            <Link href="/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-emerald-400 font-bold text-sm">Sign In</Text>
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
