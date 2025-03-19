import { ICounty } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupGcontroller implements IController {
    public router = Router();
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizG1/county", this.getCountyQuestion);
    }

    private getCountyQuestion = async (req: Request, res: Response) => {
        try {
            const counties: ICounty[] = await this.counties.find().exec();
            const dunantuliCounties: ICounty[] = counties.filter(county => county.country_part === "DT");
            const nonDunantuliCounties: ICounty[] = counties.filter(county => county.country_part !== "DT");

            if (nonDunantuliCounties.length === 0) {
                res.status(500).send({ message: "Server error." });
                return;
            }

            const randomNonDunantuliCounty = nonDunantuliCounties[Math.floor(Math.random() * nonDunantuliCounties.length)];

            const incorrectAnswers = dunantuliCounties.sort(() => 0.5 - Math.random()).slice(0, 3);

            if (incorrectAnswers.length < 3) {
                res.status(500).send({ message: "Error." });
                return;
            }

            const answers: string[] = [randomNonDunantuliCounty.name, ...incorrectAnswers.map(county => county.name)];

            this.shuffleArray(answers);

            const quizQuestion: IResponse = {
                answers: answers,
                question: `A felsoroltak közül melyik nem Dunántúli megye?`,
                solution: randomNonDunantuliCounty.name,
            };

            res.status(200).send(quizQuestion);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Ismeretlen hiba történt." });
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
