import React from "react";

//The component that appears only when request of google maps fails
function FailedMapRequest() {
    return (
        <div className="failed-map-request">
            <div id="sad-face">:(</div>
            <div className="failure-message">Map is not available now. Please, <a href="localhost:3000">try again</a> in a minute or two.</div>
            <br/>
            <address className="failure-message">If The problem presists, please <a href="mailto:islam.sayed8@gmail.com">contact me</a>.</address>
        </div>
    )
}

export default FailedMapRequest