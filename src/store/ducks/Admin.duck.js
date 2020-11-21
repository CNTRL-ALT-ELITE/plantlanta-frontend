import { createActionTypes } from "../lib";
import { fetchGraphQL } from "constants/graphql";
import * as immutable from "object-path-immutable";

import axios from "axios";

const duckName = "ADMIN";

const actionTypes = createActionTypes(
  {
    ADMIN_SIGNIN_REQUEST: "ADMIN_SIGNIN_REQUEST",
    ADMIN_SIGNIN_SUCCESS: "ADMIN_SIGNIN_SUCCESS",
    ADMIN_SIGNIN_ERROR: "ADMIN_SIGNIN_ERROR",

    GET_EVENTS_REQUEST: "GET_EVENTS_REQUEST",
    GET_EVENTS_SUCCESS: "GET_EVENTS_SUCCESS",
    GET_EVENTS_ERROR: "GET_EVENTS_ERROR",

    GET_SHOP_ITEMS_REQUEST: "GET_SHOP_ITEMS_REQUEST",
    GET_SHOP_ITEMS_SUCCESS: "GET_SHOP_ITEMS_SUCCESS",
    GET_SHOP_ITEMS_ERROR: "GET_SHOP_ITEMS_ERROR",

    GET_ORDERS_REQUEST: "GET_ORDERS_REQUEST",
    GET_ORDERS_SUCCESS: "GET_ORDERS_SUCCESS",
    GET_ORDERS_ERROR: "GET_ORDERS_ERROR",

    CREATE_NEW_EVENT_REQUEST: "CREATE_NEW_EVENT_REQUEST",
    CREATE_NEW_EVENT_SUCCESS: "CREATE_NEW_EVENT_SUCCESS",
    CREATE_NEW_EVENT_ERROR: "CREATE_NEW_EVENT_ERROR",
    UPDATE_EXISTING_EVENT_REQUEST: "UPDATE_EXISTING_EVENT_REQUEST",
    UPDATE_EXISTING_EVENT_SUCCESS: "UPDATE_EXISTING_EVENT_SUCCESS",
    UPDATE_EXISTING_EVENT_ERROR: "UPDATE_EXISTING_EVENT_ERROR",
    REMOVE_EXISTING_EVENT_REQUEST: "REMOVE_EXISTING_EVENT_REQUEST",
    REMOVE_EXISTING_EVENT_SUCCESS: "REMOVE_EXISTING_EVENT_SUCCESS",
    REMOVE_EXISTING_EVENT_ERROR: "REMOVE_EXISTING_EVENT_ERROR",
    UPDATE_EVENT_IMAGE_REQUEST: "UPDATE_EVENT_IMAGE_REQUEST",
    UPDATE_EVENT_IMAGE_SUCCESS: "UPDATE_EVENT_IMAGE_SUCCESS",
    UPDATE_EVENT_IMAGE_ERROR: "UPDATE_EVENT_IMAGE_ERROR",
    UPDATE_EVENT_ADDITIONAL_IMAGES_REQUEST:
      "UPDATE_EVENT_ADDITIONAL_IMAGES_REQUEST",
    UPDATE_EVENT_ADDITIONAL_IMAGES_SUCCESS:
      "UPDATE_EVENT_ADDITIONAL_IMAGES_SUCCESS",
    UPDATE_EVENT_ADDITIONAL_IMAGES_ERROR:
      "UPDATE_EVENT_ADDITIONAL_IMAGES_ERROR",

    CREATE_NEW_SHOP_ITEM_REQUEST: "CREATE_NEW_SHOP_ITEM_REQUEST",
    CREATE_NEW_SHOP_ITEM_SUCCESS: "CREATE_NEW_SHOP_ITEM_SUCCESS",
    CREATE_NEW_SHOP_ITEM_ERROR: "CREATE_NEW_SHOP_ITEM_ERROR",
    UPDATE_EXISTING_SHOP_ITEM_REQUEST: "UPDATE_EXISTING_SHOP_ITEM_REQUEST",
    UPDATE_EXISTING_SHOP_ITEM_SUCCESS: "UPDATE_EXISTING_SHOP_ITEM_SUCCESS",
    UPDATE_EXISTING_SHOP_ITEM_ERROR: "UPDATE_EXISTING_SHOP_ITEM_ERROR",
    REMOVE_EXISTING_SHOP_ITEM_REQUEST: "REMOVE_EXISTING_SHOP_ITEM_REQUEST",
    REMOVE_EXISTING_SHOP_ITEM_SUCCESS: "REMOVE_EXISTING_SHOP_ITEM_SUCCESS",
    REMOVE_EXISTING_SHOP_ITEM_ERROR: "REMOVE_EXISTING_SHOP_ITEM_ERROR",
    UPDATE_SHOP_ITEM_IMAGE_REQUEST: "UPDATE_SHOP_ITEM_IMAGE_REQUEST",
    UPDATE_SHOP_ITEM_IMAGE_SUCCESS: "UPDATE_SHOP_ITEM_IMAGE_SUCCESS",
    UPDATE_SHOP_ITEM_IMAGE_ERROR: "UPDATE_SHOP_ITEM_IMAGE_ERROR"
  },
  duckName
);

