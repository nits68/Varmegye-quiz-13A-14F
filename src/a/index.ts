import App from "../app";
import { quizA1Controller } from "./groupA.controller";
import { config } from "dotenv";

config();

new App([
    new quizA1Controller(),
]);
