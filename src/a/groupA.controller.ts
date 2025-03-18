import { IController, IResponse } from "../interfaces";
import { countyModel } from "../county.model";
import { cityModel } from "../city.model";
import { Request, Response, Router } from "express";

export class groupAcontroller implements IController {
    public router = Router();
    private counties = countyModel;
    private cities = cityModel;

    constructor() {
        this.router.get("/api/quizA1/county/seat", this.getCountySeatQuestion);
    }

    private getCountySeatQuestion = async (req: Request, res: Response) => {
        try {
            const countiesCount = await this.counties.countDocuments();
            
            const randomSkip = Math.floor(Math.random() * countiesCount);
            const randomCounty = await this.counties.findOne().skip(randomSkip).exec();
            
            if (!randomCounty) {
                return res.status(404).send({ message: "County not found" });
            }
            
            const correctCity = await this.cities.findById(randomCounty.seat_id).exec();
            
            if (!correctCity) {
                return res.status(404).send({ message: "City not found" });
            }
            
            const wrongCities = await this.cities
                .find({ _id: { $ne: correctCity._id } })
                .limit(3)
                .exec();
            
            if (wrongCities.length < 3) {
                return res.status(500).send({ message: "Not enough cities for quiz options" });
            }
            
            const answers = [
                correctCity.name,
                ...wrongCities.map(city => city.name)
            ];
            
            this.shuffleArray(answers);
            
            const quizQuestion: IResponse = {
                question: `Mi a megyeszékhelye ${randomCounty.name} vármegyének?`,
                answers: answers,
                solution: correctCity.name
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

    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