const initialState = {
  isSigningIn: false,
  events: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false
  },
  shopItems: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false
  },
  orders: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false
  }
};

const adminSignIn = password => dispatch => {
  dispatch(adminSignInRequest);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                adminSignIn(password:  "${password}")
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.adminSignIn) {
          dispatch(adminSignInSuccess);
          resolve({
            success: true
          });
        } else {
          dispatch(adminSignInError);
          resolve({
            success: false
          });
        }
      })
      .catch(err => {
        dispatch(adminSignInError);
        resolve({
          success: false
        });
      });
  });
};

// ------------------> EVENTS

const createEventWithInputType = () => {
  return `
      mutation($event: EventInput!, ) {
              createNewEvent(event: $event) {
                  name
                  id
              }
          }
      `;
};

const createNewEvent = event => dispatch => {
  dispatch(createNewEventRequest());
  console.log(event);

  return new Promise((resolve, reject) => {
    fetchGraphQL(createEventWithInputType(), undefined, {
      event
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.createNewEvent !== null &&
          res.createNewEvent !== undefined
        ) {
          dispatch(createNewEventSuccess());
          resolve({ created: true, message: "Created Event Successfully" });
        } else {
          dispatch(createNewEventError());
          resolve({ created: false, message: "Failed to Create Event" });
        }
      })
      .catch(err => {
        dispatch(createNewEventError(err.response));
        resolve({ created: false, message: "Failed to Create Event" });
      });
  });
};

const updateEventWithInputType = () => {
  return `
      mutation($event: EventInput!, $id: ID!) {
              updateExistingEvent(event: $event, id: $id) 
          }
      `;
};

const updateExistingEvent = event => dispatch => {
  dispatch(updateExistingEventRequest());
  const { id, name, description, ticketAvailability, eventDate } = event;

  const eventInfo = immutable
    .wrap({})
    .set("name", name)
    .set("description", description)
    .set("ticketAvailability", ticketAvailability)
    .set("eventDate", eventDate)
    .value();

  return new Promise((resolve, reject) => {
    fetchGraphQL(updateEventWithInputType(), undefined, {
      event: eventInfo,
      id
    })
      .then(res => {
        if ((res !== null) & (res !== undefined) && res.updateExistingEvent) {
          dispatch(updateExistingEventSuccess());
          resolve({ updated: true, message: "Updated Event Successfully" });
        } else {
          dispatch(updateExistingEventError("Could Not Update Event"));
          resolve({ updated: false, message: "Failed to update Event" });
        }
      })
      .catch(err => {
        dispatch(updateExistingEventError(err.response));
        resolve({ updated: false, message: "Failed to update Event" });
      });
  });
};

const removeExistingEvent = event => dispatch => {
  dispatch(removeExistingEventRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          mutation {
              removeExistingEvent(id: "${event.id}")
          }
      `)
      .then(res => {
        if (res !== null && res !== undefined && res.removeExistingEvent) {
          dispatch(removeExistingEventSuccess());
          resolve({ deleted: true, message: "Deleted Event Successfully" });
        } else {
          dispatch(removeExistingEventError("Could Not Remove Event"));
          resolve({ deleted: false, message: "Failed to delete Event" });
        }
      })
      .catch(err => {
        dispatch(removeExistingEventError(err.response));
        resolve({ deleted: false, message: "Failed to delete Event" });
      });
  });
};

const updateEventImage = (imageURL, event) => dispatch => {
  dispatch(updateEventImageRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          mutation {
              updateEventImage(id: "${event.id}", imageURL: "${imageURL}")
          }    
      `)
      .then(res => {
        if (res !== null && res !== undefined && res.updateEventImage) {
          dispatch(updateEventImageSuccess());
          resolve({
            updated: true,
            message: "Updated Event Image Successfully"
          });
        } else {
          dispatch(updateEventImageFailure("Could Not Update Event Image"));
          resolve({
            updated: false,
            message: "Failed to update Event Image"
          });
        }
      })
      .catch(err => {
        dispatch(updateEventImageFailure(err.response));
        resolve({ updated: false, message: "Failed to update Event Image" });
      });
  });
};

