import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupIcontroller implements IController {
    public router = Router();
    private counties = countyModel;

    private countiesNeighbors = {
        "Bács-Kiskun": ["Fejér", "Pest", "Tolna", "Somogy", "Baranya", "Jász-Nagykun-Szolnok"],
        Baranya: ["Bács-Kiskun", "Fejér", "Tolna", "Pest", "Veszprém", "Zala"],
        Békés: ["Jász-Nagykun-Szolnok", "Szabolcs-Szatmár-Bereg", "Csongrád-Csanád", "Hajdú-Bihar"],
        "Csongrád-Csanád": ["Békés", "Hajdú-Bihar", "Szabolcs-Szatmár-Bereg", "Jász-Nagykun-Szolnok"],
        Fejér: ["Bács-Kiskun", "Baranya", "Pest", "Veszprém", "Tolna"],
        "Győr-Moson-Sopron": ["Komárom-Esztergom", "Vas", "Veszprém", "Pest", "Zala"],
        "Hajdú-Bihar": ["Békés", "Csongrád-Csanád", "Szabolcs-Szatmár-Bereg", "Jász-Nagykun-Szolnok"],
        Heves: ["Borsod-Abaúj-Zemplén", "Jász-Nagykun-Szolnok", "Pest", "Nógrád"],
        "Jász-Nagykun-Szolnok": ["Békés", "Hajdú-Bihar", "Szabolcs-Szatmár-Bereg", "Heves", "Nógrád", "Pest"],
        "Komárom-Esztergom": ["Győr-Moson-Sopron", "Veszprém", "Pest", "Fejér"],
        Nógrád: ["Heves", "Jász-Nagykun-Szolnok", "Pest", "Vas"],
        Pest: ["Bács-Kiskun", "Baranya", "Fejér", "Győr-Moson-Sopron", "Komárom-Esztergom", "Jász-Nagykun-Szolnok", "Nógrád", "Vas", "Veszprém"],
        Somogy: ["Bács-Kiskun", "Baranya", "Fejér", "Tolna", "Veszprém"],
        "Szabolcs-Szatmár-Bereg": ["Békés", "Csongrád-Csanád", "Hajdú-Bihar", "Jász-Nagykun-Szolnok"],
        Tolna: ["Bács-Kiskun", "Baranya", "Fejér", "Somogy"],
        Vas: ["Bács-Kiskun", "Győr-Moson-Sopron", "Komárom-Esztergom", "Nógrád", "Pest"],
        Veszprém: ["Baranya", "Fejér", "Győr-Moson-Sopron", "Komárom-Esztergom", "Pest", "Somogy"],
        Zala: ["Baranya", "Győr-Moson-Sopron", "Veszprém"],
    };

    constructor() {
        this.router.get("/api/quizI", this.getRandomCountyStartingLetterQuestion);
        this.router.get("/api/nonNeighboringCounties", this.getNonNeighboringCountiesQuestion);
    }

    private getNonNeighboringCounties = (countyName: string): { answers: string[]; question: string; solution: string } => {
        const allCounties = Object.keys(this.countiesNeighbors);
        const neighboringCounties = this.countiesNeighbors[countyName];

        const nonNeighboringCounties = allCounties.filter(county => !neighboringCounties.includes(county) && county !== countyName);

        const randomNonNeighbors = this.shuffleArray(nonNeighboringCounties).slice(0, 2);

        while (randomNonNeighbors.length < 2) {
            const additional = this.shuffleArray(nonNeighboringCounties).slice(0, 1);
            randomNonNeighbors.push(...additional);
        }

        const answers = randomNonNeighbors.concat(neighboringCounties.slice(0, 2));
        this.shuffleArray(answers);

        const question = `Melyik két vármegye nem szomszédos ${countyName} vármegyével?`;

        const solution = randomNonNeighbors.join(", ");

        return { answers, question, solution };
    };

    private getNonNeighboringCountiesQuestion = (req: Request, res: Response) => {
        try {
            const counties = Object.keys(this.countiesNeighbors);
            const randomCounty = counties[Math.floor(Math.random() * counties.length)];

            const { answers, question, solution } = this.getNonNeighboringCounties(randomCounty);

            const quizQuestion: IResponse = {
                answers: answers,
                question: question,
                solution: solution,
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

    private shuffleArray(array: string[]): string[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
