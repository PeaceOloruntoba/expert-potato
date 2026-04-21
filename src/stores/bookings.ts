import { create } from "zustand";
import api from "../utils/api";

export type Booking = {
    id: string;
    user_id: string;
    route_id: string;
    departure_time: string;
    booking_date: string;
    seats: number[];
    status: "confirmed" | "used" | "cancelled";
    payment_status: "pending" | "paid" | "failed";
    total_fare: number;
    created_at: string;
    origin?: string;
    destination?: string;
};

type BookingsState = {
    bookings: Booking[];
    loading: boolean;
    bookedSeats: number[];
    fetchBookedSeats: (routeId: string, departure: string, date: string) => Promise<void>;
    addBooking: (bookingData: any) => Promise<{ booking: Booking; payment: any }>;
    fetchMyBookings: (userId: string) => Promise<void>;
    verifyPayment: (reference: string) => Promise<{ success: boolean; booking: Booking }>;
    cancelBooking: (id: string) => Promise<void>;
};

export const useBookings = create<BookingsState>((set) => ({
    bookings: [],
    loading: false,
    bookedSeats: [],
    
    fetchBookedSeats: async (routeId, departure, date) => {
        try {
            const res = await api.get(`/bookings/seats`, {
                params: { route_id: routeId, departure_time: departure, booking_date: date }
            });
            set({ bookedSeats: res.data.data });
        } catch (err) {
            console.error('Error fetching booked seats:', err);
            set({ bookedSeats: [] });
        }
    },

    addBooking: async (bookingData) => {
        set({ loading: true });
        try {
            const res = await api.post('/bookings', bookingData);
            set({ loading: false });
            return res.data.data;
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    fetchMyBookings: async (userId) => {
        set({ loading: true });
        try {
            const res = await api.get('/bookings');
            set({ bookings: res.data.data, loading: false });
        } catch (err) {
            set({ loading: false });
            console.error('Error fetching bookings:', err);
        }
    },

    verifyPayment: async (reference) => {
        set({ loading: true });
        try {
            const res = await api.get(`/bookings/verify/${reference}`);
            set({ loading: false });
            return res.data.data;
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    cancelBooking: async (id) => {
        set({ loading: true });
        // Implementation for cancel if endpoint exists
        set({ loading: false });
    }
}));
