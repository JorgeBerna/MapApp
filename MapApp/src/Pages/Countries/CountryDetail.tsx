import React from 'react';
import { FormattedMessage } from 'react-intl';
import { countriesService } from '../../Services/CountriesService';
import type { Country } from '../../Types/Country';
import { PqoqubbwIcon } from '../../components/Icons';

interface CountryDetailProps {
    country: Country | null;
    loading?: boolean;
}

const CountryDetail: React.FC<CountryDetailProps> = ({ country, loading = false }) => {
    if (loading) {
        return (
            <div className="h-full">
                {/* Header skeleton */}
                <div className="p-6 border-b border-white/10">
                    <div className="h-8 bg-white/10 rounded w-1/2 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse"></div>
                </div>

                {/* Flag skeleton */}
                <div className="p-6 border-b border-white/10">
                    <div className="w-full h-48 bg-white/10 rounded-lg animate-pulse"></div>
                </div>

                {/* Details skeleton */}
                <div className="p-6 space-y-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-white/10 rounded w-1/4 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!country) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        <FormattedMessage id="countries.selectCountry" defaultMessage="Selecciona un país" />
                    </h3>
                    <p className="text-white/70">
                        <FormattedMessage id="countries.selectDescription" defaultMessage="Haz clic en un país de la lista para ver su información detallada" />
                    </p>
                </div>
            </div>
        );
    }

    const InfoField: React.FC<{ label: React.ReactNode; value: React.ReactNode; icon?: React.ReactNode }> = ({
        label,
        value,
        icon
    }) => (
        <div className="space-y-1">
            <div className="flex items-center space-x-2">
                {icon}
                <span className="text-sm font-medium text-white/80">{label}</span>
            </div>
            <p className="text-white font-medium pl-6">{value}</p>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-white mb-2">
                    {country.name.common}
                </h1>
                <p className="text-white/80">
                    {country.name.official}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-400/30">
                        {country.cca3}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-400/30">
                        {country.region}
                    </span>
                    {country.subregion && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-400/30">
                            {country.subregion}
                        </span>
                    )}
                </div>
            </div>

            {/* Bandera */}
            <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <PqoqubbwIcon name="flag" className="w-5 h-5 mr-2 text-white/80" />
                    <FormattedMessage id="countries.flag" defaultMessage="Bandera" />
                </h2>
                <div className="relative bg-white/5 rounded-lg overflow-hidden border border-white/20">
                    {country.flags && (country.flags.svg || country.flags.png) ? (
                        <img
                            src={country.flags.svg || country.flags.png}
                            alt={country.flags.alt || `Bandera de ${country.name.common}`}
                            className="w-full h-48 object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (country.flags.png && target.src !== country.flags.png) {
                                    target.src = country.flags.png;
                                } else {
                                    // Fallback
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTYwVjE2MEgxMjBWODBaIiBmaWxsPSIjRDFENUQ5Ii8+CjxwYXRoIGQ9Ik0xODAgODBIMjAwVjE2MEgxODBWODBaIiBmaWxsPSIjRDFENUQ5Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRDFENUQ5IiBmb250LXNpemU9IjE0Ij5TaW4gYmFuZGVyYTwvdGV4dD4KPC9zdmc+';
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-white/5">
                            <div className="text-center text-white/60">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">Bandera no disponible</p>
                            </div>
                        </div>
                    )}
                </div>
                {country.flags?.alt && (
                    <p className="text-sm text-white/60 mt-2 italic">{country.flags.alt}</p>
                )}
            </div>

            {/* Información general */}
            <div className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center border-b border-white/20 pb-2">
                    <PqoqubbwIcon name="info" className="w-5 h-5 mr-2 text-white/80" />
                    <FormattedMessage id="countries.generalInfo" defaultMessage="Información General" />
                </h2>

                <div className="grid grid-cols-1 gap-6">
                    <InfoField
                        label={<FormattedMessage id="countries.commonName" defaultMessage="Nombre Común" />}
                        value={country.name.common}
                        icon={<PqoqubbwIcon name="tag" className="w-4 h-4 text-blue-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.officialName" defaultMessage="Nombre Oficial" />}
                        value={country.name.official}
                        icon={<PqoqubbwIcon name="globe" className="w-4 h-4 text-green-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.code" defaultMessage="Código" />}
                        value={`${country.cca2} / ${country.cca3}`}
                        icon={<PqoqubbwIcon name="hash" className="w-4 h-4 text-purple-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.capital" defaultMessage="Capital" />}
                        value={country.capital?.join(', ') || <FormattedMessage id="countries.notAvailable" defaultMessage="No disponible" />}
                        icon={<PqoqubbwIcon name="building" className="w-4 h-4 text-red-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.languages" defaultMessage="Idiomas" />}
                        value={countriesService.formatLanguages(country.languages)}
                        icon={<PqoqubbwIcon name="languages" className="w-4 h-4 text-yellow-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.currencies" defaultMessage="Moneda" />}
                        value={countriesService.formatCurrencies(country.currencies)}
                        icon={<PqoqubbwIcon name="coins" className="w-4 h-4 text-emerald-600" />}
                    />

                    <InfoField
                        label={<FormattedMessage id="countries.population" defaultMessage="Población" />}
                        value={countriesService.formatPopulation(country.population)}
                        icon={<PqoqubbwIcon name="users" className="w-4 h-4 text-indigo-600" />}
                    />

                </div>

            </div>
        </div>
    );
};

export default CountryDetail;
