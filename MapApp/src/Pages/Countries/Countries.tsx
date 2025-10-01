import React, { useState, useCallback } from 'react';
import CountryList from './CountryList';
import CountryDetail from './CountryDetail';
import type { Country } from '../../Types/Country';

const Countries: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const handleCountrySelect = useCallback(async (country: Country) => {
        // Mismo pais
        if (selectedCountry?.cca3 === country.cca3) {
            return;
        }

        setIsDetailLoading(true);

        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 300));

        setSelectedCountry(country);
        setIsDetailLoading(false);
    }, [selectedCountry]);

    return (
        <div className="h-full">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">Países del Mundo</h1>
                    <p className="text-white/80 mt-1">
                        Explora información detallada de todos los países
                    </p>
                </div>
            </div>

            <div className="flex h-[calc(100vh-120px)] gap-4 p-4">
                {/* Panel izquierdo */}
                <div className="w-1/3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg flex flex-col">
                    <CountryList
                        onCountrySelect={handleCountrySelect}
                        selectedCountryCode={selectedCountry?.cca3}
                    />
                </div>

                {/* Panel derecho */}
                <div className="flex-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg flex flex-col">
                    <CountryDetail
                        country={selectedCountry}
                        loading={isDetailLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Countries;
