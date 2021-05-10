const actions = {
  CHECK_AUTHORIZATION: "CHECK_AUTHORIZATION",

  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",

  LOGOUT: "LOGOUT",

  SIGNUP_REQUEST: "SIGNUP_REQUEST",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  SIGNUP_ERROR: "SIGNUP_ERROR",

  SHOW_DIALOG: "SHOW_DIALOG",
  CLOSE_DIALOG: "CLOSE_DIALOG",

  BUY_SLOT_REQUEST: "BUY_SLOT_REQUEST",
  BUY_SLOT_SUCCESS: "BUY_SLOT_SUCCESS",

  GET_AFFILIATE_REQUEST: "GET_AFFILIATE_REQUEST",
  GET_AFFILIATE_SUCCESS: "GET_AFFILIATE_SUCCESS",
  GET_AFFILIATE_ERROR: "GET_AFFILIATE_ERROR",

  GET_ID_FROM_AFFILIATE: "GET_ID_FROM_AFFILIATE",
  GET_ID_FROM_SUCCESS: "GET_ID_FROM_SUCCESS",
  GET_ID_FROM_ERROR: "GET_ID_FROM_ERROR",

  GET_DONDI_INFO: "GET_DONDI_INFO",
  GET_DONDI_INFO_SUCCESS: "GET_DONDI_INFO_SUCCESS",

  UPDATE_ERROR_MESSAGE: "UPDATE_ERROR_MESSAGE",

  checkAuthorization: (token) => ({ type: actions.CHECK_AUTHORIZATION, token }),
  login: (token = false) => ({
    type: actions.LOGIN_REQUEST,
    payload: { token },
  }),
  logout: () => ({
    type: actions.LOGOUT,
  }),
  signUp: (payload) => ({
    type: actions.SIGNUP_REQUEST,
    payload,
  }),
  signUpSuccess: (payload) => ({
    type: actions.SIGNUP_SUCCESS,
    payload,
  }),
  signUpError: (msg) => ({ type: actions.SIGNUP_ERROR, msg }),
  closeDialog: () => ({
    type: actions.CLOSE_DIALOG,
  }),
  buySlotRequest: (payload) => ({ type: actions.BUY_SLOT_REQUEST, payload }),
  getAffiliateRequest: (payload) => ({
    // After signup success, generate affiliate links
    type: actions.GET_AFFILIATE_REQUEST,
    payload,
  }),
  getIdFromAffiliate: (payload) => ({
    type: actions.GET_ID_FROM_AFFILIATE,
    payload,
  }),
  getDondiInfo: () => ({ type: actions.GET_DONDI_INFO }),
};
export default actions;
