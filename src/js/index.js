import store from "./store/index";
import { addBasicBoardAction, tickAction, updateBoardSettingsAction } from "./actions/index";

window.store = store;
window.addBasicBoardAction = addBasicBoardAction;
window.tickAction = tickAction;
window.updateBoardSettingsAction = updateBoardSettingsAction;
