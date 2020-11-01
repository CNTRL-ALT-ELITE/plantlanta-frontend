import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// // Components
import ShopItem from "../ShopItem";

// Fields
import { PageMsg } from "fields";

class ListOfShopItems extends Component {
  renderShopItems = (shopItems = []) =>
    shopItems.map(shopItemInfo => {
      const { id } = shopItemInfo;
      return (
        <div className={Style.itemContainer} key={id}>
          <ShopItem
            shopItemID={id}
            shopItemInfo={shopItemInfo}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      );
    });

  render() {
    const { shopItems } = this.props;
    console.log(shopItems);
    if (Object.keys(shopItems).length === 0)
      return <PageMsg>No Items Found</PageMsg>;
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderShopItems(shopItems)}
      </div>
    );
  }
}

export default ListOfShopItems;

ListOfShopItems.propTypes = {
  shopItems: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfShopItems.defaultProps = {
  shopItems: {}
};
