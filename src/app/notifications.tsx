import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Bell, BellOff, Info } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const router = useRouter();

    const dummyNotifications = [
        {
            id: '1',
            title: 'Welcome to Campus Transit!',
            message: 'Start booking your bus seats easily with our new mobile app.',
            time: '2 hours ago',
            read: false,
        },
        {
            id: '2',
            title: 'Payment Successful',
            message: 'Your booking for UNIBEN-Main to Faculty of Eng has been confirmed.',
            time: 'Yesterday',
            read: true,
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{
                    headerTitle: 'Notifications',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ChevronLeft size={24} color={Colors.slate900} />
                        </TouchableOpacity>
                    ),
                }} 
            />

            {dummyNotifications.length > 0 ? (
                <ScrollView style={styles.content}>
                    {dummyNotifications.map((notif) => (
                        <TouchableOpacity key={notif.id} style={styles.notifCard}>
                            <View style={styles.notifIconContainer}>
                                <Bell size={20} color={notif.read ? Colors.slate400 : Colors.primary} />
                                {!notif.read && <View style={styles.unreadDot} />}
                            </View>
                            <View style={styles.notifContent}>
                                <Text style={[styles.notifTitle, !notif.read && styles.unreadText]}>{notif.title}</Text>
                                <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
                                <Text style={styles.notifTime}>{notif.time}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    
                    <View style={styles.infoBox}>
                        <Info size={16} color={Colors.slate400} />
                        <Text style={styles.infoText}>Real-time notifications are coming soon.</Text>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <BellOff size={48} color={Colors.slate300} />
                    <Text style={styles.emptyTitle}>No notifications yet</Text>
                    <Text style={styles.emptySubtitle}>We'll notify you when something important happens.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.slate50,
    },
    headerButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    notifIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.slate50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.slate900,
        marginBottom: 4,
    },
    unreadText: {
        fontWeight: '700',
    },
    notifMessage: {
        fontSize: 13,
        color: Colors.slate600,
        lineHeight: 18,
        marginBottom: 6,
    },
    notifTime: {
        fontSize: 12,
        color: Colors.slate400,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.slate900,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.slate500,
        textAlign: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        color: Colors.slate400,
        fontStyle: 'italic',
    }
});
