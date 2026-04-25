import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowLeft, Bus, Ticket as TicketIcon, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookings } from '@/stores/bookings';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

const statusCfg = {
    confirmed: { bg: Colors.primaryLight, color: Colors.primary, label: 'Confirmed' },
    used:      { bg: Colors.blue50, color: Colors.blue600, label: 'Used' },
    cancelled: { bg: Colors.red50, color: Colors.red600, label: 'Cancelled' },
};

export default function TicketDetailScreen() {
    const router = useRouter();
    const { ticketId } = useLocalSearchParams();
    const { bookings, cancelBooking, loading } = useBookings();
    
    const ticket = bookings.find(b => b.id === ticketId);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    if (!ticket) return null;
    const sc = statusCfg[ticket.status as keyof typeof statusCfg] || statusCfg.confirmed;

    const handleCancel = async () => {
        await cancelBooking(ticket.id);
        setIsCancelConfirmOpen(false);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={20} color={Colors.slate600} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket Details</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.ticketCard}>
                    <View style={styles.ticketHero}>
                        <Bus size={32} color={Colors.primary} style={styles.heroIcon} />
                        <Text style={styles.heroTicketId}>{ticket.id.toUpperCase()}</Text>
                        <Text style={styles.heroRouteText}>
                            {ticket.origin} → {ticket.destination}
                        </Text>
                    </View>

                    {/* Simulated QR Code */}
                    <View style={styles.qrContainer}>
                        <View style={[
                            styles.qrBorder,
                            { borderColor: ticket.payment_status === 'paid' ? Colors.primary : Colors.orange600 }
                        ]}>
                            <View style={styles.qrInner}>
                                <TicketIcon size={80} color={Colors.white} strokeWidth={1} />
                                <Text style={styles.qrLabel}>
                                    {ticket.payment_status === 'paid' ? 'VALID TICKET' : 'PAYMENT PENDING'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.detailsGrid}>
                        {[
                            { label: 'Date', value: new Date(ticket.booking_date).toLocaleDateString() },
                            { label: 'Departure', value: ticket.departure_time },
                            { label: 'Seats', value: ticket.seats.join(', ') },
                            { label: 'Total Fare', value: `₦${ticket.total_fare}` },
                            { label: 'Status', value: ticket.status.toUpperCase(), color: sc.color },
                            { label: 'Payment', value: ticket.payment_status.toUpperCase(), color: ticket.payment_status === 'paid' ? Colors.primary : Colors.orange600 },
                        ].map(item => (
                            <View key={item.label} style={styles.detailItem}>
                                <Text style={styles.detailLabel}>{item.label}</Text>
                                <Text style={[styles.detailValue, item.color ? { color: item.color } : null]}>{item.value}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.helperText}>Present this QR to the driver when boarding</Text>
                </View>

                {ticket.status === 'confirmed' && (
                    <Button
                        variant="outline" 
                        onPress={() => setIsCancelConfirmOpen(true)} 
                        icon={<Trash2 size={18} color={Colors.red500} />}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                    </Button>
                )}
                <View style={styles.footerSpacer} />
            </ScrollView>

            <ConfirmationModal 
                isOpen={isCancelConfirmOpen}
                onClose={() => setIsCancelConfirmOpen(false)}
                onConfirm={handleCancel}
                title="Cancel Ticket?"
                description="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel"
                variant="danger"
                isLoading={loading}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl + 10,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backButton: {
        width: 48,
        height: 48,
        backgroundColor: Colors.slate50,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.slate900,
    },
    scroll: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
    },
    ticketCard: {
        backgroundColor: Colors.white,
        borderRadius: 40,
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.slate100,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    ticketHero: {
        backgroundColor: Colors.slate900,
        borderRadius: 32,
        padding: Spacing.lg,
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    heroIcon: {
        marginBottom: Spacing.md,
    },
    heroTicketId: {
        color: Colors.white,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 2,
        textAlign: 'center',
    },
    heroRouteText: {
        color: Colors.slate400,
        fontSize: 12,
        marginTop: Spacing.sm,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    qrBorder: {
        padding: Spacing.sm,
        backgroundColor: Colors.white,
        borderRadius: 32,
        borderWidth: 3,
    },
    qrInner: {
        width: 192,
        height: 192,
        backgroundColor: Colors.slate900,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrLabel: {
        color: Colors.primary,
        fontSize: 8,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginTop: Spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    detailItem: {
        width: '47%',
        backgroundColor: Colors.slate50,
        padding: Spacing.md,
        borderRadius: 24,
    },
    detailLabel: {
        color: Colors.slate400,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    detailValue: {
        color: Colors.slate900,
        fontWeight: '700',
        fontSize: 14,
    },
    helperText: {
        textAlign: 'center',
        color: Colors.slate400,
        fontSize: 10,
        marginTop: Spacing.xl,
        fontWeight: '500',
    },
    cancelButton: {
        borderColor: Colors.red100,
        height: 64,
        borderRadius: BorderRadius.xl,
        marginBottom: 48,
    },
    cancelButtonText: {
        color: Colors.red500,
        fontWeight: '700',
    },
    footerSpacer: {
        height: 40,
    },
});
