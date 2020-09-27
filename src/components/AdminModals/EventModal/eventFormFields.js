import React, { Component } from "react";
import PropTypes from "prop-types";
import * as immutable from "object-path-immutable";

// Style
import Style from "../style.module.scss";

// Fields
import { Button, TextInput } from "fields";
import Select from "react-select";

// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NEW_EVENT_FIELDS = [
  {
    fieldKind: "text",
    id: "name",
    label: "Name",
    placeholder: "Eg. Tree plant drive",
    required: true
  },
  {
    fieldKind: "textarea",
    id: "description",
    label: "Description",
    placeholder: "Enter Description",
    required: false
  },
  {
    fieldKind: "text",
    id: "ticketAvailability",
    label: "Ticket Availability",
    placeholder: "Eg. Eventbrite",
    required: true
  },

  {
    fieldKind: "datepicker",
    id: "eventDate",
    label: "Event Date"
  }
];

export default class ApparelFormFields extends Component {
  state = {
    brands: [],
    designers: [],
    eventInfo: {
      name: "",
      description: "",
      ticketAvailability: "",
      eventDate: new Date()
    },
    submitBtnStatus: "inactive"
  };

  componentDidMount() {
    const eventDate = this.props.eventInfo.eventDate
      ? new Date(this.props.eventInfo.eventDate)
      : new Date();

    this.setState(
      {
        eventInfo: immutable.set(this.props.eventInfo, "eventDate", eventDate)
      },
      this.onGetButtonStatus
    );
    console.log(this.state.eventInfo);
  }

  // On action methods

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      name,
      description,
      ticketAvailability,
      eventDate
    } = this.state.eventInfo;

    name !== "" &&
    eventDate !== "" &&
    description !== "" &&
    ticketAvailability !== ""
      ? this.setState({ submitBtnStatus: "active" })
      : this.setState({ submitBtnStatus: "inactive" });
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      { eventInfo: immutable.set(this.state.eventInfo, fieldID, value) },
      this.onGetButtonStatus
    );
  };

  onChangeDatePicker = date => {
    this.setState(
      {
        eventInfo: immutable.set(this.state.eventInfo, "eventDate", date)
      },
      this.onGetButtonStatus
    );
  };

  //  render methods

  //   renderRadioButtons = (id, options) => {
  //     console.log(id);
  //     switch (id) {
  //       default:
  //         return this.renderDefaultRadioButtons(id, options);
  //     }
  //   };

  //   renderDefaultRadioButtons = (id, options) => {
  //     return Object.keys(options).map(optionID => {
  //       return (
  //         <div key={optionID} style={{ marginBottom: "10px" }}>
  //           <RadioButton
  //             checked={optionID === this.state.eventInfo[id]}
  //             id={optionID}
  //             label={options[optionID].label}
  //             onClick={() =>
  //               this.setState(
  //                 {
  //                   eventInfo: immutable.set(this.state.eventInfo, id, optionID)
  //                 },
  //                 this.onGetButtonStatus
  //               )
  //             }
  //           />
  //         </div>
  //       );
  //     });
  //   };

  renderField = (field = {}) => {
    const { fieldKind, id, options = {} } = field;
    switch (fieldKind) {
      case "radio":
        return (
          <div key={id}>
            <div>
              <h2>{field.label}</h2>
              {this.renderRadioButtons(id, options)}
            </div>
          </div>
        );
      case "text":
      case "textarea":
        return (
          <div key={id} style={{ marginBottom: "20px" }}>
            <TextInput
              {...field}
              hasMultipleLines={fieldKind === "textarea" ? true : false}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.eventInfo[id] || ""}
            />
          </div>
        );
      case "dropdown":
        return (
          <div key={id} style={{ marginBottom: "20px" }}>
            <h2>{field.label}</h2>
            {this.renderDropdown(id, options)}
          </div>
        );
      case "datepicker":
        return (
          <div key={id} style={{ marginBottom: "20px" }}>
            <h2>{field.label}</h2>
            <DatePicker
              selected={this.state.eventInfo[id] || ""}
              onChange={this.onChangeDatePicker}
            />
          </div>
        );
      default:
        return null;
    }
  };

  renderSubmitButton = () => {
    return (
      <Button
        className={Style.saveButton}
        name="Save"
        onClick={() => this.props.onSubmit(this.state.eventInfo)}
        status={this.state.submitBtnStatus}
      >
        {this.props.isInEditMode ? "Save" : "Create"}
      </Button>
    );
  };

  render() {
    return (
      <div>
        {NEW_EVENT_FIELDS.map(this.renderField)}
        {this.renderSubmitButton()}
      </div>
    );
  }
}

ApparelFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  eventInfo: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  brands: PropTypes.array,
  designers: PropTypes.array
};

ApparelFormFields.defaultProps = {
  brands: [],
  designers: [],
  isInEditMode: false,
  eventInfo: {
    name: "",
    description: "",
    ticketAvailability: "",
    eventDate: ""
  }
};
