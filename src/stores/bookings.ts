import { create } from "zustand";

export type Booking = {
    id: string;
    userId: string;
    routeId: string;
    departure: string;
    date: string;
    seats: number[];
    status: "confirmed" | "used" | "cancelled";
    fare: number;
    timestamp: string;
};

type BookingsState = {
    bookings: Booking[];
    loading: boolean;
    addBooking: (booking: Omit<Booking, "id">) => Promise<void>;
    fetchMyBookings: (userId: string) => Promise<void>;
    cancelBooking: (id: string) => Promise<void>;
};

export const useBookings = create<BookingsState>((set) => ({
    bookings: [],
    loading: false,
    
    addBooking: async (booking) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newBooking = { ...booking, id: `TKT-${Math.floor(1000 + Math.random() * 9000)}` };
        set((state) => ({ bookings: [newBooking, ...state.bookings], loading: false }));
    },

    fetchMyBookings: async (userId) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // In a real app, we'd filter by userId on the server
        set({ loading: false });
    },

    cancelBooking: async (id) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set((state) => ({
            bookings: state.bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b),
            loading: false
        }));
    }
}));
