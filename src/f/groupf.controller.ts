import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { ICountry } from "#country.interface.js";
import { countryModel } from "#country.model.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupfController implements IController {
    public router = Router();
    private countries = countryModel;
    private counties = countyModel;
    private cities = cityModel;

    constructor() {
        this.router.get("/api/quiz/F1", this.getQuizF1 as any);
    }

    private getQuizF1 = async (req: Request, res: Response) => {
        try {
            const cityIds = [35, 30, 22, 16];

            const budapest = await this.cities.findById(1);

            if (!budapest) {
                return res.status(404).send({ message: "Budapest not found" });
            }

            const specifiedCities = await this.cities.find({ _id: { $in: cityIds } });

            if (specifiedCities.length < 3) {
                return res.status(500).send({ message: "Not enough specified cities found" });
            }

            const selectedCities = specifiedCities.sort(() => 0.5 - Math.random()).slice(0, 3);

            const cityNames = selectedCities.map(city => city.name);

            const allAnswers = [budapest.name, ...cityNames].sort(() => 0.5 - Math.random());

            const response: IResponse = {
                question: "A felsorolt városok közül melyik nem tartozik egy vármegyébe?",
                answers: allAnswers,
                solution: budapest.name,
            };

            res.status(200).send(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred!" });
            }
        }
    };
}
