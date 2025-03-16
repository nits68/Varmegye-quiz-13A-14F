import { ICountry } from "#country.interface.js";
import { model, Schema } from "mongoose";

const countrySchema = new Schema<ICountry>(
    {
        _id: Number,
        area: {
            required: true,
            type: Number,
        },
        flag_url_big: {
            required: true,
            type: String,
        },
        flag_url_small: {
            required: true,
            type: String,
        },
        name: {
            maxLength: 40,
            required: true,
            type: String,
            unique: true,
        },
        population: {
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

export const countryModel = model("countryModelID", countrySchema, "countries");
