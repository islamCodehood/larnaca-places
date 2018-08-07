import React from "react";

//The component that appears only when request of foursquare fails
function FailedRequest() {
  return (
    <div className="failed-request" tabIndex="-1">
      <div className="sad-face">:(</div>
      <div className="failure-message">
        No data available now. Please, <a href="localhost:3000">try again</a> in
        a minute or two.
      </div>
    </div>
  );
}

export default FailedRequest;
