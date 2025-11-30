import { useQuery } from '@tanstack/react-query'
import { fetchDistricts } from '@/lib/api'
import type { ConversionMode } from '@/types/address'

export const useDistricts = (
  provinceCode: string | null,
  mode: ConversionMode
) => {
  const version = mode === 'old-to-new' ? 'v1' : 'v2'

  return useQuery({
    queryKey: ['districts', provinceCode, version],
    queryFn: () => fetchDistricts(provinceCode!, version),
    enabled: !!provinceCode,
  })
}
