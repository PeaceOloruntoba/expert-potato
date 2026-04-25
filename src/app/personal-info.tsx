import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ViewStyle, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User as UserIcon, Mail, Phone, Hash, ChevronLeft, Save } from 'lucide-react-native';
import { useAuth } from '../stores/auth';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { user, updateProfile, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        matric_number: user?.matric_number || '',
    });

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            router.back();
        } catch (err) {
            console.error('Update profile failed:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{
                    headerTitle: 'Personal Information',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ChevronLeft size={24} color={Colors.slate900} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={handleSave} 
                            disabled={loading}
                            style={[styles.headerButton, loading && { opacity: 0.5 }]}
                        >
                            <Save size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    ),
                }} 
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Profile Details</Text>
                    <Text style={styles.sectionSubtitle}>Keep your information up to date for a better experience.</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <UserIcon size={20} color={Colors.slate400} />
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                placeholder="Enter full name"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[styles.inputContainer, styles.disabledInput]}>
                            <Mail size={20} color={Colors.slate300} />
                            <TextInput
                                style={[styles.input, { color: Colors.slate400 }]}
                                value={user?.email}
                                editable={false}
                            />
                        </View>
                        <Text style={styles.helperText}>Email address cannot be changed.</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Phone size={20} color={Colors.slate400} />
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                                placeholder="080 0000 0000"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Matric Number</Text>
                        <View style={styles.inputContainer}>
                            <Hash size={20} color={Colors.slate400} />
                            <TextInput
                                style={styles.input}
                                value={formData.matric_number}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, matric_number: text }))}
                                placeholder="2024/0001"
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={[styles.saveButton, loading && { opacity: 0.7 }]} 
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    infoSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.slate500,
        marginBottom: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.slate700,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.slate50,
        borderWidth: 1,
        borderColor: Colors.slate200,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
    },
    disabledInput: {
        backgroundColor: Colors.slate100,
        borderColor: Colors.slate200,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: Colors.slate900,
        marginLeft: 10,
    },
    helperText: {
        fontSize: 12,
        color: Colors.slate400,
        marginTop: 6,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
