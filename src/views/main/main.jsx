import React from "react";
import PropTypes from "prop-types";

// core components
import Header from "../../components/header/header.jsx";
import Home from "./sections/home.jsx";

const Main = () => {
    return (
        <div>
            <Header />
            <br /><br /><br />
            <Home /> 
        </div>
    );
}

Main.propTypes = {
    classes: PropTypes.object
};

export default Main;
