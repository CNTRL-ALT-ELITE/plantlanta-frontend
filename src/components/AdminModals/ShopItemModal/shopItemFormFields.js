import React, { Component } from "react";
import PropTypes from "prop-types";
import * as immutable from "object-path-immutable";

// Style
import Style from "../style.module.scss";

// Fields
import { Button, TextInput } from "fields";
import Select from "react-select";

const NEW_EVENT_FIELDS = [
  {
    fieldKind: "text",
    id: "name",
    label: "Name",
    placeholder: "White T-shirt",
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
    id: "price",
    label: "Price ($)",
    placeholder: "20",
    type: "number",
    required: true
  },
  {
    fieldKind: "text",
    id: "quantity",
    label: "Quantity",
    type: "number",
    required: true
  }
];

export default class ShopItemFormFields extends Component {
  state = {
    brands: [],
    designers: [],
    shopItemInfo: {
      name: "",
      description: "",
      price: ""
    },
    submitBtnStatus: "inactive"
  };

  componentDidMount() {
    const { price, quantity } = this.props.shopItemInfo;

    this.setState(
      {
        shopItemInfo: immutable
          .wrap(this.props.shopItemInfo)
          .set("price", `${price}`)
          .set("quantity", `${quantity}`)
          .value()
      },
      this.onGetButtonStatus
    );
    console.log(this.state.eventInfo);
  }

  // On action methods

  onGetButtonStatus = () => {
    console.log(this.state);
    const { name, price } = this.state.shopItemInfo;

    name !== "" && price !== ""
      ? this.setState({ submitBtnStatus: "active" })
      : this.setState({ submitBtnStatus: "inactive" });
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      { shopItemInfo: immutable.set(this.state.shopItemInfo, fieldID, value) },
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
    const { fieldKind, id, options = {}, type = "text" } = field;
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
              value={this.state.shopItemInfo[id] || ""}
              type={type}
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
      default:
        return null;
    }
  };

  renderSubmitButton = () => {
    return (
      <Button
        className={Style.saveButton}
        name="Save"
        onClick={() => this.props.onSubmit(this.state.shopItemInfo)}
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

ShopItemFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  shopItemInfo: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  brands: PropTypes.array,
  designers: PropTypes.array
};

ShopItemFormFields.defaultProps = {
  isInEditMode: false,
  shopItemInfo: {
    name: "",
    description: "",
    ticketAvailability: "",
    eventDate: ""
  }
};
