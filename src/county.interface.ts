import { Schema } from "mongoose";

export interface ICounty {
    _id: number;
    name: string;
    seat_id: number;
    flag_url_small: string;
    flag_url_big: string;
    country_part: string;
    region: string;
    population: number;
    area: number;
    neighboring_counties: number[];
    neighboring_countries: number[];
    largest_cities: number[];
}
