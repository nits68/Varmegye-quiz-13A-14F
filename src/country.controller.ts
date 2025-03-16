import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { countryModel } from "./country.model";
import { ICountry } from "./country.interface";

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
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: "Countries not found" });
            }
            
        } catch (error) {
            res.status(400).send({ message: error.message });
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
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
