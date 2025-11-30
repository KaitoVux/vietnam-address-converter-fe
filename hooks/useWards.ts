import { useQuery } from "@tanstack/react-query";
import { fetchWards } from "@/lib/api";
import type { ConversionMode } from "@/types/address";

export const useWards = (districtCode: string | null, mode: ConversionMode, provinceCode?: string | null) => {
    const version = mode === "old-to-new" ? "v1" : "v2";

    // For v2, we need provinceCode instead of districtCode
    const code = version === "v2" ? provinceCode : districtCode;

    return useQuery({
        queryKey: ["wards", code, version],
        queryFn: () => fetchWards(code!, version),
        enabled: !!code,
    });
};
