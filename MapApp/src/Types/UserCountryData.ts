export interface UserCountryData {
  countryCode: string; 
  userId: string;
  ratings: {
    note: number; 
    food: number; 
    culture: number; 
    price: number; 
  };
  generalRating: number; 
  comments: string; 
  createdAt: string; 
  updatedAt: string; 
}

// Estado del slice de países del usuario
export interface UserCountriesState {
  countries: Record<string, UserCountryData>; 
  selectedCountry: string | null; 
  loading: boolean;
  error: string | null;
}

// DTOs para Firebase
export interface CreateUserCountryDataDto {
  countryCode: string;
  ratings: {
    note: number;
    food: number;
    culture: number;
    price: number;
  };
  generalRating: number;
  comments: string;
}

export interface UpdateUserCountryDataDto {
  countryCode: string;
  ratings?: {
    note?: number;
    food?: number;
    culture?: number;
    price?: number;
  };
  generalRating?: number;
  comments?: string;
}

export interface MapCountryData {
  countryCode: string;
  hasUserData: boolean;
  generalRating?: number;
  isSelected: boolean;
}