import { useMutation } from '@tanstack/react-query'
import { convertOldToNew, convertNewToOld } from '@/lib/api'
import type { ConversionMode } from '@/types/address'
import type { AddressInput } from '@/lib/api'

export const useConvert = (mode: ConversionMode) => {
  const convertFn = mode === 'old-to-new' ? convertOldToNew : convertNewToOld

  return useMutation({
    mutationFn: (address: AddressInput) => convertFn(address),
  })
}
