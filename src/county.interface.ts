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
