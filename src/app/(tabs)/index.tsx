import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, TextInput, Platform, ViewStyle } from 'react-native';
import { Search, MapPin, Clock, Users, Bus, CheckCircle, X } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import { useRoutes, type Route } from '../../stores/routes';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import Modal from 'react-native-modal';

export default function HomeScreen() {
    const { user } = useAuth();
    const { routes, fetchRoutes, loading } = useRoutes();
    const [search, setSearch] = useState("");
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (params.booking_success === 'true') {
            setIsSuccessModalOpen(true);
            // Clear params by replacing current route
            router.replace('/(tabs)');
        }
    }, [params.booking_success]);

    useEffect(() => {
        fetchRoutes();
    }, []);

    console.log(routes)

    const filteredRoutes = useMemo(() => routes.filter((r: Route) => 
        r.origin.toLowerCase().includes(search.toLowerCase()) || 
        r.destination.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
    ), [routes, search]);

    return (
        <SafeAreaView style={styles.container as ViewStyle}>
            <View style={styles.flex1 as ViewStyle}>
                <View style={styles.header as ViewStyle}>
                    <View style={styles.headerTop as ViewStyle}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>{user?.name.split(" ")[0] || 'User'} 👋</Text>
                        </View>
                        <View style={styles.avatar as ViewStyle}>
                            <Text style={styles.avatarText}>{user?.name[0] || 'U'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.searchBar as ViewStyle}>
                        <Search size={20} color={Colors.slate400} />
                        <TextInput 
                            placeholder="Search routes or destinations..." 
                            placeholderTextColor={Colors.slate500}
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                <ScrollView 
                    style={styles.scrollContent as ViewStyle}
                    contentContainerStyle={styles.scrollContainer as ViewStyle}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchRoutes} tintColor={Colors.primary} />
                    }
                >
                    {/* Stats Strip */}
                    <View style={styles.statsStrip as ViewStyle}>
                        <View style={styles.statCardPrimary as ViewStyle}>
                            <Bus size={24} color={Colors.white} />
                            <Text style={styles.statValue}>{routes.length}</Text>
                            <Text style={styles.statLabelPrimary}>Active Routes</Text>
                        </View>
                        <View style={styles.statCardDark as ViewStyle}>
                            <Clock size={24} color={Colors.primary} />
                            <Text style={styles.statValue}>08:30</Text>
                            <Text style={styles.statLabelDark}>Next Departure</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Available Routes</Text>

                    {filteredRoutes.map((route: Route) => (
                        <TouchableOpacity 
                            key={route.id}
                            onPress={() => router.push({
                                pathname: '/seat-picker' as any,
                                params: { routeId: route.id }
                            })}
                            style={styles.routeCard as ViewStyle}
                            activeOpacity={0.9}
                        >
                            <View style={styles.routeCardTop as ViewStyle}>
                                <View style={styles.routeInfo as ViewStyle}>
                                    <View style={styles.routeIdContainer as ViewStyle}>
                                        <View style={[styles.colorDot, { backgroundColor: route.color }] as ViewStyle[]} />
                                        <Text style={styles.routeId}>#{route.id.slice(0, 8)}</Text>
                                    </View>
                                    <View style={styles.locationRow as ViewStyle}>
                                        <MapPin size={16} color={Colors.primary} />
                                        <Text style={styles.locationText}>{route.origin}</Text>
                                    </View>
                                    <View style={styles.locationRow as ViewStyle}>
                                        <MapPin size={16} color={Colors.red500} />
                                        <Text style={styles.locationText}>{route.destination}</Text>
                                    </View>
                                </View>
                                <View style={styles.fareContainer as ViewStyle}>
                                    <Text style={styles.fareAmount}>₦{route.fare}</Text>
                                    <Text style={styles.fareLabel}>per seat</Text>
                                </View>
                            </View>

                            <View style={styles.routeCardBottom as ViewStyle}>
                                <View style={styles.routeMeta as ViewStyle}>
                                    <View style={styles.metaItem as ViewStyle}>
                                        <Clock size={14} color={Colors.slate400} />
                                        <Text style={styles.metaText}>{route.duration}</Text>
                                    </View>
                                    <View style={styles.metaItem as ViewStyle}>
                                        <Users size={14} color={Colors.slate400} />
                                        <Text style={styles.metaText}>Available</Text>
                                    </View>
                                </View>
                                <View style={styles.nextDepartureBadge as ViewStyle}>
                                    <Text style={styles.nextDepartureText}>Next: {route.departures?.[0] || 'N/A'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.footerSpacer as ViewStyle} />
                </ScrollView>

                {/* Success Modal */}
                <Modal 
                    isVisible={isSuccessModalOpen}
                    onBackdropPress={() => setIsSuccessModalOpen(false)}
                    onBackButtonPress={() => setIsSuccessModalOpen(false)}
                    backdropOpacity={0.5}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                >
                    <View style={styles.modalContent}>
                        <View style={styles.successIconContainer}>
                            <CheckCircle size={60} color={Colors.white} />
                        </View>
                        
                        <Text style={styles.modalTitle}>Booking Successful!</Text>
                        <Text style={styles.modalDescription}>
                            Your seat has been reserved successfully.
                        </Text>
                        
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Departure</Text>
                                <Text style={styles.detailValue}>{params.departure_time || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Date</Text>
                                <Text style={styles.detailValue}>{params.booking_date ? new Date(params.booking_date as string).toLocaleDateString() : 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Seat(s)</Text>
                                <Text style={styles.detailValue}>{params.seat_numbers || 'N/A'}</Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => {
                                setIsSuccessModalOpen(false);
                                router.push('/(tabs)/tickets' as any);
                            }}
                        >
                            <Text style={styles.modalButtonText}>View Ticket</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setIsSuccessModalOpen(false)}
                        >
                            <X size={20} color={Colors.slate400} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.slate50,
    },
    flex1: {
        flex: 1,
    },
    header: {
        backgroundColor: Colors.slate900,
        padding: Spacing.lg,
        paddingTop: Spacing.xl + 10,
        paddingBottom: Spacing.xl,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        shadowColor: Colors.slate900,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    welcomeText: {
        color: Colors.slate400,
        fontSize: 14,
        fontWeight: '500',
    },
    userName: {
        color: Colors.white,
        fontSize: 30,
        fontWeight: '700',
    },
    avatar: {
        width: 56,
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 24,
    },
    searchBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        height: 56,
    },
    searchInput: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
        marginLeft: Spacing.sm,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    statsStrip: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCardPrimary: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 28,
        padding: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    statCardDark: {
        flex: 1,
        backgroundColor: Colors.slate900,
        borderRadius: 28,
        padding: Spacing.lg,
        shadowColor: Colors.slate900,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    statValue: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '700',
        marginTop: Spacing.sm,
    },
    statLabelPrimary: {
        color: Colors.primaryLight,
        fontSize: 12,
        fontWeight: '500',
    },
    statLabelDark: {
        color: Colors.slate400,
        fontSize: 12,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: Spacing.lg,
    },
    routeCard: {
        backgroundColor: Colors.white,
        borderRadius: 32,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.slate100,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    routeCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    routeInfo: {
        flex: 1,
    },
    routeIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: Spacing.sm,
    },
    routeId: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 10,
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalContent: {
        backgroundColor: Colors.white,
        padding: 30,
        borderRadius: 40,
        alignItems: 'center',
        position: 'relative',
    },
    successIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 14,
        color: Colors.slate500,
        textAlign: 'center',
        marginBottom: 24,
    },
    detailsCard: {
        backgroundColor: Colors.slate50,
        borderRadius: 24,
        padding: 20,
        width: '100%',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: Colors.slate400,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: Colors.slate900,
        fontWeight: '700',
    },
    modalButton: {
        backgroundColor: Colors.slate900,
        width: '100%',
        height: 56,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.slate900,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
    },
    locationText: {
        marginLeft: Spacing.sm,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.slate900,
    },
    fareContainer: {
        alignItems: 'flex-end',
        backgroundColor: Colors.primaryLight,
        padding: Spacing.md,
        borderRadius: BorderRadius.xl,
    },
    fareAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primaryDark,
    },
    fareLabel: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    routeCardBottom: {
        borderTopWidth: 1,
        borderTopColor: Colors.slate50,
        paddingTop: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routeMeta: {
        flexDirection: 'row',
        gap: Spacing.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        marginLeft: Spacing.sm,
        fontSize: 12,
        fontWeight: '700',
        color: Colors.slate500,
    },
    nextDepartureBadge: {
        backgroundColor: Colors.slate900,
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        borderRadius: BorderRadius.lg,
    },
    nextDepartureText: {
        color: Colors.primary,
        fontSize: 10,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        textTransform: 'uppercase',
    },
    footerSpacer: {
        height: 20,
    },
});
