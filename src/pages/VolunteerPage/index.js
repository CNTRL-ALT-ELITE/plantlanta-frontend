import React, { Component } from "react";

import MainNavBar from "../../components/MainNavBar";

const EVENTS = [
  {
    id: 1,
    label: "Tree planting Volunteer day",
    eventDate: "Tomorrow",
    imageURL:
      "https://scontent.fbdq2-1.fna.fbcdn.net/v/t1.0-9/71490313_447651909191344_2866158369566097408_o.jpg?_nc_cat=106&_nc_sid=a26aad&_nc_ohc=ABLS2UlNu6EAX9k2e4M&_nc_ht=scontent.fbdq2-1.fna&oh=0025ba5e83f13dab7e7887537d8e957d&oe=5EBF1BA5"
  },
  {
    id: 2,
    label: "This is Climate Change",
    eventDate: "March 11, 2020",
    imageURL:
      "https://scontent.fbdq2-1.fna.fbcdn.net/v/t1.0-9/68579540_421092755180593_8849763453229858816_o.jpg?_nc_cat=109&_nc_sid=730e14&_nc_ohc=YY0IpIknSz4AX8U3RTn&_nc_ht=scontent.fbdq2-1.fna&oh=fcf0080714b3543f7bf0d62f85bee798&oe=5EC04F92"
  },
  {
    id: 3,
    label: "Organic Farmer Market & Plant Sale",
    eventDate: "April 11, 2020",
    imageURL:
      "https://scontent.fbdq2-1.fna.fbcdn.net/v/t1.0-9/93034224_2775616329218588_4665360568322883584_n.jpg?_nc_cat=103&_nc_sid=340051&_nc_ohc=GHhRJ_ihCMMAX8hS-Fl&_nc_ht=scontent.fbdq2-1.fna&oh=56f7e876887e3b2f19e07b76fd608c55&oe=5EC22DCF"
  }
];

export default class VolunteerPage extends Component {
  renderEvent = event => (
    <div
      style={{
        marginRight: "100px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h4>{event.label}</h4>
      <p style={{ marginBottom: "15px" }}>{event.eventDate}</p>
      <img
        src={event.imageURL}
        style={{ width: "250px", height: "200px", objectFit: "fill" }}
      />
      <button
        style={{
          background: "#3AAFA9",
          width: "100px",
          height: "30px",
          marginTop: "30px"
        }}
      >
        View Event
      </button>
    </div>
  );
  render() {
    return (
      <div>
        <MainNavBar />
        <div style={{ height: "100vh", background: "rgb(27, 33, 38)" }}>
          <h1 style={{ color: "white", padding: "2em 1em", margin: "0" }}>
            Upcoming Events
          </h1>
          <div style={{ display: "flex", margin: "20px", padding: "1em" }}>
            {EVENTS.map(this.renderEvent)}
          </div>
        </div>
      </div>
    );
  }
}
