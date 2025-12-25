import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add error interceptor for better error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.detail ||
        error.response.data?.message ||
        "Server error occurred";
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn."
      );
    } else {
      // Something else went wrong
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

// Provinces Open API endpoints
const PROVINCES_API_V1 = "https://provinces.open-api.vn/api/v1";
const PROVINCES_API_V2 = "https://provinces.open-api.vn/api/v2";

export interface AddressInput {
  province: string;
  district: string;
  ward: string;
  street?: string;
}

export interface FullAddressInput {
  address: string;
}

export interface ConversionResponse {
  success: boolean;
  old_address: string | null;
  new_address: string | null;
  message: string | null;
}

// Fetch provinces based on version (old or new)
export const fetchProvinces = async (version: "v1" | "v2") => {
  try {
    const url =
      version === "v1" ? `${PROVINCES_API_V1}/p` : `${PROVINCES_API_V2}/p`;
    const response = await axios.get(url);

    if (version === "v1") {
      return response.data;
    } else {
      // V2 returns array directly
      return response.data;
    }
  } catch (error: any) {
    throw new Error(
      `Failed to load provinces: ${error.message || "Network error"}`
    );
  }
};

// Fetch districts for a province
export const fetchDistricts = async (
  provinceCode: string,
  version: "v1" | "v2"
) => {
  if (version === "v2") {
    // V2 has no districts, return empty array
    return [];
  }

  try {
    const url = `${PROVINCES_API_V1}/p/${provinceCode}?depth=2`;
    const response = await axios.get(url);
    return response.data.districts || [];
  } catch (error: any) {
    throw new Error(
      `Failed to load districts: ${error.message || "Network error"}`
    );
  }
};

// Fetch wards for a district (v1) or province (v2)
// Note: For v2, we pass provinceCode as the first argument
export const fetchWards = async (code: string, version: "v1" | "v2") => {
  try {
    if (version === "v1") {
      // v1: code is districtCode
      const url = `${PROVINCES_API_V1}/d/${code}?depth=2`;
      const response = await axios.get(url);
      return response.data.wards || [];
    } else {
      // v2: code is provinceCode
      // We fetch province with depth=2 to get wards (as seen in API probing)
      const url = `${PROVINCES_API_V2}/p/${code}?depth=2`;
      const response = await axios.get(url);
      return response.data.wards || [];
    }
  } catch (error: any) {
    throw new Error(
      `Failed to load wards: ${error.message || "Network error"}`
    );
  }
};

// Convert old to new
export const convertOldToNew = async (
  address: AddressInput
): Promise<ConversionResponse> => {
  const response = await apiClient.post("/api/convert/old-to-new", address);
  return response.data;
};

// Convert new to old
export const convertNewToOld = async (
  address: AddressInput
): Promise<ConversionResponse> => {
  const response = await apiClient.post("/api/convert/new-to-old", address);
  return response.data;
};

// Quick convert old to new (full address)
export const quickConvertOldToNew = async (
  input: FullAddressInput
): Promise<ConversionResponse> => {
  const response = await apiClient.post("/api/convert/quick/old-to-new", input);
  return response.data;
};

// Quick convert new to old (full address)
export const quickConvertNewToOld = async (
  input: FullAddressInput
): Promise<ConversionResponse> => {
  const response = await apiClient.post("/api/convert/quick/new-to-old", input);
  return response.data;
};
