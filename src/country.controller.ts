import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { countryModel } from "./country.model";
import { ICountry } from "./country.interface";

export class countryController implements IController {
    public router = Router();
    private countries = countryModel;

    constructor() {
        this.router.get("/api/get-all-countries", this.getAllCountries);
    }

    // Many-side handlers *********************************************
    private getAllCountries = async (req: Request, res: Response) => {
        try {
            const data: ICountry[] = await this.countries.find();
            if (data) {
                res.send(data);
            }
            
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
