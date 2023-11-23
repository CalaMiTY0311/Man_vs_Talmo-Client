import React from "react";
import PropTypes from "prop-types";

// core components
import Header from "../../components/header/header.jsx";

// bald components
import Result from "./sections/result.jsx";


const Predict_Result = () => {
    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    <Result />
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

Predict_Result.propTypes = {
    classes: PropTypes.object
};

export default Predict_Result;
