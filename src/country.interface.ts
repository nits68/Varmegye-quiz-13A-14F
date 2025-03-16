import { Schema } from "mongoose";

export interface ICountry {
    _id: Schema.Types.ObjectId;
    name: string;
    flag_url_small: string;
    flag_url_big: string;
    population: number;
    area: number;
}