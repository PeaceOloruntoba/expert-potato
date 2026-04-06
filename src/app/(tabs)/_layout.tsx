import { Tabs } from "expo-router";
import { Bus, Ticket, User } from "lucide-react-native";
import { View, Text } from "react-native";
import { useBookings } from "../../stores/bookings";

export default function TabLayout() {
    const { bookings } = useBookings();
    const activeCount = bookings.filter(b => b.status === 'confirmed').length;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#f1f5f9',
                    height: 90,
                    paddingTop: 10,
                    paddingBottom: 30,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#10b981',
                tabBarInactiveTintColor: '#94a3b8',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <Bus size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            <Text className={`text-[10px] mt-1 font-bold ${focused ? 'text-emerald-500' : 'text-slate-400'}`}>Routes</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="tickets"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center relative">
                            <Ticket size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            {activeCount > 0 && (
                                <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                                    <Text className="text-white text-[8px] font-bold">{activeCount}</Text>
                                </View>
                            )}
                            <Text className={`text-[10px] mt-1 font-bold ${focused ? 'text-emerald-500' : 'text-slate-400'}`}>Tickets</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            <Text className={`text-[10px] mt-1 font-bold ${focused ? 'text-emerald-500' : 'text-slate-400'}`}>Profile</Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
