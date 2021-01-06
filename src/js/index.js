import store from "./store/index";
import { addBasicBoardAction, tickAction } from "./actions/index";

window.store = store;
window.addBasicBoardAction = addBasicBoardAction;
window.tickAction = tickAction;