import { create } from "zustand";

export type User = {
    id: string;
    name: string;
    email: string;
    matric?: string;
    role: "student" | "admin";
};

type AuthState = {
    user: User | null;
    loading: boolean;
    login: (role: "student" | "admin") => Promise<void>;
    logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
    user: null,
    loading: false,

    login: async (role) => {
        set({ loading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const mockUser: User = role === "admin"
            ? { id: "ADM001", name: "Dr. Amara Obi", role: "admin", email: "admin@uniph.edu.ng" }
            : { id: "STU001", name: "Chidi Nwosu", role: "student", email: "chidi@uniph.edu.ng", matric: "CSC/2021/042" };
        
        set({ user: mockUser, loading: false });
    },

    logout: () => set({ user: null }),
}));
