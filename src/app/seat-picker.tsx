import { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoutes } from '@/stores/routes';
import { useBookings } from '@/stores/bookings';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function SeatPickerScreen() {
    const router = useRouter();
    const { routeId } = useLocalSearchParams();
    const { routes } = useRoutes();
    const { addBooking, loading, bookedSeats, fetchBookedSeats } = useBookings();
    
    const route = routes.find(r => r.id === routeId);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [dep, setDep] = useState(route?.departures[0] || '');
    const [date] = useState(new Date().toISOString().split('T')[0]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (route && dep) {
            fetchBookedSeats(route.id, dep, date);
        }
    }, [route, dep, date]);

    if (!route) return null;

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

    const capacity = 32; // Default capacity if not specified in route
    const seatRows = Array.from({ length: capacity }, (_, i) => ({ id: i + 1 }));

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row items-center px-6 pt-12 pb-6 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center mr-4">
                    <ArrowLeft size={20} color="#475569" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-slate-900">Select Seats</Text>
                    <Text className="text-slate-400 text-xs font-medium">{route.origin} → {route.destination}</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Departure Times */}
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Departure Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8">
                    {route.departures.map((d: string) => (
                        <TouchableOpacity 
                            key={d} 
                            onPress={() => setDep(d)}
                            className={`mr-3 px-6 py-3 rounded-2xl border-2 ${
                                dep === d ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'
                            }`}
                        >
                            <Text className={`font-mono font-bold ${dep === d ? 'text-emerald-600' : 'text-slate-500'}`}>{d}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Bus Layout */}
                <View className="bg-white rounded-[40px] p-8 border border-slate-100 mb-8 shadow-sm">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-slate-900 font-bold text-base">Bus Layout</Text>
                        <View className="bg-slate-50 px-3 py-1 rounded-lg">
                            <Text className="text-slate-400 font-mono text-[10px]">{route.bus_plate || route.bus_id}</Text>
                        </View>
                    </View>

                    <View className="bg-slate-50 py-3 rounded-2xl items-center mb-8 border border-dashed border-slate-200">
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">🚌 Driver's Area</Text>
                    </View>

                    <View className="flex-row flex-wrap justify-between">
                        {seatRows.map(s => {
                            const isBooked = bookedSeats.includes(s.id);
                            const isSelected = selectedSeats.includes(s.id);
                            return (
                                <TouchableOpacity 
                                    key={s.id} 
                                    onPress={() => toggleSeat(s.id, isBooked)}
                                    activeOpacity={0.7}
                                    className={`w-[22%] aspect-square rounded-xl items-center justify-center mb-3 ${
                                        isBooked ? 'bg-slate-100' : 
                                        isSelected ? 'bg-emerald-500' : 'bg-emerald-50'
                                    }`}
                                >
                                    <Text className={`font-bold text-xs ${
                                        isBooked ? 'text-slate-300' : 
                                        isSelected ? 'text-white' : 'text-emerald-600'
                                    }`}>{s.id}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="flex-row justify-center gap-6 mt-6">
                        {[
                            { label: 'Free', color: 'bg-emerald-50', border: 'border-emerald-200' },
                            { label: 'Selected', color: 'bg-emerald-500', border: 'border-emerald-500' },
                            { label: 'Booked', color: 'bg-slate-100', border: 'border-slate-200' },
                        ].map(item => (
                            <View key={item.label} className="flex-row items-center">
                                <View className={`w-3 h-3 rounded-full mr-2 ${item.color} border ${item.border}`} />
                                <Text className="text-[10px] font-bold text-slate-400">{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {selectedSeats.length > 0 && (
                    <View className="bg-slate-900 rounded-[32px] p-8 mb-12 shadow-2xl shadow-slate-900/40">
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-slate-400 font-medium">Selected Seats</Text>
                            <Text className="text-white font-mono font-bold text-lg">{selectedSeats.sort((a,b)=>a-b).join(', ')}</Text>
                        </View>
                        <View className="flex-row justify-between mb-8">
                            <Text className="text-slate-400 font-medium">Total Fare</Text>
                            <Text className="text-emerald-400 font-bold text-3xl">₦{route.fare * selectedSeats.length}</Text>
                        </View>
                        <Button onPress={handleBook} isLoading={loading} className="h-16 rounded-2xl bg-emerald-500">
                            Confirm Booking
                        </Button>
                    </View>
                )}
                <View className="h-10" />
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
