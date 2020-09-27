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
    UPDATE_EVENT_ADDITIONAL_IMAGES_ERROR: "UPDATE_EVENT_ADDITIONAL_IMAGES_ERROR"
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
        if (res !== null && res != undefined && res.adminSignIn) {
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
    // -----> Query
    getAllEvents,
    uploadImage,
    uploadImages
  }
};
