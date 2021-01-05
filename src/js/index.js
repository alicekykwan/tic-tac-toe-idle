import store from "./store/index";
import { addBasicBoard, doOneTickForAllBoards } from "./actions/index";

window.store = store;
window.addBasicBoard = addBasicBoard;
window.doOneTickForAllBoards = doOneTickForAllBoards;