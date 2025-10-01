import React, { useState, useEffect, useMemo } from 'react';
import { countriesService } from '../../Services/CountriesService';
import type { Country } from '../../Types/Country';
import { PqoqubbwIcon } from '../../components/Icons';

interface CountryListProps {
    onCountrySelect: (country: Country) => void;
    selectedCountryCode?: string;
}

const CountryList: React.FC<CountryListProps> = ({
    onCountrySelect,
    selectedCountryCode
}) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            setLoading(true);
            setError(null);

            const fields = [
                'name', 'cca2', 'cca3', 'flags', 'capital',
                'population', 'region', 'currencies', 'languages'
            ];

            const data = await countriesService.getAllCountries(fields);
            setCountries(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar países');
            console.error('Error cargando países:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = useMemo(() => {
        return countriesService.filterCountriesByName(countries, searchTerm);
    }, [countries, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCountryClick = (country: Country) => {
        onCountrySelect(country);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <div className="h-10 bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="flex-1 p-4 space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 animate-pulse">
                            <div className="w-8 h-6 bg-white/10 rounded"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-white/10 rounded mb-1"></div>
                                <div className="h-3 bg-white/10 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Países</h2>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Error al cargar países</h3>
                        <p className="text-white/70 mb-4">{error}</p>
                        <button
                            onClick={loadCountries}
                            className="px-4 py-2 bg-blue-500/20 text-white border border-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors backdrop-blur-sm"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">

            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white mb-3">
                    Países ({filteredCountries.length})
                </h2>

                {/* Buscador */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PqoqubbwIcon name="search" className="h-5 w-5 text-gray-400" animate={false} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-white placeholder-white/60 backdrop-blur-sm"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <svg className="h-5 w-5 text-white/60 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Lista de países */}
            <div className="flex-1 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No se encontraron países</h3>
                        <p className="text-white/70">
                            {searchTerm
                                ? `No hay países que coincidan con "${searchTerm}"`
                                : 'No hay países disponibles'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.cca3}
                                onClick={() => handleCountryClick(country)}
                                className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 hover:bg-white/10 hover:shadow-sm ${selectedCountryCode === country.cca3
                                        ? 'bg-blue-500/20 border-2 border-blue-400 shadow-md'
                                        : 'bg-white/5 border border-white/20 hover:border-blue-400'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Bandera */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={country.flags.png}
                                            alt={country.flags.alt || `Bandera de ${country.name.common}`}
                                            className="w-8 h-6 object-cover rounded border border-gray-200"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMiAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4SDE2VjE2SDEyVjhaIiBmaWxsPSIjRDFENUQ5Ii8+CjxwYXRoIGQ9Ik0xOCA4SDIwVjE2SDE4VjhaIiBmaWxsPSIjRDFENUQ5Ii8+Cjwvc3ZnPgo=';
                                            }}
                                        />
                                    </div>

                                    {/* Información del país */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white truncate">
                                            {country.name.common}
                                        </div>
                                        <div className="text-sm text-white/70 truncate">
                                            {country.cca3} • {country.capital?.[0] || 'Sin capital'}
                                        </div>
                                    </div>

                                    {/* Selección */}
                                    {selectedCountryCode === country.cca3 && (
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountryList;
