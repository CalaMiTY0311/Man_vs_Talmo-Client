import React from "react";
import "./assets/scss/style.scss";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from "history";
import {
  Route,
  Routes,
  //Link,
  BrowserRouter
} from "react-router-dom";
// import Components from "./views/components/components.jsx";
// import CustomComponents from "./views/custom-components/custom-components.jsx";
import Main from "./views/main/main.jsx";
import Test from "./views/test/test.jsx";
import Result from "./views/bald_result/bald_result.jsx";

// import RouteChangeTracker from "./RouteChangeTracker";

import ReactGA from "react-ga4";

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
ReactGA.send("pageview");

const root = ReactDOM.createRoot(document.getElementById('root'));

var hist = createBrowserHistory();
root.render(
  <BrowserRouter history={hist}>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/test" element={<Test/>}/>
       
      <Route path="/result" element={<Result />}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
