import React, { useEffect, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { FormattedMessage } from 'react-intl';
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setSelectedCountry } from "../../store/slices/userCountriesSlice";
import { PqoqubbwIcon } from '../Icons';

// Declaración global para Datamap
declare global {
  interface Window {
    Datamap: any;
  }
}

interface WorldMapProps {
  width?: number;
  height?: number;
  onCountryClick?: (countryCode: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const datamapRef = useRef<any>(null);

  const sparklesSVG = ReactDOMServer.renderToStaticMarkup(
    // @ts-ignore 
    <PqoqubbwIcon name="sparkles" animate={false} className="w-4 h-4 text-yellow-400" />
  );

  const circleDollarSVG = ReactDOMServer.renderToStaticMarkup(
    // @ts-ignore
    <PqoqubbwIcon name="circleDollarSign" animate={false} className="w-4 h-4 text-green-400" />
  );

  // Redux state
  const { countries: userCountries, selectedCountry } = useAppSelector(
    (state: any) => state.userCountries
  );
  const dispatch = useAppDispatch();

  // Mapeo de códigos de país de 2 letras para Datamaps
  const getCountryCode2 = (cca3: string): string => {
    const mapping: Record<string, string> = {
      USA: "us",
      CHN: "cn",
      DEU: "de",
      GBR: "gb",
      IND: "in",
      CAN: "ca",
      AUS: "au",
      FRA: "fr",
      JPN: "jp",
      ITA: "it",
      RUS: "ru",
      MEX: "mx",
      ZAF: "za",
      ESP: "es",
      BRA: "br",
      ARG: "ar",
      EGY: "eg",
      TUR: "tr",
      SAU: "sa",
      KOR: "kr",
      THA: "th",
      IDN: "id",
      MYS: "my",
      SGP: "sg",
      PHL: "ph",
      VNM: "vn",
      PAK: "pk",
      BGD: "bd",
      IRN: "ir",
      IRQ: "iq",
      AFG: "af",
      NPL: "np",
      LKA: "lk",
      MMR: "mm",
      KHM: "kh",
      LAO: "la",
      NGA: "ng",
      ETH: "et",
      KEN: "ke",
      UGA: "ug",
      TZA: "tz",
      GHA: "gh",
      AGO: "ao",
      MOZ: "mz",
      MDG: "mg",
    };
    return mapping[cca3] || cca3.toLowerCase().substring(0, 2);
  };

  // Preparar datos para Datamaps
  const prepareDataForDatamaps = () => {
    const dataSet: Record<string, any> = {};

    Object.keys(userCountries).forEach((countryCode) => {
      const userData = userCountries[countryCode];
      const rating = userData.generalRating;

      let fillKey = "DEFAULT";
      if (rating >= 4) fillKey = "EXCELLENT";
      else if (rating >= 3) fillKey = "GOOD";
      else if (rating >= 2) fillKey = "FAIR";
      else if (rating >= 1) fillKey = "POOR";

      dataSet[countryCode] = {
        fillKey,
        rating: rating.toFixed(1),
        comments: userData.comments,
        note: userData.ratings.note,
        food: userData.ratings.food,
        culture: userData.ratings.culture,
        price: userData.ratings.price,
        short: getCountryCode2(countryCode),
      };
    });

    return dataSet;
  };

  // Inicializar Datamap
  useEffect(() => {
    if (!mapRef.current || !window.Datamap) return;

    const dataSet = prepareDataForDatamaps();

    // Limpiar mapa existente si existe
    if (datamapRef.current) {
      try {
        mapRef.current.innerHTML = "";
      } catch (e) {
        console.log("Error clearing map:", e);
      }
    }

    try {
      datamapRef.current = new window.Datamap({
        element: mapRef.current,
        projection: "mercator",
        responsive: true,
        fills: {
          defaultFill: "#e2e8f0",
          DEFAULT: "#e2e8f0",
          EXCELLENT: "#10b981",
          GOOD: "#f59e0b",
          FAIR: "#f97316",
          POOR: "#ef4444",
        },
        data: dataSet,
        height: mapRef.current.clientHeight,
        width: mapRef.current.clientWidth,
        geographyConfig: {
          borderColor: "#94a3b8",
          highlightFillColor: function (data: any) {
            if (data && data.fillKey !== "DEFAULT") {
              return "#3b82f6";
            }
            return "#cbd5e1";
          },
          highlightBorderColor: "#3b82f6",
          highlightBorderWidth: 2,
          popupTemplate: function (geo: any, data: any) {
            const countryName = (() => {
              if (!geo) return "Desconocido";
              const props = geo.properties || {};
              return (
                props.NAME ||
                props.name ||
                props.ADMIN ||
                props.admin ||
                props.ADMIN_NAME ||
                geo.id ||
                (data && data.short
                  ? String(data.short).toUpperCase()
                  : "Desconocido")
              );
            })();

            if (!data || data.fillKey === "DEFAULT") {
              return `
                <div class="bg-gray-900/95 text-white rounded-lg p-3 shadow-lg min-w-48">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg font-semibold">${countryName}</span>
                  </div>
                  <p class="text-gray-300 text-sm">Sin valoraciones</p>
                </div>
              `;
            }

            const renderStars = (rating: number) => {
              let stars = "";
              for (let i = 1; i <= 5; i++) {
                const svg = i <= rating ? sparklesSVG : sparklesSVG; // use same svg but style via wrapper
                const opacity = i <= rating ? 1 : 0.25;
                stars += `<span style="display:inline-flex;align-items:center;margin-right:4px;opacity:${opacity};">${svg}</span>`;
              }
              return `<div style=\"display:flex;flex-direction:row;align-items:center;\">${stars}</div>`;
            };

            return `
              <div class="bg-gray-900/95 text-white rounded-lg p-3 shadow-lg min-w-64">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-lg font-semibold">${countryName}</span>
                  <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs">${
                    data.rating
                  }★</span>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-300">Nota:</span>
                    <span>${renderStars(data.note)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Comida:</span>
                    <span>${renderStars(data.food)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Cultura:</span>
                    <span>${renderStars(data.culture)} </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Precio:</span>
                    <span>
                      <span style="display:inline-flex;align-items:center;gap:6px;">
                        ${(() => {
                          const count = Math.max(0, Math.min(5, data.price));
                          let html = "";
                          for (let i = 0; i < count; i++) {
                            html += `<span style=\"display:inline-flex;align-items:center;margin-right:4px;\">${circleDollarSVG}</span>`;
                          }
                          return html;
                        })()} 
                      </span>
                    </span>
                  </div>
                  ${
                    data.comments
                      ? `
                    <div class="mt-2 pt-2 border-t border-gray-600">
                      <p class="text-gray-300 text-xs italic">"${data.comments.substring(
                        0,
                        100
                      )}${data.comments.length > 100 ? "..." : ""}"</p>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `;
          },
        },
        done: function (datamap: any) {
          // Manejar clicks en países
          datamap.svg
            .selectAll(".datamaps-subunit")
            .on("click", function (geography: any) {
              const countryCode = geography.id;
              dispatch(setSelectedCountry(countryCode));
              onCountryClick?.(countryCode);
            });

          // País seleccionado
          if (selectedCountry) {
            datamap.svg
              .selectAll(".datamaps-subunit")
              .style("stroke", function (d: any) {
                return d.id === selectedCountry ? "#3b82f6" : "#94a3b8";
              })
              .style("stroke-width", function (d: any) {
                return d.id === selectedCountry ? "2px" : "1px";
              });
          }
        },
      });

      // Manejar redimensionamiento
      const handleResize = () => {
        if (datamapRef.current && datamapRef.current.resize) {
          datamapRef.current.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("Error initializing Datamap:", error);
    }
  }, [userCountries, selectedCountry, dispatch, onCountryClick]);

