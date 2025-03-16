import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { IController } from "#interfaces.js";
import { Request, Response, Router } from "express";

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
            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };

    private getCityById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document: ICity | null = await this.cities.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: "City not found" });
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
