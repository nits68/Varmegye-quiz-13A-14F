import { countyModel } from '#county.model.js';
import { IController, IResponse } from '#interfaces.js';
import { ICounty } from '#county.interface.js';
import { Request, Response, Router } from "express";

export class groupBController implements IController{
    public router = Router();
    private counties = countyModel;

    constructor(){
        this.router.get("/api/quizB1", this.getGroupBQuiz1);
    }

    private getGroupBQuiz1 = async (req: Request, res: Response) => {
        try {
            const data: ICounty[] = await this.counties.find();
            data.sort((a, b) => a.population - b.population);

            const correctCounty = data[Math.floor(Math.random() * data.length)];
            const wrongAnswers = data
                .filter(county => county.name !== correctCounty.name && county.region !== correctCounty.region)
                .reduce((uniqueRegions, county) => {
                    if (!uniqueRegions.some(region => region === county.region)) {
                        uniqueRegions.push(county.region);
                    }
                    return uniqueRegions;
                }, [] as string[])
                .slice(0, 3)

            const question: IResponse = {
                question: `${correctCounty.name} vármegye melyik régióban található?`,
                answers: [...wrongAnswers.map(county => county), correctCounty.region]
                    .sort(() => 0.5 - Math.random()),
                solution: correctCounty.region
            };

            res.status(200).send(question);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(400).send({ message: "An unknown error occurred" });
            }
        }
    };
}