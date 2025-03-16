import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { countyModel } from "./county.model";
import { ICounty } from "./county.interface";

export class countyController implements IController {
    public router = Router();
    private counties = countyModel;

    constructor() {
        this.router.get("/api/counties", this.getAllCounties);
        this.router.get("/api/county/:id", this.getCountyById);
    }

    private getAllCounties = async (req: Request, res: Response) => {
        try {
            const data: ICounty[] = await this.counties.find();
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: "Counties not found" });
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    private getCountyById = async (req: Request, res: Response) => {
            try {
                const id = req.params.id;
                const document = await this.counties.findById(id);
                if (document) {
                    res.send(document);
                } else {
                    res.status(404).send({ message: "County not found" });
                }
            } catch (error) {
                res.status(400).send({ message: error.message });
            }
        };
}
