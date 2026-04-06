import { View, Text, TextInput, TextInputProps } from 'react-native';
import { ReactNode } from 'react';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
}

export default function Input({ label, error, leftIcon, ...props }: InputProps) {
    return (
        <View className="space-y-1.5 w-full mb-4">
            {label && <Text className="text-sm font-semibold text-slate-700 ml-1">{label}</Text>}
            <View className="relative flex-row items-center border border-slate-200 rounded-2xl bg-white px-4">
                {leftIcon && <View className="mr-3">{leftIcon}</View>}
                <TextInput 
                    className="flex-1 py-4 text-slate-900 text-base"
                    placeholderTextColor="#94a3b8"
                    {...props}
                />
            </View>
            {error && <Text className="text-xs text-red-500 font-medium ml-1">{error}</Text>}
        </View>
    );
}
