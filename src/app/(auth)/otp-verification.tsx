import { useState, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Mail, ArrowLeft, Bus, CheckCircle2 } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import { useRouter } from 'expo-router';

export default function OTPVerificationScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
                            <CheckCircle2 size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-white tracking-[2px]">Verification</Text>
                        <Text className="text-emerald-400 mt-2 text-sm font-medium text-center">Enter the 4-digit code sent to your email</Text>
                    </View>

                    <View className="flex-row justify-between mb-12 px-4">
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                className="w-16 h-16 bg-white/10 rounded-2xl text-white text-2xl font-bold text-center border-2 border-slate-700 focus:border-emerald-500"
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onChangeText={(text) => handleOTPChange(text, index)}
                            />
                        ))}
                    </View>

                    <Button 
                        onPress={handleVerify}
                        isLoading={isLoading}
                        className="h-16 rounded-2xl shadow-lg shadow-emerald-500/20"
                    >
                        Verify Code
                    </Button>

                    <View className="flex-row justify-center items-center mt-10">
                        <Text className="text-slate-400 text-sm">Didn't receive code? </Text>
                        <TouchableOpacity>
                            <Text className="text-emerald-400 font-bold text-sm">Resend Code</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-slate-600 text-xs mt-auto pt-10">© 2026 UNIPH Transport Services</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
