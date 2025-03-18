import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { ICounty } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupAcontroller implements IController {
    public router = Router();
    private cities = cityModel;
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizA1/county/seat", this.getCountySeatQuestion);
    }

    private getCountySeatQuestion = async (req: Request, res: Response) => {
        try {
            const countiesCount = await this.counties.countDocuments();

            const randomSkip = Math.floor(Math.random() * countiesCount);
            const randomCounty: ICounty | null = await this.counties.findOne().skip(randomSkip).exec();

            if (!randomCounty) {
                res.status(404).send({ message: "County not found" });
                return;
            }

            const correctCity: ICity | null = await this.cities.findById(randomCounty.seat_id).exec();

            if (!correctCity) {
                res.status(404).send({ message: "City not found" });
                return;
            }

            const wrongCities = await this.cities
                .find({ _id: { $ne: correctCity._id } })
                .limit(3)
                .exec();

            if (wrongCities.length < 3) {
                res.status(500).send({ message: "Not enough cities for quiz options" });
                return;
            }

            const answers: string[] = [correctCity.name, ...wrongCities.map(city => city.name)];

            this.shuffleArray(answers);

            const quizQuestion: IResponse = {
                answers: answers,
                question: `Mi a megyeszékhelye ${randomCounty.name} vármegyének?`,
                solution: correctCity.name,
            };

            res.status(200).send(quizQuestion);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "An unknown error occurred" });
            }
        }
    };

    private shuffleArray(array: string[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
