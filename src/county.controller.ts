import { ICounty } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class countyController implements IController {
    public router = Router();
    private counties = countyModel;

    constructor() {
        this.router.get("/api/counties", this.getAllCounties);
        this.router.get("/api/county/:id", this.getCountyById);
    }

    private getAllCounties = async (req: Request, res: Response) => {
        try {
            const data: ICounty[] = await this.counties
                .find()
                .populate("neighboringCounties", { largest_cities: 0, neighboring_counties: 0, neighboring_countries: 0 })
                .populate("neighboringCountries")
                .populate("largestCities");
            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred!!" });
            }
        }
    };

    private getCountyById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document: ICounty | null = await this.counties
                .findById(id)
                .populate("neighboringCounties", { largest_cities: 0, neighboring_counties: 0, neighboring_countries: 0 })
                .populate("neighboringCountries")
                .populate("largestCities");
            if (document) {
                res.send(document);
            } else {
                res.status(404).send({ message: "County not found" });
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
