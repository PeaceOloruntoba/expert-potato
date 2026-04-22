import { useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Platform, ViewStyle } from 'react-native';
import { User as UserIcon, LogOut, ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import { useBookings } from '../../stores/bookings';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Button from '../../components/ui/Button';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { bookings } = useBookings();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const stats = useMemo(() => {
        const used = bookings.filter((b) => b.status === 'used').length;
        const active = bookings.filter((b) => b.status === 'confirmed').length;
        const spent = bookings.filter((b) => b.status !== 'cancelled').reduce((acc, b) => acc + (b.total_fare || 0), 0);
        return { used, active, spent };
    }, [bookings]);

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <View style={styles.header as ViewStyle}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView style={styles.scroll as ViewStyle} contentContainerStyle={styles.scrollContainer as ViewStyle} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard as ViewStyle}>
                    <View style={styles.avatar as ViewStyle}>
                        <Text style={styles.avatarText}>{user?.name[0] || 'U'}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@uniph.edu.ng'}</Text>
                    {user?.matric && (
                        <View style={styles.matricBadge as ViewStyle}>
                            <Text style={styles.matricText}>{user.matric}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.statsRow as ViewStyle}>
                    {[
                        { label: 'Trips', value: stats.used, color: '#3b82f6' },
                        { label: 'Active', value: stats.active, color: Colors.primary },
                        { label: 'Spent', value: `₦${stats.spent}`, color: '#f59e0b' },
                    ].map(item => (
                        <View key={item.label} style={styles.statCard as ViewStyle}>
                            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.menuCard as ViewStyle}>
                    {[
                        { label: 'Personal Information', icon: UserIcon },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Security & Password', icon: Shield },
                        { label: 'Help & Support', icon: HelpCircle },
                    ].map((item, index, arr) => (
                        <TouchableOpacity 
                            key={item.label} 
                            style={[
                                styles.menuItem,
                                index !== arr.length - 1 ? styles.menuItemBorder : null
                            ] as ViewStyle[]}
                        >
                            <View style={styles.menuItemLeft as ViewStyle}>
                                <View style={styles.menuIconContainer as ViewStyle}>
                                    <item.icon size={20} color={Colors.slate500} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <ChevronRight size={18} color={Colors.slate300} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Button 
                    variant="secondary" 
                    onPress={() => setIsLogoutConfirmOpen(true)} 
                    icon={<LogOut size={20} color={Colors.red500} />}
                    style={styles.signOutButton as ViewStyle}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Button>
                
                <View style={styles.footerSpacer as ViewStyle} />
            </ScrollView>

            <ConfirmationModal 
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={() => {
                    logout();
                    setIsLogoutConfirmOpen(false);
                }}
                title="Sign Out"
                description="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                variant="danger"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.slate50,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl + 10,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.slate900,
    },
    scroll: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    profileCard: {
        backgroundColor: Colors.white,
        borderRadius: 40,
        padding: Spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.slate100,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    avatar: {
        width: 96,
        height: 96,
        backgroundColor: Colors.primary,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    avatarText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 36,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 4,
    },
    userEmail: {
        color: Colors.slate400,
        fontWeight: '500',
        marginBottom: Spacing.sm,
    },
    matricBadge: {
        backgroundColor: Colors.slate900,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    matricText: {
        color: Colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 10,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.slate100,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        color: Colors.slate400,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    menuCard: {
        backgroundColor: Colors.white,
        borderRadius: 32,
        padding: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.slate100,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate50,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: Colors.slate50,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    menuLabel: {
        color: Colors.slate700,
        fontWeight: '600',
        fontSize: 14,
    },
    signOutButton: {
        height: 64,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.red50,
        borderWidth: 1,
        borderColor: Colors.red100,
        marginBottom: 40,
    },
    signOutText: {
        color: Colors.red500,
        fontWeight: '700',
    },
    footerSpacer: {
        height: 40,
    },
});
