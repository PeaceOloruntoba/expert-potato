import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ReactNode } from 'react';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface ButtonProps {
    onPress: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    isLoading?: boolean;
    icon?: ReactNode;
    style?: ViewStyle;
    disabled?: boolean;
}

export default function Button({ 
    onPress, children, variant = 'primary', isLoading, icon, style, disabled 
}: ButtonProps) {
    const buttonStyles = [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        style,
    ] as ViewStyle[];

    const textStyle = [
        styles.textBase,
        styles[`${variant}Text` as keyof typeof styles],
    ] as TextStyle[];

    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            style={buttonStyles}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? Colors.slate600 : Colors.white} />
            ) : (
                <View style={styles.content as ViewStyle}>
                    {icon && <View style={styles.iconContainer as ViewStyle}>{icon}</View>}
                    <Text style={textStyle}>{children}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.slate100,
    },
    danger: {
        backgroundColor: Colors.red500,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.slate200,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },
    textBase: {
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },
    primaryText: {
        color: Colors.white,
    },
    secondaryText: {
        color: Colors.slate600,
    },
    dangerText: {
        color: Colors.white,
    },
    outlineText: {
        color: Colors.slate600,
    },
});
