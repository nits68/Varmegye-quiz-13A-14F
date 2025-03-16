import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { cityModel } from "./city.model";
import { ICity } from "./city.interface";

export class cityController implements IController {
    public router = Router();
    private cities = cityModel;

    constructor() {
        this.router.get("/api/cities", this.getAllCities);
        this.router.get("/api/city/:id", this.getCityById);
    }

    
    private getAllCities = async (req: Request, res: Response) => {
        try {
            const data: ICity[] = await this.cities.find();
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: "Cities not found" });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getCityById = async (req: Request, res: Response) => {
            try {
                const id = req.params.id;
                const document: ICity = await this.cities.findById(id);
                if (document) {
                    res.send(document);
                } else {
                    res.status(404).send({ message: "City not found" });
                }
            } catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
}
