import { IController } from "#interfaces.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        // Create express application:
        this.app = express();
        // Connect to the database:
        this.connectToTheDatabase();
        // Parse incoming requests with JSON payloads:
        this.app.use(express.json());
        // Enabled CORS:
        this.app.use(cors());
        // morgan logger:
        this.app.use(morgan("dev"));

        // Add controllers to the app:
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    public listen(): void {
        this.app.listen(process.env.PORT ?? 5001, () => {
            console.log(`App listening on the port ${process.env.PORT ?? "5001"}`);
        });
    }

    private connectToTheDatabase() {
        mongoose.set("strictQuery", true); // for disable Deprecation Warning
        const { MONGO_DB, MONGO_URI } = process.env;

        mongoose.connect(MONGO_URI ?? "http://localhost:27017", { dbName: MONGO_DB ?? "dbs" }).catch((error: unknown) => {
            if (error instanceof Error) {
                console.log(`Mongoose error on connection! Message: ${error.message}`);
            } else {
                console.log("Mongoose error on connection!");
            }
        });
        // mongoose.connect("mongodb://127.0.0.1:27017/AdatbázisNeve").catch(() => console.log("Unable to connect to the server. Please start MongoDB."));

        mongoose.connection.on("error", (error: unknown) => {
            if (error instanceof Error) {
                console.log(`Mongoose error message: ${error.message}`);
            } else {
                console.log("Mongoose error!");
            }
        });
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB server.");
            this.listen();
        });
    }
}
