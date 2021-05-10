import actions from "./actions";

const initState = {
  idToken: null,
  showDialog: false,
  profile: null,
  dondiInfo: null,
  isLoading: false,
  affiliate: null,
  uid: 0,

  errorMessage: null, // type, message
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        idToken: action.token,
        profile: action.profile,
        dondiInfo: action.dondiInfo,
        showDialog: false,
        isLoading: action.isLoading,
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case actions.UPDATE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    case actions.SHOW_DIALOG:
      return {
        ...state,
        showDialog: true,
      };
    case actions.CLOSE_DIALOG:
      return {
        ...state,
        showDialog: false,
      };
    case actions.LOGOUT:
      return initState;
    case actions.GET_AFFILIATE_SUCCESS:
      return {
        ...state,
        affiliate: action.affiliate,
      };
    case actions.GET_ID_FROM_SUCCESS:
      return {
        ...state,
        uid: action.uid,
      };
    case actions.GET_DONDI_INFO_SUCCESS:
      return {
        ...state,
        dondiInfo: action.dondiInfo,
      };
    case actions.BUY_SLOT_SUCCESS:
      let profile = state.profile;
      let keys, currentLevel, activeXLevels, xMatrix;

      if (action.payload.matrix === 1) {
        keys = Object.keys(profile.activeX3Levels);

        currentLevel = keys[action.payload.level - 1];

        activeXLevels = state.profile.activeX3Levels;
        activeXLevels[currentLevel] = true;

        xMatrix = profile.x3Matrix;
        xMatrix[currentLevel].isActive = true;

        // remove missed payment warning mark
        if (action.payload.level > 1) {
          const previousLevel = keys[action.payload.level - 2];
          if (xMatrix[previousLevel].slotStatus.status === true) {
            xMatrix[previousLevel].slotStatus.status = false;
          }
        }
      } else if (action.payload.matrix === 2) {
        keys = Object.keys(profile.activeX6Levels);

        currentLevel = keys[action.payload.level - 1];

        activeXLevels = state.profile.activeX6Levels;
        activeXLevels[currentLevel] = true;

        xMatrix = profile.x6Matrix;
        xMatrix[currentLevel].isActive = true;

        // remove missed payment warning mark
        if (action.payload.level > 1) {
          const previousLevel = keys[action.payload.level - 2];
          if (xMatrix[previousLevel].slotStatus.status === true) {
            xMatrix[previousLevel].slotStatus.status = false;
          }
        }
      }

      return {
        ...state,
        profile: { ...state.profile, activeXLevels, xMatrix },
      };
    default:
      return state;
  }
}
