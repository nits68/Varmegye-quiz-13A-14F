import App from "./app";
import { countryController } from "./country.controller";
import { cityController } from "./city.controller";
import { countyController } from "./county.controller";

new App([new countryController(), new cityController(), new countyController()]);
