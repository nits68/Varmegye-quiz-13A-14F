import { ICountry } from "#country.interface.js";
import { countryModel } from "#country.model.js";
import { IController } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class countryController implements IController {
    public router = Router();
    private countries = countryModel;

    constructor() {
        this.router.get("/api/countries", this.getAllCountries);
        this.router.get("/api/country/:id", this.getCountryById);
    }

    private getAllCountries = async (req: Request, res: Response) => {
        try {
            const data: ICountry[] = await this.countries.find();
            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred!" });
            }
        }
    };

    private getCountryById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.countries.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: "Country not found" });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred!" });
            }
        }
    };
}
