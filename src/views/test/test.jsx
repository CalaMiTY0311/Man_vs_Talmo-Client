import React from "react";
import PropTypes from "prop-types";

// core components
import Header from "../../components/header/header.jsx";

// bald components
import Baldform from "./sections/baldtest-form.jsx";


const Test = () => {
    return (
        <div id="main-wrapper">
            <Header />
            <div className="page-wrapper">
                <div className="container-fluid">
                    <Baldform />
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

Test.propTypes = {
    classes: PropTypes.object
};

export default Test;
