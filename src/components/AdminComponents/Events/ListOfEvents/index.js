import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// // Components
import EventsItem from "../EventsItem";

// Fields
import { PageMsg } from "fields";

class ListOfEvents extends Component {
  renderEvents = (events = []) =>
    events.map(eventInfo => {
      const { id } = eventInfo;
      return (
        <div className={Style.itemContainer} key={id}>
          <EventsItem
            eventID={id}
            eventInfo={eventInfo}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      );
    });

  render() {
    const { events } = this.props;
    console.log(events);
    if (Object.keys(events).length === 0)
      return <PageMsg>No Items Found</PageMsg>;
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderEvents(events)}
      </div>
    );
  }
}

export default ListOfEvents;

ListOfEvents.propTypes = {
  events: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfEvents.defaultProps = {
  events: {}
};
