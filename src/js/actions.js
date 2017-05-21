export const ACTIVATE_TAB = "ACTIVATE_TAB";
export const CREATE_TAB = "CREATE_TAB";
export const MOVE_TAB = "MOVE_TAB";
export const REMOVE_TAB = "REMOVE_TAB";
export const UPDATE_TAB = "UPDATE_TAB";
export const SET_FILTER = "SET_FILTER";
export const TOGGLE_SELECT_ALL = "TOGGLE_SELECT_ALL";
export const GATHER_SELECTED_TABS = "GATHER_TABS";
export const CLOSE_SELECTED_TABS = "CLOSE_TABS";

export const activateTab = function activateTab(tabId) {
  return {
    type: ACTIVATE_TAB,
    tabId,
  };
};

export const createTab = function createTab(tab) {
  return {
    type: CREATE_TAB,
    tab: tab,
    windowId: tab.windowId,
  };
};

export const moveTab = function moveTab(fromIndex, toIndex) {
  return {
    type: MOVE_TAB,
    fromIndex,
    toIndex,
  };
};

export const removeTab = function removeTab(tabId) {
  return {
    type: REMOVE_TAB,
    tabId,
  };
};

export const updateTab = function updateTab(tabId, changeInfo) {
  return {
    type: UPDATE_TAB,
    tabId,
    changeInfo,
  };
};

export const setFilter = function setFilter(filter) {
  return {
    type: SET_FILTER,
    filter,
  };
};

export const toggleSelectAll = function toggleSelectAll() {
  return { type: TOGGLE_SELECT_ALL };
};

export const closeSelectedTabs = function closeSelectedTabs() {
  return { type: CLOSE_SELECTED_TABS };
};

export const gatherSelectedTabs = function gatherSelectedTabs() {
  return { type: GATHER_SELECTED_TABS };
};
