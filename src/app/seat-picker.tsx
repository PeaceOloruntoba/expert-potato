import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform, ViewStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoutes } from '@/stores/routes';
import { useFleet } from '@/stores/fleet';
import { useBookings } from '@/stores/bookings';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export default function SeatPickerScreen() {
    const router = useRouter();
    const { routeId } = useLocalSearchParams();
    const { routes } = useRoutes();
    const { buses, fetchBuses } = useFleet();
    const { addBooking, loading, bookedSeats, fetchBookedSeats } = useBookings();
    
    const route = routes.find(r => r.id === routeId);
    const bus = buses.find(b => b.id === route?.bus_id);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [dep, setDep] = useState(route?.departures?.[0] || '');
    const [date] = useState(new Date().toISOString().split('T')[0]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (route && dep) {
            fetchBookedSeats(route.id, dep, date);
        }
    }, [route, dep, date]);

    // Fetch buses when the component mounts to ensure data is available
    useEffect(() => {
        fetchBuses();
    }, [fetchBuses]);

    if (!route || !bus) return null;

    const toggleSeat = (id: number, isBooked: boolean) => {
        if (isBooked) return;
        if (selectedSeats.includes(id)) {
            setSelectedSeats(prev => prev.filter(s => s !== id));
        } else {
            if (selectedSeats.length >= 4) {
                Alert.alert("Limit Reached", "You can only book up to 4 seats at once.");
                return;
            }
            setSelectedSeats(prev => [...prev, id]);
        }
    };

    const handleBook = () => {
        if (selectedSeats.length === 0) return;
        setIsConfirmOpen(true);
    };

    const confirmBooking = async () => {
        try {
            const result = await addBooking({
                route_id: route.id,
                departure_time: dep,
                booking_date: date,
                seats: selectedSeats,
            });
            setIsConfirmOpen(false);
            
            // Navigate to payment screen with authorization URL
            router.push({
                pathname: '/payment' as any,
                params: { 
                    authUrl: result.payment.authorization_url,
                    reference: result.payment.reference
                }
            });
        } catch (err: any) {
            Alert.alert("Booking Failed", err.response?.data?.message || err.message);
        }
    };

    const capacity = bus?.capacity || 32;
    const frontSeatsCount = capacity <= 8 ? 1 : 2;
    const totalSeats = Array.from({ length: capacity }, (_, i) => ({ id: i + 1 }));
    const frontSeats = totalSeats.slice(0, frontSeatsCount);
    const mainSeats = totalSeats.slice(frontSeatsCount);

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <View style={styles.header as ViewStyle}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton as ViewStyle}>
                    <ArrowLeft size={20} color={Colors.slate600} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Select Seats</Text>
                    <Text style={styles.headerSubtitle}>{route.origin} → {route.destination}</Text>
                </View>
            </View>

            <ScrollView style={styles.scroll as ViewStyle} contentContainerStyle={styles.scrollContainer as ViewStyle} showsVerticalScrollIndicator={false}>
                {/* Departure Times */}
                <Text style={styles.sectionLabel}>Departure Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.departureScroll as ViewStyle}>
                    {route.departures?.map((d: string) => (
                        <TouchableOpacity 
                            key={d} 
                            onPress={() => setDep(d)}
                            style={[
                                styles.departureOption,
                                dep === d ? styles.departureOptionActive : null
                            ] as ViewStyle[]}
                        >
                            <Text style={[
                                styles.departureText,
                                dep === d ? styles.departureTextActive : null
                            ]}>{d}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Bus Layout */}
                <View style={styles.layoutCard as ViewStyle}>
                    <View style={styles.layoutHeader as ViewStyle}>
                        <Text style={styles.layoutTitle}>Bus Layout</Text>
                        <View style={styles.busPlateBadge as ViewStyle}>
                            <Text style={styles.busPlateText}>{bus.plate_number}</Text>
                        </View>
                    </View>

                    <View style={styles.driverArea as ViewStyle}>
                        <Text style={styles.driverText}>🚌 Driver's Area</Text>
                    </View>

                    <View style={styles.frontSeatsContainer as ViewStyle}>
                        {frontSeats.map(s => {
                            const isBooked = bookedSeats.includes(s.id);
                            const isSelected = selectedSeats.includes(s.id);
                            return (
                                <TouchableOpacity 
                                    key={s.id} 
                                    onPress={() => toggleSeat(s.id, isBooked)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.seat,
                                        isBooked ? styles.seatBooked : 
                                        isSelected ? styles.seatSelected : styles.seatFree
                                    ] as ViewStyle[]}
                                >
                                    <Text style={[
                                        styles.seatText,
                                        isBooked ? styles.seatTextBooked : 
                                        isSelected ? styles.seatTextSelected : styles.seatTextFree
                                    ]}>{s.id}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.seatsGrid as ViewStyle}>
                        {mainSeats.map(s => {
                            const isBooked = bookedSeats.includes(s.id);
                            const isSelected = selectedSeats.includes(s.id);
                            return (
                                <TouchableOpacity 
                                    key={s.id} 
                                    onPress={() => toggleSeat(s.id, isBooked)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.seat,
                                        isBooked ? styles.seatBooked : 
                                        isSelected ? styles.seatSelected : styles.seatFree
                                    ] as ViewStyle[]}
                                >
                                    <Text style={[
                                        styles.seatText,
                                        isBooked ? styles.seatTextBooked : 
                                        isSelected ? styles.seatTextSelected : styles.seatTextFree
                                    ]}>{s.id}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.legend as ViewStyle}>
                        {[
                            { label: 'Free', color: Colors.primaryLight, border: Colors.primary + '33' },
                            { label: 'Selected', color: Colors.primary, border: Colors.primary },
                            { label: 'Booked', color: Colors.slate100, border: Colors.slate200 },
                        ].map(item => (
                            <View key={item.label} style={styles.legendItem as ViewStyle}>
                                <View style={[styles.legendDot, { backgroundColor: item.color, borderColor: item.border }] as ViewStyle[]} />
                                <Text style={styles.legendText}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {selectedSeats.length > 0 && (
                    <View style={styles.summaryCard as ViewStyle}>
                        <View style={styles.summaryRow as ViewStyle}>
                            <Text style={styles.summaryLabel}>Selected Seats</Text>
                            <Text style={styles.summaryValue}>{selectedSeats.sort((a,b)=>a-b).join(', ')}</Text>
                        </View>
                        <View style={styles.summaryRow as ViewStyle}>
                            <Text style={styles.summaryLabel}>Total Fare</Text>
                            <Text style={styles.fareTotal}>₦{route.fare * selectedSeats.length}</Text>
                        </View>
                        <Button onPress={handleBook} isLoading={loading} style={styles.bookButton as ViewStyle}>
                            Confirm Booking
                        </Button>
                    </View>
                )}
                <View style={styles.footerSpacer} />
            </ScrollView>

            <ConfirmationModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmBooking}
                title="Confirm Booking"
                description={`You are about to book ${selectedSeats.length} seat(s) for ₦${route.fare * selectedSeats.length}. Proceed to payment?`}
                confirmText="Yes, Proceed to Payment"
                variant="proceed"
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
    headerSubtitle: {
        color: Colors.slate400,
        fontSize: 12,
        fontWeight: '500',
    },
    scroll: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.md,
    },
    departureScroll: {
        flexDirection: 'row',
        marginBottom: Spacing.xl,
    },
    departureOption: {
        marginRight: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: 12,
        borderRadius: BorderRadius.xl,
        borderWidth: 2,
        borderColor: Colors.slate100,
        backgroundColor: Colors.white,
    },
    departureOptionActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    departureText: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: '700',
        color: Colors.slate500,
    },
    departureTextActive: {
        color: Colors.primaryDark,
    },
    layoutCard: {
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
    layoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    layoutTitle: {
        color: Colors.slate900,
        fontWeight: '700',
        fontSize: 16,
    },
    busPlateBadge: {
        backgroundColor: Colors.slate50,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    busPlateText: {
        color: Colors.slate400,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 10,
    },
    driverArea: {
        backgroundColor: Colors.slate50,
        paddingVertical: 12,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.slate200,
    },
    driverText: {
        color: Colors.slate400,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    frontSeatsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
        paddingVertical: Spacing.md,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    seatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
    },
    seat: {
        width: '22%',
        aspectRatio: 1,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    seatFree: {
        backgroundColor: Colors.primaryLight,
    },
    seatSelected: {
        backgroundColor: Colors.primary,
    },
    seatBooked: {
        backgroundColor: Colors.slate100,
    },
    seatText: {
        fontWeight: '700',
        fontSize: 12,
    },
    seatTextFree: {
        color: Colors.primaryDark,
    },
    seatTextSelected: {
        color: Colors.white,
    },
    seatTextBooked: {
        color: Colors.slate300,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.xl,
        marginTop: Spacing.lg,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.slate400,
    },
    summaryCard: {
        backgroundColor: Colors.slate900,
        borderRadius: 32,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        shadowColor: Colors.slate900,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    summaryLabel: {
        color: Colors.slate400,
        fontWeight: '500',
    },
    summaryValue: {
        color: Colors.white,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: '700',
        fontSize: 18,
    },
    fareTotal: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 30,
    },
    bookButton: {
        height: 64,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.primary,
        marginTop: Spacing.lg,
    },
    footerSpacer: {
        height: 40,
    },
});
