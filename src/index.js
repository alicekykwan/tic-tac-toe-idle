import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store/index";
import App from "./js/components/App";
import './index.css';


render(
  <Provider store={store}>
    <App class="App" />
  </Provider>,
  document.getElementById("root")
);