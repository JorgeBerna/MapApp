import React, { useState, useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  createUserCountryData, 
  updateUserCountryData, 
  removeUserCountryData 
} from '../../store/slices/userCountriesSlice';
import { AuthContext } from '../../Contexts/AuthContext';
import { countriesService } from '../../Services/CountriesService';
import type { Country } from '../../Types/Country';
import type { CreateUserCountryDataDto } from '../../Types/UserCountryData';
import { PqoqubbwIcon } from '../Icons';

interface CountryCardProps {
  className?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ className = "" }) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState<Country | null>(null);
  const [loadingCountryData, setLoadingCountryData] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    note: 0,
    food: 0,
    culture: 0,
    price: 1,
    comments: ''
  });

  // Redux state (cast to any to satisfy TS in this component)
  const { countries: userCountries, selectedCountry, loading } = useAppSelector((state: any) => state.userCountries);
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const userData = selectedCountry ? userCountries[selectedCountry] : null;

  // Cargar datos del país seleccionado
  useEffect(() => {
    const loadCountryData = async () => {
      if (!selectedCountry) {
        setSelectedCountryData(null);
        return;
      }

      try {
        setLoadingCountryData(true);
        const fields = ['name', 'cca2', 'cca3', 'flags', 'capital', 'population', 'region', 'currencies', 'languages'];
        const countries = await countriesService.getAllCountries(fields);
        const country = countries.find(c => c.cca3 === selectedCountry);
        setSelectedCountryData(country || null);
      } catch (error) {
        console.error('Error loading country data:', error);
        setSelectedCountryData(null);
      } finally {
        setLoadingCountryData(false);
      }
    };

    loadCountryData();
  }, [selectedCountry]);

  // Actualizar form data cuando cambie userData
  useEffect(() => {
    if (userData) {
      setFormData({
        note: userData.ratings.note,
        food: userData.ratings.food,
        culture: userData.ratings.culture,
        price: userData.ratings.price,
        comments: userData.comments
      });
    } else {
      setFormData({
        note: 0,
        food: 0,
        culture: 0,
        price: 1,
        comments: ''
      });
    }
  }, [userData]);

  const handleSave = async () => {
    if (!user || !selectedCountry) return;

    const calculateGeneralRating = () => {
      const priceAsStars = 6 - formData.price;
      return (formData.note + formData.food + formData.culture + priceAsStars) / 4;
    };

    if (userData) {
      // Actualizar datos existentes
      await dispatch(updateUserCountryData({
        userId: user.uid,
        data: {
          countryCode: selectedCountry,
          ratings: {
            note: formData.note,
            food: formData.food,
            culture: formData.culture,
            price: formData.price
          },
          generalRating: calculateGeneralRating(),
          comments: formData.comments
        }
      }));
    } else {
      // Crear nuevos datos
      const newData: CreateUserCountryDataDto = {
        countryCode: selectedCountry,
        ratings: {
          note: formData.note,
          food: formData.food,
          culture: formData.culture,
          price: formData.price
        },
        generalRating: calculateGeneralRating(),
        comments: formData.comments
      };

      await dispatch(createUserCountryData({
        userId: user.uid,
        data: newData
      }));
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!user || !selectedCountry || !userData) return;

    if (window.confirm(intl.formatMessage({ id: 'map.deleteConfirm', defaultMessage: '¿Estás seguro de que quieres eliminar esta valoración?' }))) {
      await dispatch(removeUserCountryData({
        userId: user.uid,
        countryCode: selectedCountry
      }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        note: userData.ratings.note,
        food: userData.ratings.food,
        culture: userData.ratings.culture,
        price: userData.ratings.price,
        comments: userData.comments
      });
    } else {
      setFormData({
        note: 0,
        food: 0,
        culture: 0,
        price: 1,
        comments: ''
      });
    }
    setIsEditing(false);
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void, maxStars = 5) => {
    const stars = [];
    
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onRate?.(i)}
          disabled={!onRate}
          className={`text-2xl transition-colors ${
            onRate ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'
          } ${i <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
        >
          <PqoqubbwIcon name="sparkles" className={`${i <= rating ? 'text-yellow-400' : 'text-gray-500'} w-6 h-6`} />
        </button>
      );
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  const renderBills = (price: number, onRate?: (price: number) => void) => {
    const bills = [];
    
    for (let i = 1; i <= 5; i++) {
      bills.push(
        <button
          key={i}
          type="button"
          onClick={() => onRate?.(i)}
          disabled={!onRate}
          className={`text-2xl transition-colors ${
            onRate ? 'hover:text-green-300 cursor-pointer' : 'cursor-default'
          } ${i <= price ? 'text-green-400' : 'text-gray-500'}`}
        >
          <PqoqubbwIcon name="circleDollarSign" className={`${i <= price ? 'text-green-400' : 'text-gray-500'} w-6 h-6`} />
        </button>
      );
    }

    return <div className="flex space-x-1">{bills}</div>;
  };

  if (!selectedCountry) {
    return (
      <div className={`${className} flex items-center justify-center h-full`}>
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <PqoqubbwIcon name="mapPin" className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            <FormattedMessage id="map.noSelection" defaultMessage="Selecciona un país" />
          </h3>
          <p className="text-white/70">
            <FormattedMessage id="map.noSelectionDescription" defaultMessage="Haz clic en un país del mapa o de la lista para ver o agregar información" />
          </p>
        </div>
      </div>
    );
  }

  if (loadingCountryData) {
    return (
      <div className={`${className} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-3/4"></div>
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCountryData) {
    return (
      <div className={`${className} flex items-center justify-center h-full`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            <FormattedMessage id="map.countryNotFound" defaultMessage="País no encontrado" />
          </h3>
          <p className="text-white/70">
            <FormattedMessage id="map.countryNotFoundDescription" defaultMessage="No se pudo cargar la información del país seleccionado" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} h-full overflow-y-auto`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {selectedCountryData.name.common}
            </h1>
            <p className="text-white/80 mb-3">
              {selectedCountryData.name.official}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-400/30">
                {selectedCountryData.cca3}
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-400/30">
                {selectedCountryData.region}
              </span>
            </div>
          </div>
          
          {/* Bandera */}
          <div className="ml-4">
            <img
              src={selectedCountryData.flags.png}
              alt={selectedCountryData.flags.alt || `Bandera de ${selectedCountryData.name.common}`}
              className="w-16 h-12 object-cover rounded border border-white/20"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mt-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <FormattedMessage id="map.edit" defaultMessage={userData ? 'Editar' : 'Agregar valoración'} />
              </button>
              {userData && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FormattedMessage id="map.delete" defaultMessage="Eliminar" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <FormattedMessage id="map.save" defaultMessage={loading ? 'Guardando...' : 'Guardar'} />
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                <FormattedMessage id="map.cancel" defaultMessage="Cancelar" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6">
        {/* Información básica */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <PqoqubbwIcon name="info" className="w-5 h-5 mr-2 text-white/80" />
            <FormattedMessage id="countries.generalInfo" defaultMessage="Información básica" />
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-white/70">
                <FormattedMessage id="countries.capital" defaultMessage="Capital" />:
              </span>
              <span className="text-white ml-2">
                {selectedCountryData.capital?.[0] || <FormattedMessage id="countries.notAvailable" defaultMessage="No disponible" />}
              </span>
            </div>
            <div>
              <span className="text-white/70">
                <FormattedMessage id="countries.population" defaultMessage="Población" />:
              </span>
              <span className="text-white ml-2">{countriesService.formatPopulation(selectedCountryData.population)}</span>
            </div>
            <div>
              <span className="text-white/70">
                <FormattedMessage id="countries.languages" defaultMessage="Idiomas" />:
              </span>
              <span className="text-white ml-2">{countriesService.formatLanguages(selectedCountryData.languages)}</span>
            </div>
            <div>
              <span className="text-white/70">
                <FormattedMessage id="countries.currencies" defaultMessage="Moneda" />:
              </span>
              <span className="text-white ml-2">{countriesService.formatCurrencies(selectedCountryData.currencies)}</span>
            </div>
          </div>
        </div>

        {/* Valoraciones */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PqoqubbwIcon name="sparkles" className="w-5 h-5 mr-2 text-yellow-400" />
            <FormattedMessage id="map.ratings" defaultMessage="Mis valoraciones" />
          </h3>

          <div className="space-y-4">
            {/* Nota general */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <label className="block text-white/80 font-medium mb-2">
                <FormattedMessage id="map.note" defaultMessage="Nota general" />
              </label>
              {renderStars(
                formData.note, 
                isEditing ? (rating) => setFormData({...formData, note: rating}) : undefined
              )}
              {!isEditing && formData.note > 0 && (
                <span className="text-white/60 text-sm ml-2">({formData.note}/5)</span>
              )}
            </div>

            {/* Comida */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <label className="block text-white/80 font-medium mb-2">
                <FormattedMessage id="map.food" defaultMessage="Comida" />
              </label>
              {renderStars(
                formData.food, 
                isEditing ? (rating) => setFormData({...formData, food: rating}) : undefined
              )}
              {!isEditing && formData.food > 0 && (
                <span className="text-white/60 text-sm ml-2">({formData.food}/5)</span>
              )}
            </div>

            {/* Cultura */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <label className="block text-white/80 font-medium mb-2">
                <FormattedMessage id="map.culture" defaultMessage="Cultura" />
              </label>
              {renderStars(
                formData.culture, 
                isEditing ? (rating) => setFormData({...formData, culture: rating}) : undefined
              )}
              {!isEditing && formData.culture > 0 && (
                <span className="text-white/60 text-sm ml-2">({formData.culture}/5)</span>
              )}
            </div>

            {/* Precio */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <label className="block text-white/80 font-medium mb-2">
                <FormattedMessage id="map.price" defaultMessage="Precio" /> (1=barato, 5=caro)
              </label>
              {renderBills(
                formData.price, 
                isEditing ? (price) => setFormData({...formData, price: price}) : undefined
              )}
              {!isEditing && (
                <span className="text-white/60 text-sm ml-2">({formData.price}/5)</span>
              )}
            </div>

            {/* Valoración general calculada */}
            {userData && (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4">
                  <label className="block text-white/80 font-medium mb-2">
                    <FormattedMessage id="map.generalRating" defaultMessage="Valoración general" />
                  </label>
                  <div className="flex items-center space-x-2">
                    <PqoqubbwIcon name="sparkles" className="w-5 h-5 text-yellow-400" />
                    {renderStars(userData.generalRating)}
                    <span className="text-white font-medium">
                      {userData.generalRating.toFixed(1)}/5
                    </span>
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Comentarios */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <PqoqubbwIcon name="tag" className="w-5 h-5 mr-2 text-white/80" />
            <FormattedMessage id="map.comments" defaultMessage="Comentarios" />
          </h3>
          {isEditing ? (
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              placeholder={intl.formatMessage({ id: 'map.addComments', defaultMessage: 'Escribe tus comentarios sobre este país...' })}
              className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
            />
          ) : (
            <div className="bg-white/5 border border-white/20 rounded-lg p-4 min-h-[100px]">
              {formData.comments ? (
                <p className="text-white whitespace-pre-wrap">{formData.comments}</p>
              ) : (
                <p className="text-white/60 italic">Sin comentarios</p>
              )}
            </div>
          )}
        </div>

        {/* Información de fechas */}
        {userData && (
          <div className="text-sm text-white/60 space-y-1 border-t border-white/10 pt-4">
            <p>Creado: {new Date(userData.createdAt).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(userData.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryCard;