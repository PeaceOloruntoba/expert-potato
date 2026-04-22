import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Button from './Button';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'proceed';
}

const { width } = Dimensions.get('window');

export default function ConfirmationModal({
    isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", isLoading, variant = 'danger'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <Modal
            transparent
            visible={isOpen}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay as ViewStyle}>
                <View style={styles.modalContainer as ViewStyle}>
                    <TouchableOpacity 
                        onPress={onClose} 
                        style={styles.closeButton as ViewStyle}
                    >
                        <X size={20} color={Colors.slate400} />
                    </TouchableOpacity>

                    <View style={styles.content as ViewStyle}>
                        <View style={[
                            styles.iconCircle, 
                            { backgroundColor: variant === 'danger' ? Colors.red50 : Colors.primaryLight }
                        ] as ViewStyle[]}>
                            <AlertCircle size={32} color={variant === 'danger' ? Colors.red500 : Colors.primary} />
                        </View>
                        
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>
                            {description}
                        </Text>

                        <View style={styles.footer as ViewStyle}>
                            <Button 
                                variant="secondary" 
                                onPress={onClose} 
                                style={styles.button as ViewStyle}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant={variant === 'danger' ? 'danger' : 'primary'} 
                                onPress={onConfirm} 
                                isLoading={isLoading} 
                                style={styles.button as ViewStyle}
                            >
                                {confirmText}
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.lg,
        width: '100%',
        maxWidth: 400,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: Spacing.md,
        top: Spacing.md,
        zIndex: 10,
        padding: Spacing.sm,
    },
    content: {
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        gap: Spacing.md,
        width: '100%',
    },
    button: {
        flex: 1,
    },
});
