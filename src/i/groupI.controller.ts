import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupIcontroller implements IController {
    public router = Router();
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizI", this.getRandomCountyStartingLetterQuestion);
    }

    private getRandomCountyStartingLetterQuestion = (req: Request, res: Response) => {
        try {
            const countiesData = [
                { name: "Bács-Kiskun" },
                { name: "Baranya" },
                { name: "Békés" },
                { name: "Borsod-Abaúj-Zemplén" },
                { name: "Csongrád-Csanád" },
                { name: "Fejér" },
                { name: "Győr-Moson-Sopron" },
                { name: "Hajdú-Bihar" },
                { name: "Heves" },
                { name: "Jász-Nagykun-Szolnok" },
                { name: "Komárom-Esztergom" },
                { name: "Nógrád" },
                { name: "Pest" },
                { name: "Somogy" },
                { name: "Szabolcs-Szatmár-Bereg" },
                { name: "Tolna" },
                { name: "Vas" },
                { name: "Veszprém" },
                { name: "Zala" },
            ];

            const letters = Array.from(new Set(countiesData.map(county => county.name.trim().charAt(0).toUpperCase())));
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            const countiesStartingWithLetter = countiesData.filter(county => county.name.trim().charAt(0).toUpperCase() === randomLetter);

            const count = countiesStartingWithLetter.length;

            if (count === 0) {
                res.status(404).send({ message: `No counties start with the letter ${randomLetter}` });
                return;
            }

            const wrongAnswer1 = count + Math.floor(Math.random() * 3) + 1;
            const wrongAnswer2 = count + Math.floor(Math.random() * 5) + 2;
            const wrongAnswer3 = count + Math.floor(Math.random() * 4) + 3;

            const answersSet = new Set([count.toString(), wrongAnswer1.toString(), wrongAnswer2.toString(), wrongAnswer3.toString()]);

            while (answersSet.size < 4) {
                const newWrongAnswer = count + Math.floor(Math.random() * 5) + 1;
                answersSet.add(newWrongAnswer.toString());
            }

            const answers = Array.from(answersSet);
            this.shuffleArray(answers);

            const quizQuestion: IResponse = {
                answers: answers,
                question: `Hány vármegye neve kezdődik ${randomLetter} karakterrel?`,
                solution: count.toString(),
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
