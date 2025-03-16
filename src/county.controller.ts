import { Request, Response, Router } from "express";
import { IController } from "./interfaces";
import { countyModel } from "./county.model";
import { ICounty } from "./county.interface";

export class countyController implements IController {
    public router = Router();
    private counties = countyModel;

    constructor() {
        this.router.get("/api/get-all-counties", this.getAllCounties);
    }

    // Many-side handlers *********************************************
    private getAllCounties = async (req: Request, res: Response) => {
        try {
            const data: ICounty[] = await this.counties.find();
            if (data) {
                res.send(data);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}
