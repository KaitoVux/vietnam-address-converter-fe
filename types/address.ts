export interface Province {
  code: string
  name: string
  name_en?: string
  full_name?: string
  full_name_en?: string
  latitude?: number
  longitude?: number
}

export interface District {
  code: string
  name: string
  name_en?: string
  full_name?: string
  full_name_en?: string
  province_code?: string
  latitude?: number
  longitude?: number
}

export interface Ward {
  code: string
  name: string
  name_en?: string
  full_name?: string
  full_name_en?: string
  district_code?: string
  latitude?: number
  longitude?: number
}

export type ConversionMode = 'old-to-new' | 'new-to-old'
