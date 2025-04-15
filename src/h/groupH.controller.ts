import { cityModel } from "#city.model.js";
import { countyModel } from "#county.model.js";
import { ICity } from "#city.interface.js";
import { ICounty, IResponse, IController } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupHcontroller implements IController {
    public router = Router();
    private cities = cityModel;
    private counties = countyModel;

    constructor() {
        this.router.get("/api/quizH1", this.getTopNCityExcludingPestQuestion);
        this.router.get("/api/quizH2", this.getLargestAreaCityQuestion);
    }

    private getTopNCityExcludingPestQuestion = async (req: Request, res: Response) => {
        try {
            const n = parseInt((req.query.n as string) ?? "1", 10);

            if (isNaN(n) || n < 1) {
                res.status(400).send({ message: "Az N értéke nem megfelelő." });
                return;
            }

            const [allCities, allCounties]: [ICity[], ICounty[]] = await Promise.all([
                this.cities.find(),
                this.counties.find(),
            ]);

            const pestCounty = allCounties.find(county => county._id === 13);
            const pestCityIds = pestCounty?.largest_cities ?? [];

            const filteredCities = allCities
                .filter(city => !pestCityIds.includes(city._id))
                .sort((a, b) => b.population - a.population);

            if (n > filteredCities.length) {
                res.status(404).send({
                    message: `N túl nagy. Csak ${filteredCities.length} város van Pest megyén kívül ebben a listában.`,
                });
                return;
            }

            const selectedCity = filteredCities[n - 1];
            const incorrectOptions = this.getIncorrectOptionsGeneral(allCities, selectedCity.name, 3);
            const allAnswers = this.shuffleArray([selectedCity.name, ...incorrectOptions]);
            const quiz: IResponse = {
                question: `Pest megye kivételével melyik a(z) ${n}. legnépesebb magyar város?`,
                answers: allAnswers,
                solution: selectedCity.name,
            };

            res.status(200).send(quiz);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Ismeretlen hiba történt." });
            }
        }
    };

    private getLargestAreaCityQuestion = async (req: Request, res: Response) => {
        try {
            const allCities: ICity[] = await this.cities.find();
            if (allCities.length < 4) {
                res.status(500).send({ message: "Nincs elég város az adatbázisban a kérdés generálásához." });
                return;
            }
            const options = this.getRandomCities(allCities, 4);
            let largestAreaCity = options[0];
            for (let i = 1; i < options.length; i++) {
                const currentArea = options[i].area ?? 0;
                const largestArea = largestAreaCity.area ?? 0;
                if (currentArea > largestArea) {
                    largestAreaCity = options[i];
                }
            }

            const answerNames = options.map(city => city.name);

            const shuffledAnswers = this.shuffleArray(answerNames);
            const quiz: IResponse = {
                question: "Melyik város rendelkezik a legnagyobb területtel a következők közül?",
                answers: shuffledAnswers,
                solution: largestAreaCity.name,
            };

            res.status(200).send(quiz);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Ismeretlen hiba történt a legnagyobb területű város kérdésnél." });
            }
        }
    };

    // --- SEGÉDFÜGGVÉNYEK ---

    private getIncorrectOptionsGeneral(cities: ICity[], correctName: string, count: number): string[] {
        return cities
            .filter(city => city.name !== correctName)
            .sort(() => 0.5 - Math.random())
            .slice(0, count)
            .map(city => city.name);
    }

    private getRandomCities(cities: ICity[], count: number): ICity[] {
        const shuffled = [...cities].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }
    private getIncorrectOptions(cities: ICity[], correctName: string): string[] {
        return this.getIncorrectOptionsGeneral(cities, correctName, 3);
    }
}
