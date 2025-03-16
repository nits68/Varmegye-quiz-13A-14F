import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { cityModel } from "./city.model";
import { ICity } from "./city.interface";

export class cityController implements IController {
    public router = Router();
    private cities = cityModel;

    constructor() {
        this.router.get("/api/get-all-cities", this.getAllCities);
    }

    
    private getAllCities = async (req: Request, res: Response) => {
        try {
            const data: ICity[] = await this.cities.find();
            if (data) {
                res.send(data);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
