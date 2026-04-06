import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
    onPress: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    isLoading?: boolean;
    icon?: ReactNode;
    className?: string;
    disabled?: boolean;
}

export default function Button({ 
    onPress, children, variant = 'primary', isLoading, icon, className = "", disabled 
}: ButtonProps) {
    const bgStyles = {
        primary: 'bg-emerald-500',
        secondary: 'bg-slate-100',
        danger: 'bg-red-500',
        outline: 'bg-transparent border border-slate-200',
    }[variant];

    const textStyles = {
        primary: 'text-white',
        secondary: 'text-slate-600',
        danger: 'text-white',
        outline: 'text-slate-600',
    }[variant];

    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            className={`rounded-2xl p-4 flex-row items-center justify-center ${bgStyles} ${disabled ? 'opacity-50' : ''} ${className}`}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? '#475569' : 'white'} />
            ) : (
                <View className="flex-row items-center">
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text className={`font-bold text-base text-center ${textStyles}`}>{children}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
