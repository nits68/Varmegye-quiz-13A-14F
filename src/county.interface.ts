export interface ICounty {
    _id: number;
    area: number;
    country_part: string;
    flag_url_big: string;
    flag_url_small: string;
    largest_cities: number[];
    name: string;
    neighboring_counties: number[];
    neighboring_countries: number[];
    population: number;
    region: string;
    seat_id: number;
}

export interface ICountyFull extends ICounty {
    largestCities: ILargestCity[];
    neighboringCounties: INeighboringCounty[];
    neighboringCountries: INeighboringCountry[];
}

export interface ILargestCity {
    _id: number;
    area: number;
    coat_of_arms_url: string;
    name: string;
    population: number;
}

export interface INeighboringCountry {
    _id: number;
    area: number;
    flag_url_big: string;
    flag_url_small: string;
    name: string;
    population: number;
}

export interface INeighboringCounty {
    _id: number;
    area: number;
    country_part: string;
    flag_url_big: string;
    flag_url_small: string;
    name: string;
    population: number;
    region: string;
    seat_id: number;
}
