import React, { useContext, useEffect, useState, useMemo } from "react";
import { FormattedMessage } from 'react-intl';
import { AuthContext } from "../../Contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchUserCountryData,
  setSelectedCountry,
} from "../../store/slices/userCountriesSlice";
import { countriesService } from "../../Services/CountriesService";
import { WorldMap, CountrySearch, CountryCard } from "../../components/Map";
import type { Country } from "../../Types/Country";

const Map: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useAppDispatch();

  const loading = useAppSelector(
    (state) => (state as any).userCountries.loading
  );
  const error = useAppSelector((state) => (state as any).userCountries.error);

  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserCountryData(user.uid));
    }
  }, [user, dispatch]);

  // Cargar lista de países para el buscador
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const fields = ["name", "cca2", "cca3", "flags", "capital", "region"];
        const data = await countriesService.getAllCountries(fields);
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const handleCountrySelect = (country: Country) => {
    dispatch(setSelectedCountry(country.cca3));
  };

  const handleMapCountryClick = (countryCode: string) => {
    dispatch(setSelectedCountry(countryCode));
  };

  // Redux user countries map
  const userCountries = useAppSelector(
    (state) => (state as any).userCountries.countries
  );

  type FilterType = "all" | "rated" | "unrated";
  const [filter] = useState<FilterType>("all");

  const filteredCount = useMemo(() => {
    if (!countries || countries.length === 0) return 0;
    switch (filter) {
      case "rated":
        return countries.filter((c) => userCountries && userCountries[c.cca3])
          .length;
      case "unrated":
        return countries.filter(
          (c) => !(userCountries && userCountries[c.cca3])
        ).length;
      default:
        return countries.length;
    }
  }, [countries, userCountries, filter]);

  const stats = useMemo(() => {
    const total = countries.length;
    const rated = countries.filter(
      (c) => userCountries && userCountries[c.cca3]
    ).length;
    const unrated = total - rated;
    return { total, rated, unrated };
  }, [countries, userCountries]);

  if (loading && loadingCountries) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">
            <FormattedMessage id="map.loading" defaultMessage="Cargando Mapa Interactivo" />
          </h1>
          <p className="text-lg opacity-90">
            <FormattedMessage id="user.welcome" defaultMessage="Bienvenido" />, {user?.email}
          </p>
          <p className="text-sm opacity-70">
            <FormattedMessage id="map.loadingDescription" defaultMessage="Preparando tu experiencia de viajes..." />
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            <FormattedMessage id="map.loadError" defaultMessage="Error al cargar" />
          </h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() =>
              user?.uid && dispatch(fetchUserCountryData(user.uid))
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <FormattedMessage id="countries.retry" defaultMessage="Reintentar" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                <FormattedMessage id="map.interactive" defaultMessage="Mapa Interactivo" />
              </h1>
              <p className="text-white/80 text-sm">
                <FormattedMessage id="map.interactiveDescription" defaultMessage="Gestiona tus países visitados y por visitar" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col h-full min-h-0">
        {/* Parte superior */}
        <div className="flex-1 p-4 min-h-[300px]">
          <div className="h-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden min-h-0 flex items-center justify-center">
            <div className="w-full max-w-6xl h-full">
              <WorldMap onCountryClick={handleMapCountryClick} />
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="flex-[0.9] p-4 pt-0 min-h-[220px]">
          <div className="h-full flex flex-col md:flex-row gap-4 min-h-0">
            {/* Lado izquierdo */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 relative z-10 min-h-0">
              {/* Buscador */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 relative z-20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  <FormattedMessage id="map.searchCountry" defaultMessage="Buscar País" />
                </h3>
                {!loadingCountries && (
                  <CountrySearch
                    countries={countries}
                    onCountrySelect={handleCountrySelect}
                    placeholder="Buscar por nombre, código o capital..."
                  />
                )}
                {loadingCountries && (
                  <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
                )}
              </div>

              {/* Contador de países y filtros */}
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    <FormattedMessage id="countries.count" defaultMessage="Países ({count})" values={{ count: filteredCount }} />
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-sm">
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-2 text-center">
                      <div className="text-blue-300 font-medium">
                        {stats.total}
                      </div>
                      <div className="text-blue-200 text-xs">
                        <FormattedMessage id="map.total" defaultMessage="Total" />
                      </div>
                    </div>
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-center">
                      <div className="text-green-300 font-medium">
                        {stats.rated}
                      </div>
                      <div className="text-green-200 text-xs">
                        <FormattedMessage id="map.rated" defaultMessage="Valorados" />
                      </div>
                    </div>
                    <div className="bg-gray-500/20 border border-gray-400/30 rounded-lg p-2 text-center">
                      <div className="text-gray-300 font-medium">
                        {stats.unrated}
                      </div>
                      <div className="text-gray-200 text-xs">
                        <FormattedMessage id="map.unrated" defaultMessage="Sin valorar" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado derecho */}
            <div className="md:flex-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden min-h-0">
              <div className="h-full min-h-0 overflow-auto">
                <CountryCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
