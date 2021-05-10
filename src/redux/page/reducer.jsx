import actions from "./actions";

const initState = {
  currentPtnPageNumber: 1,
  partners: null,

  currentStsPageNumber: 1,
  statistics: null,

  program: null,
  slotDetail: null,

  notificationMessages: [],
  alertMessage: "",

  currencyRate: null,
  currency: "USD",

  iProfile: null,
};

export default function pageReducer(state = initState, action) {
  switch (action.type) {
    case actions.PARTNERS_FILTER_SUCCESS:
      return {
        ...state,
        partners: action.partners,
      };
    case actions.STATISTICS_FILTER_SUCCESS:
      return {
        ...state,
        statistics: action.statistics,
      };
    case actions.SLOT_DETAIL_SUCCESS:
      return {
        ...state,
        program: action.program,
        slotDetail: action.slotDetail,
      };
    case actions.INIT_SLOT_DETAIL:
      return {
        ...state,
        program: null,
        slotDetail: null,
      };
    case actions.GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notificationMessages: action.notificationMessages,
      };
    case actions.GET_ALERT_MESSAGE_SUCCESS:
      return {
        ...state,
        alertMessage: action.alertMessage,
      };
    case actions.GET_CURRENCY_RATE_SUCCESS:
      return {
        ...state,
        currencyRate: action.currencyRate,
      };
    case actions.UPDATE_CURRENCY:
      return {
        ...state,
        currency: action.currency,
      };
    case actions.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        iProfile: action.iProfile,
      };
    default:
      return state;
  }
}
