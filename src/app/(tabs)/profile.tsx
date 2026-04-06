import { useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { User as UserIcon, LogOut, ChevronRight, Settings, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { useAuth } from '../../stores/auth';
import { useBookings } from '../../stores/bookings';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Button from '../../components/ui/Button';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { bookings } = useBookings();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const stats = useMemo(() => {
        const used = bookings.filter((b) => b.status === 'used').length;
        const active = bookings.filter((b) => b.status === 'confirmed').length;
        const spent = bookings.filter((b) => b.status !== 'cancelled').reduce((acc, b) => acc + b.fare, 0);
        return { used, active, spent };
    }, [bookings]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 pt-12 pb-6 bg-white border-b border-slate-100">
                <Text className="text-2xl font-bold text-slate-900">Profile</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-[40px] p-8 items-center border border-slate-100 mb-8 shadow-sm">
                    <View className="w-24 h-24 bg-emerald-500 rounded-[32px] items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                        <Text className="text-white font-bold text-4xl">{user?.name[0] || 'U'}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-slate-900 mb-1">{user?.name || 'User'}</Text>
                    <Text className="text-slate-400 font-medium mb-2">{user?.email || 'email@uniph.edu.ng'}</Text>
                    {user?.matric && (
                        <View className="bg-slate-900 px-4 py-1.5 rounded-full">
                            <Text className="text-emerald-400 font-mono text-[10px] font-bold">{user.matric}</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row gap-4 mb-8">
                    {[
                        { label: 'Trips', value: stats.used, color: 'text-blue-500' },
                        { label: 'Active', value: stats.active, color: 'text-emerald-500' },
                        { label: 'Spent', value: `₦${stats.spent}`, color: 'text-amber-500' },
                    ].map(item => (
                        <View key={item.label} className="flex-1 bg-white p-5 rounded-[28px] items-center border border-slate-100 shadow-sm">
                            <Text className={`text-xl font-bold ${item.color}`}>{item.value}</Text>
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</Text>
                        </View>
                    ))}
                </View>

                <View className="bg-white rounded-[32px] p-2 border border-slate-100 mb-8 shadow-sm overflow-hidden">
                    {[
                        { label: 'Personal Information', icon: UserIcon },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Security & Password', icon: Shield },
                        { label: 'Help & Support', icon: HelpCircle },
                    ].map((item, index) => (
                        <TouchableOpacity 
                            key={item.label} 
                            className={`flex-row items-center justify-between p-4 ${index !== 3 ? 'border-b border-slate-50' : ''}`}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-4">
                                    <item.icon size={20} color="#64748b" />
                                </View>
                                <Text className="text-slate-700 font-semibold">{item.label}</Text>
                            </View>
                            <ChevronRight size={18} color="#cbd5e1" />
                        </TouchableOpacity>
                    ))}
                </View>

                <Button 
                    variant="secondary" 
                    onPress={() => setIsLogoutConfirmOpen(true)} 
                    icon={<LogOut size={20} color="#ef4444" />}
                    className="h-16 rounded-2xl bg-red-50 border border-red-100 mb-10"
                >
                    <Text className="text-red-500 font-bold">Sign Out</Text>
                </Button>
                
                <View className="h-10" />
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
