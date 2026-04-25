import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Platform, ViewStyle } from 'react-native';
import { Ticket as TicketIcon, Calendar, Clock, Users } from 'lucide-react-native';
import { useBookings, type Booking } from '../../stores/bookings';
import { useAuth } from '../../stores/auth';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

const statusCfg = {
    confirmed: { bg: Colors.primaryLight, color: Colors.primary, label: 'Confirmed' },
    used:      { bg: Colors.blue50, color: Colors.blue600, label: 'Used' },
    cancelled: { bg: Colors.red50, color: Colors.red600, label: 'Cancelled' },
};

export default function TicketsScreen() {
    const { bookings, fetchMyBookings, loading } = useBookings();
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchMyBookings(user.id);
    }, [user]);

    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.payment_status === 'paid');
    const pastBookings = bookings.filter(b => b.status !== 'confirmed' && b.payment_status !== 'paid');

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <View style={styles.header as ViewStyle}>
                <Text style={styles.headerTitle}>My Tickets</Text>
                <Text style={styles.headerSubtitle}>{bookings.length} total bookings</Text>
            </View>

            <ScrollView 
                style={styles.scroll as ViewStyle}
                contentContainerStyle={styles.scrollContainer as ViewStyle}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => user && fetchMyBookings(user.id)} tintColor={Colors.primary} />
                }
            >
                {!bookings.length && !loading && (
                    <View style={styles.emptyState as ViewStyle}>
                        <View style={styles.emptyIconContainer as ViewStyle}>
                            <TicketIcon size={40} color={Colors.slate300} />
                        </View>
                        <Text style={styles.emptyTitle}>No tickets yet</Text>
                        <Text style={styles.emptySubtitle}>Your travel history will appear here</Text>
                    </View>
                )}

                {activeBookings.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Active Trips</Text>
                        {activeBookings.map((b) => (
                            <TicketCard key={b.id} ticket={b} />
                        ))}
                    </>
                )}

                {pastBookings.length > 0 && (
                    <>
                        <Text style={styles.sectionLabelPast}>Past Trips</Text>
                        {pastBookings.map((b) => (
                            <TicketCard key={b.id} ticket={b} />
                        ))}
                    </>
                )}
                <View style={styles.footerSpacer as ViewStyle} />
            </ScrollView>
        </SafeAreaView>
    );
}

function TicketCard({ ticket }: { ticket: Booking }) {
    const router = useRouter();

    return (
        <TouchableOpacity 
            onPress={() => router.push({
                pathname: '/ticket-detail' as any,
                params: { ticketId: ticket.id }
            })}
            activeOpacity={0.8}
            style={styles.card as ViewStyle}
        >
            <View style={styles.cardHeader as ViewStyle}>
                <View>
                    <Text style={styles.ticketId}>#{ticket.id.slice(0, 8).toUpperCase()}...</Text>
                    <Text style={styles.routeText}>
                        {ticket.origin} → {ticket.destination}
                    </Text>
                </View>
                <View style={[
                    styles.paymentBadge,
                    { backgroundColor: ticket.payment_status === 'paid' ? Colors.primaryLight : Colors.orange50 }
                ] as ViewStyle[]}>
                    <Text style={[
                        styles.paymentBadgeText,
                        { color: ticket.payment_status === 'paid' ? Colors.primaryDark : Colors.orange600 }
                    ]}>
                        {ticket.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                    </Text>
                </View>
            </View>

            <View style={styles.metaRow as ViewStyle}>
                <View style={styles.metaItem as ViewStyle}>
                    <Calendar size={12} color={Colors.slate400} />
                    <Text style={styles.metaText}>{new Date(ticket.booking_date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.metaItem as ViewStyle}>
                    <Clock size={12} color={Colors.slate400} />
                    <Text style={styles.metaText}>{ticket.departure_time}</Text>
                </View>
                <View style={styles.metaItem as ViewStyle}>
                    <Users size={12} color={Colors.slate400} />
                    <Text style={styles.metaText}>{ticket.seats.length} seat(s)</Text>
                </View>
            </View>

            <View style={styles.cardFooter as ViewStyle}>
                <Text style={styles.footerLabel}>Total Paid</Text>
                <Text style={styles.footerValue}>₦{ticket.total_fare}</Text>
            </View>
        </TouchableOpacity>
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
    headerSubtitle: {
        color: Colors.slate400,
        fontSize: 14,
        fontWeight: '500',
    },
    scroll: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: Colors.slate50,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    emptyTitle: {
        color: Colors.slate400,
        fontWeight: '700',
        fontSize: 16,
    },
    emptySubtitle: {
        color: Colors.slate300,
        fontSize: 12,
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.md,
    },
    sectionLabelPast: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 32,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.slate100,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    ticketId: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 10,
        color: Colors.slate400,
        fontWeight: '700',
        marginBottom: 4,
    },
    routeText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.slate900,
    },
    paymentBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    paymentBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    metaRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: '500',
        color: Colors.slate500,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: Colors.slate50,
        paddingTop: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: {
        color: Colors.slate400,
        fontSize: 12,
        fontWeight: '500',
    },
    footerValue: {
        color: Colors.primaryDark,
        fontWeight: '700',
        fontSize: 18,
    },
    footerSpacer: {
        height: 40,
    },
});
