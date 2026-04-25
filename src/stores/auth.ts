import { create } from "zustand";
import api from "../utils/api";

export type User = {
    id: string;
    name: string;
    email: string;
    matric?: string;
    role: "student" | "admin";
};

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: any) => Promise<{ verified: boolean; user_id?: string }>;
    signup: (data: any) => Promise<{ user_id: string; email: string }>;
    verifyOTP: (data: any) => Promise<void>;
    resendOTP: (userId: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<{ user_id: string }>;
    resetPassword: (data: any) => Promise<void>;
    logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,

    login: async (data) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/login', data);
            const { user, token, verified, user_id } = res.data.data;
            
            if (verified) {
                set({ user, token, loading: false });
            } else {
                set({ loading: false });
            }
            return { verified, user_id };
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    signup: async (data) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/signup', {
                ...data,
                phone: data.phone || '0000000000', // Default if not provided
                terms_accepted: true
            });
            set({ loading: false });
            return res.data.data; // Return user_id and email
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    verifyOTP: async (data) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/verify-otp', {
                user_id: data.user_id,
                code: data.otp
            });
            const { user, token } = res.data.data;
            set({ user, token, loading: false });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    resendOTP: async (userId) => {
        set({ loading: true });
        try {
            await api.post('/auth/resend-otp', { user_id: userId });
            set({ loading: false });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    forgotPassword: async (email) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/forgot-password', { email });
            set({ loading: false });
            return res.data.data; // Return user_id
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    resetPassword: async (data) => {
        set({ loading: true });
        try {
            await api.post('/auth/reset-password', {
                user_id: data.user_id,
                code: data.otp,
                password: data.password
            });
            set({ loading: false });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    logout: () => set({ user: null, token: null }),
}));
