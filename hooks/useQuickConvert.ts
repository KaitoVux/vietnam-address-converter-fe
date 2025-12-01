import { useMutation } from '@tanstack/react-query'
import { quickConvertOldToNew, quickConvertNewToOld } from '@/lib/api'
import type { ConversionMode } from '@/types/address'
import type { FullAddressInput } from '@/lib/api'

export const useQuickConvert = (mode: ConversionMode) => {
  const convertFn = mode === 'old-to-new' ? quickConvertOldToNew : quickConvertNewToOld

  return useMutation({
    mutationFn: (input: FullAddressInput) => convertFn(input),
  })
}
