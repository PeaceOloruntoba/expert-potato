import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Lock, ArrowLeft, Bus, ShieldCheck } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useRouter } from 'expo-router';

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
                            <ShieldCheck size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-white tracking-[2px]">Reset Password</Text>
                        <Text className="text-emerald-400 mt-2 text-sm font-medium text-center">Set your new password below</Text>
                    </View>

                    <View className="space-y-6">
                        <Input 
                            label="New Password"
                            placeholder="Enter new password"
                            placeholderTextColor="#64748b"
                            secureTextEntry
                            leftIcon={<Lock size={20} color="#94a3b8" />}
                            value={passwords.password}
                            onChangeText={(text) => setPasswords({ ...passwords, password: text })}
                        />

                        <Input 
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            placeholderTextColor="#64748b"
                            secureTextEntry
                            leftIcon={<Lock size={20} color="#94a3b8" />}
                            value={passwords.confirm}
                            onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
                        />

                        <Button 
                            onPress={handleReset}
                            isLoading={isLoading}
                            className="h-16 rounded-2xl shadow-lg shadow-emerald-500/20"
                        >
                            Reset Password
                        </Button>
                    </View>

                    <Text className="text-center text-slate-600 text-xs mt-auto pt-10">© 2026 UNIPH Transport Services</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
