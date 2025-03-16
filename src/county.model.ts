import { ICounty } from "county.interface";

import { Schema, model } from "mongoose";

const countySchema = new Schema<ICounty>(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 40,
        },
        seat_id: {
            type: Number,
            required: true,
            ref: "cityModelID",
        },
        flag_url_small: {
            type: String,
            required: true,
        },
        flag_url_big: {
            type: String,
            required: true,
        },
        country_part: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        population: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        neighboring_counties: {
            type: [Number],
            required: true,
            ref: "countyModelID",
        },
        neighboring_countries: {
            type: [Number],
            required: true,
            ref: "countryModelID",
        },
        largest_cities: {
            type: [Number],
            required: true,
            ref: "cityModelID",
        },
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Mongoose also supports populating virtuals.
// Help: https://mongoosejs.com/docs/tutorials/virtuals.html#populate
// You can give the "virtualPop" any name you want:

// Access oneSide from manySide:
// manySideSchema.virtual("virtualPop", {
//     ref: "oneSideID",
//     localField: "FK_neve",
//     foreignField: "_id", //ref_Field
//     justOne: true,
// });
// Use virtual for populate in manySide controller:
// const data = await this.many.find({},"-_id").populate("virtualPop", "-_id -prepTime");

// Access manySide from oneSide:
// oneSideSchema.virtual("virtualPop", {
//     ref: "manySideID",
//     localField: "_id",
//     foreignField: "FK_neve", //ref_Field
//     justOne: false,
// });
// Use virtual for populate in oneSide controller:
// const data = await this.one.find({},"-_id").populate("virtualPop", "-_id");

export const countyModel = model("countyModelID", countySchema, "counties");