const updateEventImagesWithInput = () => {
  return `
  mutation($id: ID!, $imageURLs: [String!]!) {
      updateEventAdditionalImages(id: $id, imageURLs: $imageURLs)
  }
  `;
};

const updateEventAdditionalImages = (imageURLs, eventInfo) => dispatch => {
  console.log(imageURLs);
  dispatch(updateEventAdditionalImagesRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(updateEventImagesWithInput(), undefined, {
      id: eventInfo.id,
      imageURLs
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.updateEventAdditionalImages
        ) {
          dispatch(updateEventAdditionalImagesSuccess());
          resolve({
            updated: true,
            message: "Updated Event Image Successfully"
          });
        } else {
          dispatch(
            updateEventAdditionalImagesFailure("Could Not Update Event Image")
          );
          resolve({
            updated: false,
            message: "Failed to update Event Image"
          });
        }
      })
      .catch(err => {
        dispatch(updateEventAdditionalImagesFailure(err.response));
        resolve({ updated: false, message: "Failed to update Event Image" });
      });
  });
};

// Shop

const createShopItemWithInputType = () => {
  return `
      mutation($shopItem: ShopItemInput!, ) {
              createNewShopItem(shopItem: $shopItem) {
                  name
                  id
              }
          }
      `;
};

const createNewShopItem = shopItem => dispatch => {
  dispatch(createNewShopItemRequest());
  // console.log(event);

  const { id, name, description, price, quantity } = shopItem;

  const shopItemInfo = immutable
    .wrap({})
    .set("name", name)
    .set("description", description)
    .set("price", parseInt(price))
    .set("quantity", parseInt(quantity))
    .value();

  console.log(shopItemInfo);

  return new Promise((resolve, reject) => {
    fetchGraphQL(createShopItemWithInputType(), undefined, {
      shopItem: shopItemInfo
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.createNewShopItem !== null &&
          res.createNewShopItem !== undefined
        ) {
          dispatch(createNewShopItemSuccess());
          resolve({ created: true, message: "Created ShopItem Successfully" });
        } else {
          dispatch(createNewShopItemError());
          resolve({ created: false, message: "Failed to Create ShopItem" });
        }
      })
      .catch(err => {
        dispatch(createNewShopItemError(err.response));
        resolve({ created: false, message: "Failed to Create ShopItem" });
      });
  });
};

const updateShopItemWithInputType = () => {
  return `
      mutation($shopItem: ShopItemInput!, $id: ID!) {
              updateExistingShopItem(shopItem: $shopItem, id: $id) 
          }
      `;
};

const updateExistingShopItem = shopItem => dispatch => {
  dispatch(updateExistingShopItemRequest());
  const { id, name, description, price, quantity } = shopItem;

  const shopItemInfo = immutable
    .wrap({})
    .set("name", name)
    .set("description", description)
    .set("price", parseInt(price))
    .set("quantity", parseInt(quantity))
    .value();

  return new Promise((resolve, reject) => {
    fetchGraphQL(updateShopItemWithInputType(), undefined, {
      shopItem: shopItemInfo,
      id
    })
      .then(res => {
        if (
          (res !== null) & (res !== undefined) &&
          res.updateExistingShopItem
        ) {
          dispatch(updateExistingShopItemSuccess());
          resolve({ updated: true, message: "Updated ShopItem Successfully" });
        } else {
          dispatch(updateExistingShopItemError("Could Not Update ShopItem"));
          resolve({ updated: false, message: "Failed to update ShopItem" });
        }
      })
      .catch(err => {
        dispatch(updateExistingShopItemError(err.response));
        resolve({ updated: false, message: "Failed to update ShopItem" });
      });
  });
};

