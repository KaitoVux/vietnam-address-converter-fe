import { useQuery } from "@tanstack/react-query";
import { fetchProvinces } from "@/lib/api";
import type { ConversionMode } from "@/types/address";

export const useProvinces = (mode: ConversionMode) => {
    const version = mode === "old-to-new" ? "v1" : "v2";

    const result = useQuery({
        queryKey: ["provinces", version],
        queryFn: async () => {
            const data = await fetchProvinces(version);
            return data;
        },
    });

    return result;
};
