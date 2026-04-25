import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Phone, Mail, ExternalLink, HelpCircle } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    const router = useRouter();

    const handleCall = () => Linking.openURL('tel:+2348000000000');
    const handleEmail = () => Linking.openURL('mailto:support@paulo.com');
    const handleWhatsApp = () => Linking.openURL('https://wa.me/2348000000000');

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{
                    headerTitle: 'Help & Support',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ChevronLeft size={24} color={Colors.slate900} />
                        </TouchableOpacity>
                    ),
                }} 
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <View style={styles.heroIconContainer}>
                        <HelpCircle size={40} color={Colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>How can we help?</Text>
                    <Text style={styles.heroSubtitle}>Find answers to common questions or reach out to our team.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Instructions</Text>
                    <View style={styles.instructionCard}>
                        <View style={styles.instructionItem}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Choose your route from the home screen.</Text>
                        </View>
                        <View style={styles.instructionItem}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>Select a convenient departure time and your preferred seat.</Text>
                        </View>
                        <View style={styles.instructionItem}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>Complete payment securely via Paystack.</Text>
                        </View>
                        <View style={styles.instructionItem}>
                            <Text style={styles.stepNumber}>4</Text>
                            <Text style={styles.stepText}>Find your ticket in the 'Tickets' tab and show it to the driver.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <View style={styles.contactList}>
                        <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
                            <View style={[styles.contactIcon, { backgroundColor: '#e8f5e9' }]}>
                                <MessageCircle size={20} color="#4caf50" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>WhatsApp Support</Text>
                                <Text style={styles.contactValue}>Chat with us directly</Text>
                            </View>
                            <ExternalLink size={16} color={Colors.slate300} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                            <View style={[styles.contactIcon, { backgroundColor: '#e3f2fd' }]}>
                                <Phone size={20} color="#2196f3" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Phone Support</Text>
                                <Text style={styles.contactValue}>+234 800 000 0000</Text>
                            </View>
                            <ExternalLink size={16} color={Colors.slate300} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                            <View style={[styles.contactIcon, { backgroundColor: '#fff3e0' }]}>
                                <Mail size={20} color="#ff9800" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Email Us</Text>
                                <Text style={styles.contactValue}>support@paulo.com</Text>
                            </View>
                            <ExternalLink size={16} color={Colors.slate300} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Campus Transit v1.0.0</Text>
                </View>
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
    },
    heroSection: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: Colors.slate50,
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: Colors.slate900,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 20,
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 16,
    },
    instructionCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 24,
        marginRight: 12,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: Colors.slate600,
        lineHeight: 20,
    },
    contactList: {
        gap: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.slate900,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 12,
        color: Colors.slate500,
    },
    footer: {
        padding: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: Colors.slate300,
    }
});
