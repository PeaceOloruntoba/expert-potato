import { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bus, Ticket as TicketIcon, Calendar, Clock, Users, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookings } from '@/stores/bookings';
import { useRoutes } from '@/stores/routes';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const statusCfg = {
    confirmed: { bg: 'bg-emerald-50', color: '#10b981', label: 'Confirmed' },
    used:      { bg: 'bg-blue-50', color: '#3b82f6', label: 'Used' },
    cancelled: { bg: 'bg-red-50', color: '#ef4444', label: 'Cancelled' },
};

export default function TicketDetailScreen() {
    const router = useRouter();
    const { ticketId } = useLocalSearchParams();
    const { bookings, cancelBooking, loading } = useBookings();
    const { routes } = useRoutes();
    
    const ticket = bookings.find(b => b.id === ticketId);
    const route = routes.find(r => r.id === ticket?.routeId);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    if (!ticket) return null;
    const sc = statusCfg[ticket.status as keyof typeof statusCfg];

    const handleCancel = async () => {
        await cancelBooking(ticket.id);
        setIsCancelConfirmOpen(false);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row items-center px-6 pt-12 pb-6 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center mr-4">
                    <ArrowLeft size={20} color="#475569" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Ticket Details</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-[40px] p-8 border border-slate-100 mb-8 shadow-sm">
                    <View className="bg-slate-900 rounded-[32px] p-6 items-center mb-8">
                        <Bus size={32} color="#10b981" className="mb-4" />
                        <Text className="text-white font-mono font-bold text-2xl tracking-widest">{ticket.id}</Text>
                        <Text className="text-slate-400 text-sm mt-2">
                            {route ? `${route.from} → ${route.to}` : 'Unknown Route'}
                        </Text>
                    </View>

                    {/* Simulated QR Code */}
                    <View className="items-center mb-8">
                        <View className={`p-4 bg-white rounded-[32px] border-[3px]`} style={{ borderColor: sc.color }}>
                            <View className="w-48 h-48 bg-slate-900 rounded-2xl items-center justify-center">
                                <TicketIcon size={80} color="white" strokeWidth={1} />
                                <Text className="text-emerald-500 text-[8px] font-mono mt-4">SCAN FOR BOARDING</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {[
                            { label: 'Date', value: ticket.date },
                            { label: 'Departure', value: ticket.departure },
                            { label: 'Seats', value: ticket.seats.join(', ') },
                            { label: 'Fare', value: `₦${ticket.fare}` },
                            { label: 'Status', value: ticket.status.toUpperCase(), color: sc.color },
                            { label: 'Bus', value: route?.busId || 'N/A' },
                        ].map(item => (
                            <View key={item.label} className="w-[47%] bg-slate-50 p-4 rounded-[24px]">
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</Text>
                                <Text className="text-slate-900 font-bold text-sm" style={item.color ? { color: item.color } : {}}>{item.value}</Text>
                            </View>
                        ))}
                    </View>

                    <Text className="text-center text-slate-400 text-[10px] mt-8 font-medium">Present this QR to the driver when boarding</Text>
                </View>

                {ticket.status === 'confirmed' && (
                    <Button
                        variant="outline" 
                        onPress={() => setIsCancelConfirmOpen(true)} 
                        icon={<Trash2 size={18} color="#ef4444" />}
                        className="border-red-100 h-16 rounded-2xl mb-12"
                    >
                        <Text className="text-red-500 font-bold">Cancel Booking</Text>
                    </Button>
                )}
                <View className="h-10" />
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
