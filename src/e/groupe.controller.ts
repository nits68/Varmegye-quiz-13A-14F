import { cityModel } from "#city.model.js";
import { ICounty, ICountyFull } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class GroupEController implements IController {
    public router = Router();
    private cities = cityModel;
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizE1", this.question1);
        this.router.get("/api/quizE2", this.question2);
    }

    private question1 = async (req: Request, res: Response) => {
        try {
            const document: ICountyFull[] = await this.counties
                .find()
                .populate("neighboringCounties", {
                    largest_cities: 0,
                    neighboring_counties: 0,
                    neighboring_countries: 0,
                })
                .populate("neighboringCountries")
                .populate("largestCities");
            const rightAnswer: ICountyFull = document[Math.floor(Math.random() * document.length)];
            const randomCity: string =
                rightAnswer.largestCities[Math.floor(Math.random() * rightAnswer.largestCities.length)].name;
            const answers: string[] = [rightAnswer.name];
            while (answers.length < 4) {
                const answerCounty: ICounty | null = document[Math.floor(Math.random() * document.length)];
                if (!answers.includes(answerCounty.name)) answers.push(answerCounty.name);
            }
            res.send({
                answers: answers,
                question: `Melyik vármegyében található ${randomCity}?`,
                solution: rightAnswer.name,
            } as IResponse);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };

    private question2 = async (req: Request, res: Response) => {
        try {
            const document: ICountyFull[] = await this.counties.find().populate("neighboringCounties", {
                largest_cities: 0,
                neighboring_counties: 0,
                neighboring_countries: 0,
            });
            const questionCounty: ICountyFull = document[Math.floor(Math.random() * document.length)];
            const maxPopulationNeighbour: ICounty = questionCounty.neighboringCounties[0];
            let rightAnswer: string = maxPopulationNeighbour.name;
            questionCounty.neighboringCounties.forEach(c => {
                if (c.population > maxPopulationNeighbour.population) rightAnswer = c.name;
            });
            const answers: string[] = [];
            while (answers.length < questionCounty.neighboringCounties.length - 1) {
                const answer: ICounty =
                    questionCounty.neighboringCounties[
                        Math.floor(Math.random() * questionCounty.neighboringCounties.length)
                    ];
                if (!answers.includes(answer.name) && answer.name != rightAnswer) answers.push(answer.name);
            }
            answers[Math.floor(Math.random() * questionCounty.neighboringCounties.length)] = rightAnswer;
            res.send({
                answers: answers,
                question: `${questionCounty.name} vármegyének melyik a legnépesebb szomszédos vármegyéje?`,
                solution: rightAnswer,
            } as IResponse);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };
}
