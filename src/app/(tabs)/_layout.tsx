import { Tabs } from "expo-router";
import { Bus, Ticket, User } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";
import { useBookings } from "../../stores/bookings";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
    const { bookings } = useBookings();
    const activeCount = bookings.filter(b => b.status === 'confirmed').length;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.slate400,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <Bus size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.slate400 }]}>Routes</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="tickets"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItemRelative}>
                            <Ticket size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            {activeCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{activeCount}</Text>
                                </View>
                            )}
                            <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.slate400 }]}>Tickets</Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.tabItem}>
                            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.slate400 }]}>Profile</Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        height: 90,
        paddingTop: 10,
        paddingBottom: 30,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabItem: {
        alignItems: 'center',
    },
    tabItemRelative: {
        alignItems: 'center',
        position: 'relative',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: Colors.red500,
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 8,
        fontWeight: '700',
    },
});
