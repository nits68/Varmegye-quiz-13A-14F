import App from "../app";
import { quizA1Controller } from "./quizA1.controller";
import { config } from "dotenv";

config();

new App([
    new quizA1Controller(),
]);
