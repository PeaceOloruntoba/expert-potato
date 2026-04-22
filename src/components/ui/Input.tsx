import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
}

export default function Input({ label, error, leftIcon, ...props }: InputProps) {
    return (
        <View style={styles.container as ViewStyle}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null] as ViewStyle[]}>
                {leftIcon && <View style={styles.iconContainer as ViewStyle}>{leftIcon}</View>}
                <TextInput 
                    style={styles.input}
                    placeholderTextColor={Colors.slate400}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.slate700,
        marginLeft: 4,
        marginBottom: 6,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.slate200,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        height: 56,
    },
    inputError: {
        borderColor: Colors.red500,
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        color: Colors.slate900,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        color: Colors.red500,
        fontWeight: '500',
        marginLeft: 4,
        marginTop: 4,
    },
});
