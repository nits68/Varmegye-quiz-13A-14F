import App from "#app.js";
import { groupBController } from "#b/groupB.controller.js";
import { groupCController } from "#c/groupC.controller.js";
import { cityController } from "#city.controller.js";
import { countryController } from "#country.controller.js";
import { countyController } from "#county.controller.js";
import { GroupEController } from "#e/groupe.controller.js";
import { groupDController } from "#d/groupD.controller.js";
import { groupAcontroller } from "#a/groupA.controller.js";


new App([new countryController(), new cityController(), new countyController(), new groupBController(), new groupCController(), new groupDController(),new GroupEController(),new groupAcontroller()]);