const removeExistingShopItem = shopItem => dispatch => {
  dispatch(removeExistingShopItemRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          mutation {
              removeExistingShopItem(id: "${shopItem.id}")
          }
      `)
      .then(res => {
        if (res !== null && res !== undefined && res.removeExistingEvent) {
          dispatch(removeExistingShopItemSuccess());
          resolve({ deleted: true, message: "Deleted ShopItem Successfully" });
        } else {
          dispatch(removeExistingShopItemError("Could Not Remove ShopItem"));
          resolve({ deleted: false, message: "Failed to delete ShopItem" });
        }
      })
      .catch(err => {
        dispatch(removeExistingShopItemError(err.response));
        resolve({ deleted: false, message: "Failed to delete ShopItem" });
      });
  });
};

const updateShopItemImage = (imageURL, shopItem) => dispatch => {
  dispatch(updateShopItemImageRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          mutation {
              updateShopItemImage(id: "${shopItem.id}", imageURL: "${imageURL}")
          }    
      `)
      .then(res => {
        if (res !== null && res !== undefined && res.updateShopItemImage) {
          dispatch(updateShopItemImageSuccess());
          resolve({
            updated: true,
            message: "Updated ShopItem Image Successfully"
          });
        } else {
          dispatch(
            updateShopItemImageFailure("Could Not Update ShopItem Image")
          );
          resolve({
            updated: false,
            message: "Failed to update ShopItem Image"
          });
        }
      })
      .catch(err => {
        dispatch(updateShopItemImageFailure(err.response));
        resolve({ updated: false, message: "Failed to update ShopItem Image" });
      });
  });
};

const getAllShopItems = () => dispatch => {
  dispatch(getAllShopItemsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
          getShopItems {
              id
              name
              description
              price 
              quantity
              original_image_url
          }
      }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getShopItems !== null &&
          res.getShopItems !== undefined
        ) {
          dispatch(getAllShopItemsSuccess(res.getShopItems));
          resolve({ success: true, message: "Fetched ShopItems successfully" });
        } else {
          dispatch(getAllShopItemsError("Could not fetch ShopItems"));
          resolve({ success: false, message: "Failed to fetch ShopItems" });
        }
      })
      .catch(err => {
        dispatch(getAllShopItemsError(err.response));
        resolve({ success: false, message: "Failed to fetch ShopItems" });
      });
  });
};

const getAllEvents = () => dispatch => {
  dispatch(getAllEventsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
          getEvents {
              id
              name
              description
              original_image_url
              additional_pictures
              eventDate
              ticketAvailability
          }
      }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getEvents !== null &&
          res.getEvents !== undefined
        ) {
          dispatch(getAllEventsSuccess(res.getEvents));
          resolve({ success: true, message: "Fetched Events successfully" });
        } else {
          dispatch(getAllEventsError("Could not fetch Events"));
          resolve({ success: false, message: "Failed to fetch Events" });
        }
      })
      .catch(err => {
        dispatch(getAllEventsError(err.response));
        resolve({ success: false, message: "Failed to fetch Events" });
      });
  });
};

const getAllOrders = () => dispatch => {
  dispatch(getAllOrdersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
          getOrders {
            buyer_name
            email
            orderNumber
            price_cents
            shipping_cents
            total_price_cents
            status
            purchased_at
            items {
              item {
                name
                original_image_url
              }
              quantity
            }
          }
      }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getOrders !== null &&
          res.getOrders !== undefined
        ) {
          dispatch(getAllOrdersSuccess(res.getOrders));
          resolve({ success: true, message: "Fetched Orders successfully" });
        } else {
          dispatch(getAllOrdersError("Could not fetch Orders"));
          resolve({ success: false, message: "Failed to fetch Orders" });
        }
      })
      .catch(err => {
        dispatch(getAllOrdersError(err.response));
        resolve({ success: false, message: "Failed to fetch Orders" });
      });
  });
};

const uploadImage = (file, typeOfUpload) => dispatch => {
  const formData = new FormData();
  formData.append("attachment", file);
  formData.append("typeOfUpload", typeOfUpload);
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  return new Promise((resolve, reject) => {
    axios
      .post("http://localhost:4000/uploadMedia", formData, config)
      .then(res => {
        const { status, url } = res.data;
        if (status === "success") {
          resolve({
            success: true,
            imageURL: url,
            message: "Image upload successful"
          });
        } else {
          resolve({
            success: false,
            imageURL: "",
            message: "Image upload unsuccessful"
          });
        }
      })
      .catch(err => {
        resolve({
          success: false,
          imageURL: "",
          message: "Image upload unsuccessful"
        });
      });
  });
};

