import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { ICountyFull } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupDController implements IController {
    public router = Router();
    private cities = cityModel;
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizD1", this.getquizD1);
        this.router.get("/api/quizD2", this.getquizD2);
    }

    private getquizD1 = async (req: Request, res: Response) => {
        try {
            const data: ICity[] = await this.cities.find();
            data.sort((a, b) => a.population - b.population);

            const minPopulation: number = (Math.trunc(data[2].population / 1000) + 1) * 1000;
            const maxPopulation: number = Math.trunc(data[data.length - 2].population / 1000) * 1000;
            const step = 1000;

            const randomPopulation: number =
                Math.floor(Math.random() * ((maxPopulation - minPopulation) / step + 1)) * step + minPopulation;

            const falseDatas: ICity[] = data.filter(d => d.population < randomPopulation);
            const trueDatas: ICity[] = data.filter(d => d.population >= randomPopulation);

            const correctCity: ICity = trueDatas[Math.floor(Math.random() * trueDatas.length)];

            const falseCities: ICity[] = falseDatas.sort(() => Math.random() - 0.5).slice(0, 3);

            let allCities: ICity[] = [...falseCities, correctCity];
            allCities = allCities.sort(() => Math.random() - 0.5);

            const response: IResponse = {
                answers: allCities.map(city => city.name),
                question: `A(z) ${randomPopulation} fős népességet melyik város éri el?`,
                solution: correctCity.name,
            };

            res.status(200).send(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };

    private getquizD2 = async (req: Request, res: Response) => {
        try {
            const counties: ICountyFull[] = await this.counties.find({}, "-_id").lean();

            const populatedCounties = counties.filter(c => typeof c.seat_id === "number");

            const county = populatedCounties[Math.floor(Math.random() * populatedCounties.length)];

            const seatCity = await this.cities.findOne({ _id: county.seat_id });
            if (!seatCity) {
                throw new Error("Székhely nem található.");
            }

            const percentage = +((seatCity.population / county.population) * 100).toFixed(1);

            const falseAnswers: number[] = [];
            while (falseAnswers.length < 3) {
                const deviation = Math.random() * 20 - 10;
                const fake = +(percentage + deviation).toFixed(1);
                if (fake > 0 && fake !== percentage && !falseAnswers.includes(fake)) {
                    falseAnswers.push(fake);
                }
            }

            const allAnswers = [...falseAnswers, percentage].sort(() => Math.random() - 0.5);

            const response: IResponse = {
                question: `A(z) ${county.name} vármegye székhelyének (${seatCity.name}) lakossága hány százalékát teszi ki a vármegye teljes lakosságának?`,
                answers: allAnswers.map(p => `${p}%`),
                solution: `${percentage}%`,
            };

            res.status(200).send(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "Ismeretlen hiba történt." });
            }
        }
    };
}
