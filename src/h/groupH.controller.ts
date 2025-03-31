import { Request, Response, Router } from "express";
import mongoose from "mongoose";


const CitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    population: { type: Number, required: true },
    county: { type: String, required: true },
});

const CityModel = mongoose.model("City", CitySchema);

export class CityPopulationController {
    public router = Router();

    constructor() {
        this.router.get("/api/nthMostPopulatedCity", this.getNthMostPopulatedCity);
    }

  private getNthMostPopulatedCity = async (req: Request, res: Response) => {
      try {
          const n = parseInt(req.query.n as string, 10);

            if (isNaN(n) || n <= 0) {
                res.status(400).send({ message: "Csak pozitív számot adhat meg" });
                return;
            }

            const cities = await CityModel.find({ county: { $ne: "Pest" } })
                .sort({ population: -1 }) 
                .exec();

            if (n > cities.length) {
                res.status(404).send({ message: `Csak ${cities.length} város érhető el pest kivételével `});
                return;
            }

            const nthCity = cities[n - 1];

            res.status(200).send({
                question: `Melyik a  ${n}. legnépesebb város Pest kivételével`,
                solution: nthCity.name,
                details: nthCity,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: "Hiba" });
            }
        }
    };
}
