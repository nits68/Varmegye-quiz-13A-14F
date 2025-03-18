import { ICity } from "#city.interface.js";
import { ICountry } from "#country.interface.js";

export interface ICounty {
    _id: number;
    area: number;
    country_part: string;
    flag_url_big: string;
    flag_url_small: string;
    largest_cities?: number[];
    name: string;
    neighboring_counties?: number[];
    neighboring_countries?: number[];
    population: number;
    region: string;
    seat_id: number;
}

export interface ICountyFull extends ICounty {
    largestCities: ICity[];
    neighboringCounties: ICounty[];
    neighboringCountries: ICountry[];
}

// export interface INeighboringCounty {
//     _id: number;
//     area: number;
//     country_part: string;
//     flag_url_big: string;
//     flag_url_small: string;
//     name: string;
//     population: number;
//     region: string;
//     seat_id: number;
// }
