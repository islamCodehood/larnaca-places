import React from "react";

function InfoWindow(props) {
  return (
    <div>
      <img src={props.bestPhoto} alt="" />
      <div id="title">
        <h2>{props.title}</h2>
      </div>
      <div id="info">
        <div id="category">
          <span>{props.category}</span>
        </div>
        <div id="location">
          <span>Location </span> {props.address}
        </div>
        <div id="likes">
          <span>Likes </span> {props.likes}
        </div>
        <div id="rating">
          <span id="rating-title">Rating </span>{" "}
          <span id="ratingColor" style={{ background: `${props.ratingColor}` }}>
            {props.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InfoWindow;
