import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, ArrowLeft, Bus, AlertCircle } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/otp-verification');
        }, 1500);
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
                            <AlertCircle size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-white tracking-[2px]">Forgot Password?</Text>
                        <Text className="text-emerald-400 mt-2 text-sm font-medium text-center">Don't worry! Enter your email to reset your password</Text>
                    </View>

                    <View className="space-y-6">
                        <Input 
                            label="Email Address"
                            placeholder="e.g. chidi@uniph.edu.ng"
                            placeholderTextColor="#64748b"
                            leftIcon={<Mail size={20} color="#94a3b8" />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Button 
                            onPress={handleReset}
                            isLoading={isLoading}
                            className="h-16 rounded-2xl shadow-lg shadow-emerald-500/20"
                        >
                            Send Reset Code
                        </Button>
                    </View>

                    <Text className="text-center text-slate-600 text-xs mt-auto pt-10">© 2026 UNIPH Transport Services</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
