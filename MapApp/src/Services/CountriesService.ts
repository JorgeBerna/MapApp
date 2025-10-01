import type { Country } from '../Types/Country';

export class CountriesService {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  async getAllCountries(fields?: string[]): Promise<Country[]> {
    try {
      let url = `${this.baseUrl}/all`;
      
      if (fields && fields.length > 0) {
        url += `?fields=${fields.join(',')}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const countries: Country[] = await response.json();
      return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } catch (error) {
      console.error('Error al obtener países:', error);
      throw new Error('No se pudieron cargar los países');
    }
  }

  filterCountriesByName(countries: Country[], searchTerm: string): Country[] {
    if (!searchTerm.trim()) {
      return countries;
    }

    const search = searchTerm.toLowerCase();
    return countries.filter(country => 
      country.name.common.toLowerCase().includes(search) ||
      country.name.official.toLowerCase().includes(search) ||
      country.cca2.toLowerCase().includes(search) ||
      country.cca3.toLowerCase().includes(search)
    );
  }

  formatCurrencies(currencies?: Record<string, { name: string; symbol: string }>): string {
    if (!currencies) return 'No disponible';
    
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  }

  formatLanguages(languages?: Record<string, string>): string {
    if (!languages) return 'No disponible';
    
    return Object.values(languages).join(', ');
  }

  formatPopulation(population: number): string {
    return population.toLocaleString('es-ES');
  }
}

export const countriesService = new CountriesService();