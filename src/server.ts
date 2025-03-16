import App from "./app";
import { countryController } from "./country.controller";
import { countyController } from "./county.controller";

new App([new countryController(), new countyController()]);
