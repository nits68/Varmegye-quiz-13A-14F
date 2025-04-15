import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { ICounty } from "#county.interface.js";
import { countyModel } from "#county.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupFcontroller implements IController {
    public router = Router();
    private cities = cityModel;
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizF1", this.question1);
        this.router.get("/api/quizF2", this.question2);
    }

    // 1. A felsorolt városok közül melyik nem tartozik egy vármegyébe?
    private question1 = async (req: Request, res: Response) => {
        try {
            const counties: ICounty[] = await this.counties.find();
            const randomCounty = counties[Math.floor(Math.random() * counties.length)];
            const cityIds = randomCounty.largest_cities ?? [];
            const cities: ICity[] = await this.cities.find({ _id: { $in: cityIds } });
            const correctCities = this.shuffleArray(cities).slice(0, 3);

            const otherCounties = counties.filter(
                c => c._id !== randomCounty._id && (c.largest_cities?.length ?? 0) > 0,
            );
            const randomOtherCounty = otherCounties[Math.floor(Math.random() * otherCounties.length)];
            const otherCityId = randomOtherCounty.largest_cities?.[0];
            const otherCity = await this.cities.findOne({ _id: otherCityId });

            const allCities = [...correctCities, otherCity].filter((c): c is ICity => c !== null).map(c => c.name);
            this.shuffleArray(allCities);

            const solution = otherCity?.name ?? "";

            const question: IResponse = {
                question: "A felsorolt városok közül melyik nem tartozik egy vármegyébe?",
                answers: allCities,
                solution,
            };
            res.status(200).send(question);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Ismeretlen hiba történt." });
            }
        }
    };

    // 2. A felsoroltak közül melyik vármegyének van a legkevesebb vármegye szomszédja?
    private question2 = async (req: Request, res: Response) => {
        try {
            const counties: ICounty[] = await this.counties.find();
            const sorted = [...counties].sort(
                (a, b) => (a.neighboring_counties?.length ?? 0) - (b.neighboring_counties?.length ?? 0),
            );
            const correctCounty = sorted[0];
            const wrongCounties = this.shuffleArray(sorted.slice(1)).slice(0, 3);
            const answers = this.shuffleArray([correctCounty.name, ...wrongCounties.map(c => c.name)]);
            const question: IResponse = {
                question: "A felsoroltak közül melyik vármegyének van a legkevesebb vármegye szomszédja?",
                answers,
                solution: correctCounty.name,
            };
            res.status(200).send(question);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Ismeretlen hiba történt." });
            }
        }
    };

    private shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}
