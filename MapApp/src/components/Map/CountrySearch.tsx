import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedCountry } from '../../store/slices/userCountriesSlice';
import { PqoqubbwIcon } from '../Icons';
import type { Country } from '../../Types/Country';

interface CountrySearchProps {
  countries: Country[];
  onCountrySelect?: (country: Country) => void;
  placeholder?: string;
  className?: string;
}

const CountrySearch: React.FC<CountrySearchProps> = ({
  countries,
  onCountrySelect,
  placeholder = "",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Filtrar países basado en el término de búsqueda
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const search = searchTerm.toLowerCase();
    return countries
      .filter(country => 
        country.name.common.toLowerCase().includes(search) ||
        country.name.official.toLowerCase().includes(search) ||
        country.cca2.toLowerCase().includes(search) ||
        country.cca3.toLowerCase().includes(search) ||
        country.capital?.[0]?.toLowerCase().includes(search)
      )
      .slice(0, 10); // Limitar a 10 resultados
  }, [countries, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleCountrySelect = (country: Country) => {
    setSearchTerm(country.name.common);
    setIsOpen(false);
    
    // Actualizar Redux
    dispatch(setSelectedCountry(country.cca3));
    
    // Callback opcional
    onCountrySelect?.(country);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    dispatch(setSelectedCountry(null));
  };

  const handleBlur = () => {
    // Delay para permitir clicks en la lista
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleFocus = () => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PqoqubbwIcon name="search" className="h-5 w-5 text-gray-400" animate={false} />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/60 backdrop-blur-sm transition-all duration-200"
          placeholder={placeholder || "Buscar país..."}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-white transition-colors"
          >
            <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Lista desplegable de resultados */}
      {isOpen && filteredCountries.length > 0 && (
        <div className="absolute z-[60] mt-1 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country.cca3}
              onClick={() => handleCountrySelect(country)}
              className="w-full text-left p-3 hover:bg-white/10 transition-colors duration-150 flex items-center space-x-3 border-b border-white/10 last:border-b-0"
            >
              {/* Bandera */}
              <div className="flex-shrink-0">
                <img
                  src={country.flags.png}
                  alt={country.flags.alt || `Bandera de ${country.name.common}`}
                  className="w-6 h-4 object-cover rounded border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05IDVIMTJWMTFIOVY1WiIgZmlsbD0iI0QxRDVEOSIvPgo8cGF0aCBkPSJNMTMgNUgxNVYxMUgxM1Y1WiIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4K';
                  }}
                />
              </div>

              {/* Información del país */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {country.name.common}
                </div>
                <div className="text-sm text-white/70 truncate">
                  {country.cca3} • {country.capital?.[0] || <FormattedMessage id="countries.notAvailable" defaultMessage="Sin capital" />}
                </div>
              </div>

              {/* Indicador de región */}
              <div className="flex-shrink-0">
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                  {country.region}
                </span>
              </div>
            </button>
          ))}
          
          {/* Mensaje si hay más resultados */}
          {countries.filter(country => {
            const search = searchTerm.toLowerCase();
            return country.name.common.toLowerCase().includes(search) ||
                   country.name.official.toLowerCase().includes(search) ||
                   country.cca2.toLowerCase().includes(search) ||
                   country.cca3.toLowerCase().includes(search) ||
                   country.capital?.[0]?.toLowerCase().includes(search);
          }).length > 10 && (
            <div className="p-3 text-center text-white/60 text-sm border-t border-white/10">
              <FormattedMessage 
                id="search.moreResults" 
                defaultMessage="Y {count} países más..."
                values={{ 
                  count: countries.filter(country => {
                    const search = searchTerm.toLowerCase();
                    return country.name.common.toLowerCase().includes(search) ||
                           country.name.official.toLowerCase().includes(search) ||
                           country.cca2.toLowerCase().includes(search) ||
                           country.cca3.toLowerCase().includes(search) ||
                           country.capital?.[0]?.toLowerCase().includes(search);
                  }).length - 10 
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && searchTerm.length > 0 && filteredCountries.length === 0 && (
        <div className="absolute z-[60] mt-1 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl p-4 text-center">
          <div className="text-white/60">
            <PqoqubbwIcon name="search" className="w-8 h-8 mx-auto mb-2 text-white/40" animate={false} />
            <p><FormattedMessage id="search.noResults" defaultMessage="No se encontraron países" /></p>
            <p className="text-sm mt-1">
              <FormattedMessage id="search.noResultsDescription" defaultMessage="Intenta con otro término de búsqueda" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySearch;