import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export type Bus = {
    id: string;
    name: string;
    plate_number: string;
    capacity: number;
    model: string;
    year: number;
    status: "active" | "maintenance";
};

type FleetState = {
    buses: Bus[];
    loading: boolean;

    fetchBuses: () => Promise<void>;
    getBusById: (id: string) => Bus | undefined;
};

export const useFleet = create<FleetState>()(
    persist(
        (set, get) => ({
            buses: [],
            loading: false,

            fetchBuses: async () => {
                set({ loading: true });
                try {
                    const res = await api.get("/fleet");
                    set({ buses: res.data.data, loading: false });
                } catch (error: any) {
                    console.error("Failed to fetch fleet:", error);
                }
            },
            getBusById: (id: string) => {
                return get().buses.find(bus => bus.id === id);
            },
        }),
        {
            name: "fleet-storage-mobile",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