  // Verificar que Datamap esté disponible
  if (typeof window !== "undefined" && !window.Datamap) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            <FormattedMessage id="worldMap.loadingError" defaultMessage="Cargando mapa..." />
          </h3>
          <p className="text-white/70">
            <FormattedMessage id="worldMap.loadingLibrary" defaultMessage="La librería de mapas se está cargando" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-5xl" style={{ padding: "0 8px" }}>
          <div
            ref={mapRef}
            id="countries-datamap"
            className="mx-auto"
            style={{
              minHeight: "360px",
              height: "60vh",
              maxHeight: "600px",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Leyenda */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <h4 className="text-white font-medium text-sm mb-2">
          <FormattedMessage id="map.mapLegend" defaultMessage="Valoraciones" />
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-white/80">
              <FormattedMessage id="map.excellent" defaultMessage="Excelente" /> (4-5★)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-white/80">
              <FormattedMessage id="map.good" defaultMessage="Bueno" /> (3-4★)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-white/80">
              <FormattedMessage id="map.fair" defaultMessage="Regular" /> (2-3★)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-white/80">
              <FormattedMessage id="map.poor" defaultMessage="Malo" /> (1-2★)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-white/80">
              <FormattedMessage id="map.notRated" defaultMessage="Sin valorar" />
            </span>
          </div>
        </div>
      </div>

      {/* Indicador del país seleccionado */}
      {selectedCountry && (
        <div className="absolute bottom-4 left-4 bg-blue-500/20 border border-blue-400/40 rounded-lg p-3">
          <p className="text-blue-300 text-sm font-semibold">
            📍 <FormattedMessage id="map.selectedCountry" defaultMessage="País seleccionado:" /> {selectedCountry}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
