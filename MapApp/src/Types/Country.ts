export interface Country {
    name: {
        common: string;
        official: string;
    };
    cca2: string;
    cca3: string;
    capital?: string[];
    population: number;
    region: string;
    subregion?: string;
    currencies?: Record<string, {
        name: string;
        symbol: string;
    }>;
    languages?: Record<string, string>;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
}