const uploadImages = (files, typeOfUpload) => dispatch => {
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  const callList = [];
  files.forEach(file => {
    const formData = new FormData();
    formData.append("attachment", file);
    formData.append("typeOfUpload", typeOfUpload);
    callList.push(
      axios.post("http://localhost:4000/uploadMedia", formData, config)
    );
  });
  return new Promise((resolve, reject) => {
    Promise.all(callList)
      .then(values => {
        const imageURLs = [];
        if (values !== undefined && values !== null) {
          values.forEach(res => {
            const { status, url } = res.data;
            if (status === "success") {
              imageURLs.push(url);
            }
          });
          console.log(imageURLs);
          resolve({
            success: true,
            imageURLs,
            message: "Image upload successful"
          });
        } else {
          resolve({
            success: false,
            imageURLs: [],
            message: "Image upload unsuccessful"
          });
        }
      })
      .catch(err => {
        resolve({
          success: false,
          imageURLs: [],
          message: "Image upload unsuccessful"
        });
      });
  });
};

const adminSignInRequest = () => {
  return {
    type: actionTypes.ADMIN_SIGNIN_REQUEST
  };
};

const adminSignInSuccess = () => {
  return {
    type: actionTypes.ADMIN_SIGNIN_SUCCESS
  };
};

const adminSignInError = () => {
  return {
    type: actionTypes.ADMIN_SIGNIN_ERROR
  };
};

const createNewEventRequest = () => {
  return {
    type: actionTypes.CREATE_NEW_EVENT_REQUEST
  };
};

const createNewEventSuccess = () => {
  return {
    type: actionTypes.CREATE_NEW_EVENT_SUCCESS
  };
};

const createNewEventError = errorMessage => {
  return {
    type: actionTypes.CREATE_NEW_EVENT_ERROR,
    payload: { errorMessage }
  };
};

const updateExistingEventRequest = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_EVENT_REQUEST
  };
};

const updateExistingEventSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_EVENT_SUCCESS
  };
};

const updateExistingEventError = errorMessage => {
  return {
    type: actionTypes.UPDATE_EXISTING_EVENT_ERROR,
    payload: { errorMessage }
  };
};

const removeExistingEventRequest = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_EVENT_REQUEST
  };
};

const removeExistingEventSuccess = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_EVENT_SUCCESS
  };
};

const removeExistingEventError = errorMessage => {
  return {
    type: actionTypes.REMOVE_EXISTING_EVENT_ERROR,
    payload: { errorMessage }
  };
};

const updateEventImageRequest = () => {
  return {
    type: actionTypes.UPDATE_EVENT_IMAGE_REQUEST
  };
};

const updateEventImageSuccess = () => {
  return {
    type: actionTypes.UPDATE_EVENT_IMAGE_SUCCESS
  };
};

const updateEventImageFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_EVENT_IMAGE_ERROR,
    payload: { errorMessage }
  };
};

const updateEventAdditionalImagesRequest = () => {
  return {
    type: actionTypes.UPDATE_EVENT_ADDITIONAL_IMAGES_REQUEST
  };
};

const updateEventAdditionalImagesSuccess = () => {
  return {
    type: actionTypes.UPDATE_EVENT_ADDITIONAL_IMAGES_SUCCESS
  };
};

const updateEventAdditionalImagesFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_EVENT_ADDITIONAL_IMAGES_ERROR,
    payload: { errorMessage }
  };
};

// Shop

const createNewShopItemRequest = () => {
  return {
    type: actionTypes.CREATE_NEW_SHOP_ITEM_REQUEST
  };
};

const createNewShopItemSuccess = () => {
  return {
    type: actionTypes.CREATE_NEW_SHOP_ITEM_SUCCESS
  };
};

const createNewShopItemError = errorMessage => {
  return {
    type: actionTypes.CREATE_NEW_SHOP_ITEM_ERROR,
    payload: { errorMessage }
  };
};

const updateExistingShopItemRequest = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_SHOP_ITEM_REQUEST
  };
};

const updateExistingShopItemSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_SHOP_ITEM_SUCCESS
  };
};

const updateExistingShopItemError = errorMessage => {
  return {
    type: actionTypes.UPDATE_EXISTING_SHOP_ITEM_ERROR,
    payload: { errorMessage }
  };
};

