import { Router } from "express";

export interface IController {
    router: Router;
}

export interface IResponse {
    answers: string[];
    question: string;
    solution: string;
}
