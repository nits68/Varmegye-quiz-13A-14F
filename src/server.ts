import App from "#app.js";
import { cityController } from "#city.controller.js";
import { countryController } from "#country.controller.js";
import { countyController } from "#county.controller.js";
import { groupDController } from "#d/groupD.controller.js";

new App([new countryController(), new cityController(), new countyController(), new groupDController]);
