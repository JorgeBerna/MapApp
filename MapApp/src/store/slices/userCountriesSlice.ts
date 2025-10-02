import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getDatabase, ref, get, set, update, remove } from 'firebase/database';
import { app } from '../../DataBase/dbconfig';
import type { 
  UserCountryData, 
  UserCountriesState, 
  CreateUserCountryDataDto, 
  UpdateUserCountryDataDto 
} from '../../Types/UserCountryData';

// Estado inicial
const initialState: UserCountriesState = {
  countries: {},
  selectedCountry: null,
  loading: false,
  error: null,
};

// Funciones auxiliares
const calculateGeneralRating = (ratings: { note: number; food: number; culture: number; price: number }): number => {
  // Convertir price de 1-5 billetes a 1-5 estrellas (inversamente)
  const priceAsStars = 6 - ratings.price;
  return (ratings.note + ratings.food + ratings.culture + priceAsStars) / 4;
};

// Thunks asíncronos para Firebase
export const fetchUserCountryData = createAsyncThunk<
  Record<string, UserCountryData>,
  string,
  { rejectValue: string }
>(
  'userCountries/fetchUserCountryData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const db = getDatabase(app);
      const userCountriesRef = ref(db, `userCountries/${userId}`);
      const snapshot = await get(userCountriesRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Record<string, UserCountryData>;
      }
      return {};
    } catch (error) {
      console.error('Error fetching user country data:', error);
      return rejectWithValue('Error obteniendo datos de países del usuario');
    }
  }
);

export const createUserCountryData = createAsyncThunk<
  UserCountryData,
  { userId: string; data: CreateUserCountryDataDto },
  { rejectValue: string }
>(
  'userCountries/createUserCountryData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const db = getDatabase(app);
      const now = new Date().toISOString();
      
      const userCountryData: UserCountryData = {
        ...data,
        userId,
        generalRating: calculateGeneralRating(data.ratings),
        createdAt: now,
        updatedAt: now,
      };

      const countryRef = ref(db, `userCountries/${userId}/${data.countryCode}`);
      await set(countryRef, userCountryData);
      
      return userCountryData;
    } catch (error) {
      console.error('Error creating user country data:', error);
      return rejectWithValue('Error creando datos del país');
    }
  }
);

export const updateUserCountryData = createAsyncThunk<
  UserCountryData,
  { userId: string; data: UpdateUserCountryDataDto },
  { rejectValue: string }
>(
  'userCountries/updateUserCountryData',
  async ({ userId, data }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { userCountries: UserCountriesState };
      const existingData = state.userCountries.countries[data.countryCode];
      
      if (!existingData) {
        return rejectWithValue('Datos del país no encontrados');
      }

      const db = getDatabase(app);
      const now = new Date().toISOString();
      
      // Merge de ratings si se proporcionan
      const updatedRatings = data.ratings 
        ? { ...existingData.ratings, ...data.ratings }
        : existingData.ratings;

      const updatedGeneralRating = data.generalRating !== undefined 
        ? data.generalRating 
        : calculateGeneralRating(updatedRatings);

      const updatedData: Partial<UserCountryData> = {
        ...data,
        ratings: updatedRatings,
        generalRating: updatedGeneralRating,
        updatedAt: now,
      };

      const countryRef = ref(db, `userCountries/${userId}/${data.countryCode}`);
      await update(countryRef, updatedData);
      
      return { ...existingData, ...updatedData } as UserCountryData;
    } catch (error) {
      console.error('Error updating user country data:', error);
      return rejectWithValue('Error actualizando datos del país');
    }
  }
);

export const removeUserCountryData = createAsyncThunk<
  string,
  { userId: string; countryCode: string },
  { rejectValue: string }
>(
  'userCountries/removeUserCountryData',
  async ({ userId, countryCode }, { rejectWithValue }) => {
    try {
      const db = getDatabase(app);
      const countryRef = ref(db, `userCountries/${userId}/${countryCode}`);
      await remove(countryRef);
      
      return countryCode;
    } catch (error) {
      console.error('Error removing user country data:', error);
      return rejectWithValue('Error eliminando datos del país');
    }
  }
);

// Slice
const userCountriesSlice = createSlice({
  name: 'userCountries',
  initialState,
  reducers: {
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user country data
    builder
      .addCase(fetchUserCountryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCountryData.fulfilled, (state, action: PayloadAction<Record<string, UserCountryData>>) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchUserCountryData.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });

    // Create user country data
    builder
      .addCase(createUserCountryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserCountryData.fulfilled, (state, action: PayloadAction<UserCountryData>) => {
        state.loading = false;
        state.countries[action.payload.countryCode] = action.payload;
      })
      .addCase(createUserCountryData.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });

    // Update user country data
    builder
      .addCase(updateUserCountryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserCountryData.fulfilled, (state, action: PayloadAction<UserCountryData>) => {
        state.loading = false;
        state.countries[action.payload.countryCode] = action.payload;
      })
      .addCase(updateUserCountryData.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });

    // Remove user country data
    builder
      .addCase(removeUserCountryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserCountryData.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        delete state.countries[action.payload];
        if (state.selectedCountry === action.payload) {
          state.selectedCountry = null;
        }
      })
      .addCase(removeUserCountryData.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });
  },
});

export const { setSelectedCountry, clearError } = userCountriesSlice.actions;
export default userCountriesSlice.reducer;