import { cityModel } from "#city.model.js";
import { ICountyFull } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

interface IParts {
    _id: string;
    db: number;
}

export class groupCController implements IController {
    public router = Router();
    private counties = countyModel;
    private countries = countyModel;
    private cities = cityModel;

    constructor() {
        this.router.get("/api/quizC1", this.getQuizQuestion);
        this.router.get("/api/quizC2", this.getQuizQuestion_PopPercentage);
    }

    private async getCounties() {
        const data: IParts[] = await this.counties.aggregate([
            {
                $group: {
                    _id: "$country_part",
                    db: { $sum: 1 },
                },
            },
        ]);

        const morphMap: Map<string, string> = new Map<string, string>([
            ["AF", "Alföld és Észak"],
            ["DT", "Dunán Túl"],
            ["KM", "Közép-Magyarország"],
        ]);

        const num = Math.floor(Math.random() * data.length);
        const selected = data[num];

        while ([...new Set(data.map(x => x.db.toString()))].length < 4) {
            const newData: IParts = {
                _id: "null",
                db: Math.floor(Math.random() * 10),
            };

            data.push(newData);
        }

        const answer: IResponse = {
            answers: [...new Set(data.map(x => x.db.toString()))],
            question: `Hány vármegye van a ${morphMap.get(selected._id) ?? selected._id} országrészben?`,
            solution: selected.db.toString(),
        };

        return answer;
    }

    private getQuizQuestion = async (req: Request, res: Response) => {
        try {
            const data: IResponse = await this.getCounties();

            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };
    private getQuizQuestion_PopPercentage = async (req: Request, res: Response) => {
        try {
            const data: IResponse = await this.getPopulationPercentage();

            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };

    private async getPopulationPercentage() {
        const counties: ICountyFull[] = await this.countries.find({ name: { $ne: "Pest" } });

        const randomCounty = counties[Math.floor(Math.random() * counties.length)];

        const city = await this.cities.findOne({ _id: randomCounty.seat_id });
        if (!city || !city.population) {
            throw new Error("City population data is missing");
        }
        const percentage = ((city.population / randomCounty.population) * 100).toFixed(0);

        const answers = [percentage.toString()];

        while (answers.length < 4) {
            const newAnswer = Math.floor(Math.random() * 101).toString();
            if (!answers.includes(newAnswer)) {
                answers.push(newAnswer);
            }
        }

        const answer: IResponse = {
            answers: answers.sort(),
            question: `Hány százaléka a székhely lakosságának ${randomCounty.name} vármegye lakossága?`,
            solution: percentage.toString(),
        };

        return answer;
    }
}
