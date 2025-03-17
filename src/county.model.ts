import { ICountyFull } from "#county.interface.js";
import { model, Schema } from "mongoose";

const countySchema = new Schema<ICountyFull>(
    {
        _id: Number,
        area: {
            required: true,
            type: Number,
        },
        country_part: {
            required: true,
            type: String,
        },
        flag_url_big: {
            required: true,
            type: String,
        },
        flag_url_small: {
            required: true,
            type: String,
        },
        largest_cities: {
            ref: "cityModelID",
            required: true,
            type: [Number],
        },
        name: {
            maxLength: 40,
            required: true,
            type: String,
            unique: true,
        },
        neighboring_counties: {
            ref: "countyModelID",
            required: true,
            type: [Number],
        },
        neighboring_countries: {
            ref: "countryModelID",
            required: true,
            type: [Number],
        },
        population: {
            required: true,
            type: Number,
        },
        region: {
            required: true,
            type: String,
        },
        seat_id: {
            ref: "cityModelID",
            required: true,
            type: Number,
        },
    },
    { id: false, toJSON: { virtuals: true }, toObject: { virtuals: true }, versionKey: false },
);

// Mongoose also supports populating virtuals.
// Help: https://mongoosejs.com/docs/tutorials/virtuals.html#populate
// You can give the "virtualPop" any name you want:

// Access oneSide from manySide:
countySchema.virtual("largestCities", {
    foreignField: "_id", //ref_Field
    justOne: false,
    localField: "largest_cities",
    ref: "cityModelID",
});

countySchema.virtual("neighboringCounties", {
    foreignField: "_id", //ref_Field
    justOne: false,
    localField: "neighboring_counties",
    ref: "countyModelID",
});

countySchema.virtual("neighboringCountries", {
    foreignField: "_id", //ref_Field
    justOne: false,
    localField: "neighboring_countries",
    ref: "countryModelID",
});

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