const removeExistingShopItemRequest = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_SHOP_ITEM_REQUEST
  };
};

const removeExistingShopItemSuccess = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_SHOP_ITEM_SUCCESS
  };
};

const removeExistingShopItemError = errorMessage => {
  return {
    type: actionTypes.REMOVE_EXISTING_SHOP_ITEM_ERROR,
    payload: { errorMessage }
  };
};

const updateShopItemImageRequest = () => {
  return {
    type: actionTypes.UPDATE_SHOP_ITEM_IMAGE_REQUEST
  };
};

const updateShopItemImageSuccess = () => {
  return {
    type: actionTypes.UPDATE_SHOP_ITEM_IMAGE_SUCCESS
  };
};

const updateShopItemImageFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_SHOP_ITEM_IMAGE_ERROR,
    payload: { errorMessage }
  };
};

const getAllEventsRequest = () => {
  return {
    type: actionTypes.GET_EVENTS_REQUEST
  };
};

const getAllEventsSuccess = data => {
  return {
    type: actionTypes.GET_EVENTS_SUCCESS,
    payload: { data }
  };
};

const getAllEventsError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_EVENTS_ERROR,
    payload: { errorMessage }
  };
};

const getAllOrdersRequest = () => {
  return {
    type: actionTypes.GET_ORDERS_REQUEST
  };
};

const getAllOrdersSuccess = data => {
  return {
    type: actionTypes.GET_ORDERS_SUCCESS,
    payload: { data }
  };
};

const getAllOrdersError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_ORDERS_ERROR,
    payload: { errorMessage }
  };
};

const getAllShopItemsRequest = () => {
  return {
    type: actionTypes.GET_SHOP_ITEMS_REQUEST
  };
};

const getAllShopItemsSuccess = data => {
  return {
    type: actionTypes.GET_SHOP_ITEMS_SUCCESS,
    payload: { data }
  };
};

const getAllShopItemsError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_SHOP_ITEMS_ERROR,
    payload: { errorMessage }
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_SIGNIN_REQUEST:
      return Object.assign({}, state, {
        isSigningIn: true
      });
    case actionTypes.ADMIN_SIGNIN_SUCCESS:
      return Object.assign({}, state, {
        isSigningIn: false
      });
    case actionTypes.ADMIN_SIGNIN_ERROR:
      return Object.assign({}, state, {
        isSigningIn: false
      });
    case actionTypes.GET_EVENTS_REQUEST: {
      return Object.assign({}, state, {
        events: Object.assign({}, state.events, { isFetching: true })
      });
    }
    case actionTypes.GET_EVENTS_SUCCESS: {
      return Object.assign({}, state, {
        events: Object.assign({}, state.events, {
          data: action.payload.data || [],
          isFetching: false
        })
      });
    }
    case actionTypes.GET_EVENTS_ERROR: {
      return Object.assign({}, state, {
        events: Object.assign({}, state.events, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage
        })
      });
    }
    case actionTypes.GET_SHOP_ITEMS_REQUEST: {
      return Object.assign({}, state, {
        shopItems: Object.assign({}, state.shopItems, { isFetching: true })
      });
    }
    case actionTypes.GET_SHOP_ITEMS_SUCCESS: {
      return Object.assign({}, state, {
        shopItems: Object.assign({}, state.shopItems, {
          data: action.payload.data || [],
          isFetching: false
        })
      });
    }
    case actionTypes.GET_SHOP_ITEMS_ERROR: {
      return Object.assign({}, state, {
        shopItems: Object.assign({}, state.shopItems, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage
        })
      });
    }
    case actionTypes.GET_ORDERS_REQUEST: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, { isFetching: true })
      });
    }
    case actionTypes.GET_ORDERS_SUCCESS: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          data: action.payload.data || [],
          isFetching: false
        })
      });
    }
    case actionTypes.GET_ORDERS_ERROR: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage
        })
      });
    }
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    adminSignIn,
    createNewEvent,
    updateExistingEvent,
    removeExistingEvent,
    updateEventImage,
    updateEventAdditionalImages,
    createNewShopItem,
    updateExistingShopItem,
    removeExistingShopItem,
    updateShopItemImage,
    // -----> Query
    getAllEvents,
    getAllShopItems,
    getAllOrders,
    uploadImage,
    uploadImages
  }
};
