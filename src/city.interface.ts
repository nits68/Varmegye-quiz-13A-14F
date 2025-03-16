import { Schema } from "mongoose";

export interface ICity {
    _id: number;
    name: string;
    population: number;
    coat_of_arms_url: string;
    area: number;
}
