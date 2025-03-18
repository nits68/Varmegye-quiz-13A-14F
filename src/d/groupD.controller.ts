import { ICity } from "#city.interface.js";
import { cityModel } from "#city.model.js";
import { IController, IResponse } from "#interfaces.js";
import { Request, Response, Router } from "express";

export class groupDController implements IController {
    public router = Router();
    private cities = cityModel;

    constructor() {
        this.router.get("/api/quizD1", this.getquizD);
    }

    private getquizD = async (req: Request, res: Response) => {
        try {
            const data: ICity[] = await this.cities.find();
            data.sort((a, b) => a.population - b.population);
    
            const minPopulation: number = (Math.trunc((data[2].population) / 1000) + 1) * 1000;
            const maxPopulation: number = (Math.trunc((data[data.length - 2].population) / 1000)) * 1000;
            const step = 1000;
            
            let randomPopulation: number = Math.floor(Math.random() * (((maxPopulation - minPopulation) / step) + 1)) * step + minPopulation;
    
            let falseDatas: ICity[] = data.filter(d => d.population < randomPopulation);
            let trueDatas: ICity[] = data.filter(d => d.population >= randomPopulation);
    
            let correctCity = trueDatas[Math.floor(Math.random() * trueDatas.length)];
    
            let falseCities = falseDatas.sort(() => Math.random() - 0.5).slice(0, 3);
    
            let allCities = [...falseCities, correctCity];
            allCities = allCities.sort(() => Math.random() - 0.5);
    
            let response: IResponse = {
                question: `A(z) ${randomPopulation} fős népességet melyik város éri el?`,
                answers: allCities.map(city => city.name),
                solution: correctCity.name
            }
    
            res.status(200).send(response);
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };
}
