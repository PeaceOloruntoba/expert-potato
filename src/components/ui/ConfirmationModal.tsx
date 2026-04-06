import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import Button from './Button';

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
            <View className="flex-1 bg-black/40 justify-center items-center p-6">
                <View className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative">
                    <TouchableOpacity 
                        onPress={onClose} 
                        className="absolute right-4 top-4 z-10 p-2"
                    >
                        <X size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <View className="items-center text-center mt-4">
                        <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                            variant === 'danger' ? 'bg-red-50' : 'bg-emerald-50'
                        }`}>
                            <AlertCircle size={32} color={variant === 'danger' ? '#ef4444' : '#10b981'} />
                        </View>
                        
                        <Text className="text-xl font-bold text-slate-900 mb-2 text-center">{title}</Text>
                        <Text className="text-slate-500 text-center text-sm leading-relaxed mb-8 px-2">
                            {description}
                        </Text>

                        <View className="flex-row gap-3 w-full">
                            <Button 
                                variant="secondary" 
                                onPress={onClose} 
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant={variant === 'danger' ? 'danger' : 'primary'} 
                                onPress={onConfirm} 
                                isLoading={isLoading} 
                                className="flex-1"
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
