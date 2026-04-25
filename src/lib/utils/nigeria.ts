import { useState, useEffect } from 'react';
import axios from 'axios';

const nigeriaApi = axios.create({
    baseURL: 'https://nigeria-states-free-api.vercel.app/api',
    timeout: 10000,
});

interface NigeriaState {
    state: string;
    lgas: string[];
}

export const useNigeriaData = () => {
    const [allData, setAllData] = useState<NigeriaState[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await nigeriaApi.get('/all');
                setAllData(response.data.data);

                const stateList = response.data.data.map((item: { state: any; }) => item.state);
                setStates(stateList);
            } catch (error) {
                console.error("Error fetching Nigeria data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const getLgasByState = (stateName: any) => {
        const stateObj = allData.find(s => s.state === stateName);
        return stateObj ? stateObj.lgas : [];
    };

    return { states, getLgasByState, loading };
};
