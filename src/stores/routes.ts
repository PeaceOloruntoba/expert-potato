import { create } from "zustand";
import api from "../utils/api";

export type Route = {
    id: string;
    origin: string;
    destination: string;
    duration: string;
    distance: string;
    fare: number;
    departures: string[];
    color: string;
    bus_id: string;
    bus_name?: string;
    bus_plate?: string;
};

type RoutesState = {
    routes: Route[];
    loading: boolean;
    fetchRoutes: () => Promise<void>;
};

export const useRoutes = create<RoutesState>((set) => ({
    routes: [],
    loading: false,
    fetchRoutes: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/routes');
            set({ routes: res.data.data, loading: false });
        } catch (err) {
            set({ loading: false });
            console.error('Error fetching routes:', err);
        }
    },
}));
