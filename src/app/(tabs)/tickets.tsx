import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ticket as TicketIcon, Calendar, Clock, Users, ArrowLeft, Trash2 } from 'lucide-react-native';
import { useBookings, type Booking } from '../../stores/bookings';
import { useRoutes } from '../../stores/routes';
import { useRouter } from 'expo-router';

const statusCfg = {
    confirmed: { bg: 'bg-emerald-50', color: '#10b981', label: 'Confirmed' },
    used:      { bg: 'bg-blue-50', color: '#3b82f6', label: 'Used' },
    cancelled: { bg: 'bg-red-50', color: '#ef4444', label: 'Cancelled' },
};

export default function TicketsScreen() {
    const { bookings, fetchMyBookings, loading } = useBookings();
    const { routes } = useRoutes();
    const router = useRouter();

    useEffect(() => {
        fetchMyBookings('STU001'); // Mock current user ID
    }, []);

    const activeBookings = bookings.filter(b => b.status === 'confirmed');
    const pastBookings = bookings.filter(b => b.status !== 'confirmed');

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 pt-12 pb-6 bg-white border-b border-slate-100">
                <Text className="text-2xl font-bold text-slate-900">My Tickets</Text>
                <Text className="text-slate-400 text-sm font-medium">{bookings.length} total bookings</Text>
            </View>

            <ScrollView 
                className="flex-1 px-6 pt-6" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => fetchMyBookings('STU001')} tintColor="#10b981" />
                }
            >
                {!bookings.length && (
                    <View className="items-center justify-center py-20">
                        <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                            <TicketIcon size={40} color="#cbd5e1" />
                        </View>
                        <Text className="text-slate-400 font-bold">No tickets yet</Text>
                        <Text className="text-slate-300 text-xs mt-1">Your travel history will appear here</Text>
                    </View>
                )}

                {activeBookings.length > 0 && (
                    <>
                        <Text className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">Active Trips</Text>
                        {activeBookings.map((b) => (
                            <TicketCard key={b.id} ticket={b} routes={routes} />
                        ))}
                    </>
                )}

                {pastBookings.length > 0 && (
                    <>
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-4">Past Trips</Text>
                        {pastBookings.map((b) => (
                            <TicketCard key={b.id} ticket={b} routes={routes} />
                        ))}
                    </>
                )}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}

function TicketCard({ ticket, routes }: { ticket: Booking, routes: any[] }) {
    const route = routes.find(r => r.id === ticket.routeId);
    const sc = statusCfg[ticket.status as keyof typeof statusCfg];
    const router = useRouter();

    return (
        <TouchableOpacity 
            onPress={() => router.push({
                pathname: '/ticket-detail',
                params: { ticketId: ticket.id }
            })}
            activeOpacity={0.8}
            className="bg-white rounded-[32px] p-6 mb-4 border border-slate-100 shadow-sm"
        >
            <View className="flex-row justify-between items-start mb-4">
                <View>
                    <Text className="font-mono text-[10px] text-slate-400 font-bold mb-1">{ticket.id}</Text>
                    <Text className="text-base font-bold text-slate-900">
                        {route ? `${route.from.split(' ')[0]} → ${route.to.split(' ')[0]}` : 'Unknown Route'}
                    </Text>
                </View>
                <View className={`${sc.bg} px-3 py-1 rounded-full`}>
                    <Text className="text-[10px] font-bold uppercase" style={{ color: sc.color }}>{sc.label}</Text>
                </View>
            </View>

            <View className="flex-row gap-4 mb-4">
                <View className="flex-row items-center">
                    <Calendar size={12} color="#94a3b8" />
                    <Text className="ml-2 text-xs font-medium text-slate-500">{ticket.date}</Text>
                </View>
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="ml-2 text-xs font-medium text-slate-500">{ticket.departure}</Text>
                </View>
                <View className="flex-row items-center">
                    <Users size={12} color="#94a3b8" />
                    <Text className="ml-2 text-xs font-medium text-slate-500">{ticket.seats.length} seat(s)</Text>
                </View>
            </View>

            <View className="border-t border-slate-50 pt-4 flex-row justify-between items-center">
                <Text className="text-slate-400 text-xs font-medium">Total Paid</Text>
                <Text className="text-emerald-600 font-bold text-lg">₦{ticket.fare}</Text>
            </View>
        </TouchableOpacity>
    );
}
