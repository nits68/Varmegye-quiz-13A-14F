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

    constructor() {
        this.router.get("/api/quizC1/", this.getQuizQuestion);
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
            console.log(data);
            const newData: IParts = {
                _id: "null",
                db: Math.floor(Math.random() * 10),
            };

            data.push(newData);
        }

        console.log(morphMap);

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
}
