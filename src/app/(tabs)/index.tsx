import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Search, MapPin, Clock, Users, Bus } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import { useRoutes, type Route } from '../../stores/routes';
import Input from '../../components/ui/Input';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const { user } = useAuth();
    const { routes, fetchRoutes, loading } = useRoutes();
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchRoutes();
    }, []);

    const filteredRoutes = useMemo(() => routes.filter((r: Route) => 
        r.from.toLowerCase().includes(search.toLowerCase()) || 
        r.to.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
    ), [routes, search]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-1">
                <View className="bg-slate-900 p-6 pt-12 pb-10 rounded-b-[48px] shadow-2xl shadow-slate-900/20">
                    <View className="flex-row justify-between items-center mb-8">
                        <View>
                            <Text className="text-slate-400 text-sm font-medium">Welcome back,</Text>
                            <Text className="text-white text-3xl font-bold">{user?.name.split(" ")[0] || 'User'} 👋</Text>
                        </View>
                        <View className="w-14 h-14 bg-emerald-500 rounded-[20px] items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Text className="text-white font-bold text-2xl">{user?.name[0] || 'U'}</Text>
                        </View>
                    </View>
                    
                    <View className="bg-white/10 rounded-2xl px-4 py-1 flex-row items-center border border-white/5">
                        <Search size={20} color="#94a3b8" />
                        <Input 
                            placeholder="Search routes or destinations..." 
                            placeholderTextColor="#64748b"
                            className="text-white h-14 border-0 bg-transparent text-base ml-2"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                <ScrollView 
                    className="flex-1 px-6 pt-8" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchRoutes} tintColor="#10b981" />
                    }
                >
                    {/* Stats Strip */}
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 bg-emerald-500 rounded-[28px] p-5 shadow-lg shadow-emerald-500/20">
                            <Bus size={24} color="white" />
                            <Text className="text-white text-3xl font-bold mt-2">{routes.length}</Text>
                            <Text className="text-emerald-100 text-xs font-medium">Active Routes</Text>
                        </View>
                        <View className="flex-1 bg-slate-900 rounded-[28px] p-5 shadow-lg shadow-slate-900/20">
                            <Clock size={24} color="#10b981" />
                            <Text className="text-white text-2xl font-bold mt-2 font-mono">08:30</Text>
                            <Text className="text-slate-400 text-xs font-medium">Next Departure</Text>
                        </View>
                    </View>

                    <Text className="text-xl font-bold text-slate-900 mb-6">Available Routes</Text>

                    {filteredRoutes.map((route: Route) => (
                        <TouchableOpacity 
                            key={route.id}
                            onPress={() => router.push({
                                pathname: '/seat-picker',
                                params: { routeId: route.id }
                            })}
                            className="bg-white rounded-[32px] p-6 mb-6 border border-slate-100 shadow-sm"
                            activeOpacity={0.9}
                        >
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-3">
                                        <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: route.color }} />
                                        <Text className="font-mono text-[10px] text-slate-400 uppercase tracking-[2px] font-bold">{route.id}</Text>
                                    </View>
                                    <View className="flex-row items-center mb-2">
                                        <MapPin size={16} color="#10b981" />
                                        <Text className="ml-3 text-lg font-bold text-slate-900">{route.from}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <MapPin size={16} color="#ef4444" />
                                        <Text className="ml-3 text-lg font-bold text-slate-900">{route.to}</Text>
                                    </View>
                                </View>
                                <View className="items-end bg-emerald-50 p-3 rounded-2xl">
                                    <Text className="text-2xl font-bold text-emerald-600">₦{route.fare}</Text>
                                    <Text className="text-[10px] text-emerald-500 font-bold uppercase mt-1">per seat</Text>
                                </View>
                            </View>

                            <View className="border-t border-slate-50 pt-5 flex-row justify-between items-center">
                                <View className="flex-row gap-4">
                                    <View className="flex-row items-center">
                                        <Clock size={14} color="#94a3b8" />
                                        <Text className="ml-2 text-xs font-bold text-slate-500">{route.duration}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Users size={14} color="#94a3b8" />
                                        <Text className="ml-2 text-xs font-bold text-slate-500">12 free</Text>
                                    </View>
                                </View>
                                <View className="bg-slate-900 px-4 py-2 rounded-xl">
                                    <Text className="text-emerald-400 text-[10px] font-bold font-mono uppercase">Next: {route.departures[0]}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View className="h-10" />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
