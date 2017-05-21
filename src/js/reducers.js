import {
  ACTIVATE_TAB,
  CREATE_TAB,
  MOVE_TAB,
  REMOVE_TAB,
  UPDATE_TAB,
  SET_FILTER,
  TOGGLE_SELECT_ALL,
  CLOSE_SELECTED_TABS,
  GATHER_SELECTED_TABS,
} from "actions";

export const defaultState = {
  /* The currently shown tab. */
  activeTabId: null,

  /* A map of tab IDs to their attributes. */
  tabsById: new Map(),

  /* The current filter. */
  filter: "",

  /* The IDs of the filtered tabs (in order). */
  filteredTabIds: [],

  /* Whether or not the "select all" checkbox is checked. */
  selectAll: false,

  /* The IDs of the tabs (in order). */
  tabIds: [],

  /* The current window ID. */
  windowId: null,
};

const cloneTabs = function cloneTabs(tabs, without=undefined, unselect=false) {
  const newTabs = new Map();
  const shouldExclude = typeof without !== "undefined";

  for (const [key, value] of tabs) {
    if (!shouldExclude || key !== without) {
      newTabs.set(key, {
        ...value,
        selected: value.selected && !unselect,
      });
    }
  }

  return newTabs;
};

/* Fields in an UPDATE_TAB event that we care about. */
const updateFields = ["favIconUrl", "title", "url"];

const filterTabs = function filterTabs(state) {
  const { filter, tabsById, tabIds } = state;
  if (filter.length === 0) {
    return tabIds.slice();
  }

  filter = filter.toLowerCase();
  filteredTabIds = tabIds.reduce((tabs, tabId) => {
    const { title, url } = tabsById.get(tabId);

    if (
      title.toLowerCase().includes(filter) ||
      url.toLowerCase().includes(filter)
    ) {
      tabs.push(tabId);
    }

    return tabs;
  }, []);

  return {
    ...state,
    filteredTabIds,
  };
};

const getSelectedTabs = function getSelectedTabs(state) {
  const { filteredTabs, tabsById } = state;

  // prettier-ignore
  return tabs.reduce((selected, info) => {
    if (info.selected) {
      selected.push(info.id);
    }
    return selected;
  }, []);
}

const reducer = function tabs(state = defaultState, action) {
  switch (action.type) {
    case ACTIVATE_TAB:
      return {
        ...state,
        activeTabId: action.tabId,
      };

    case CREATE_TAB: {
      const tabsById = cloneTabs(state.tabsById);

      tabsById.set(action.tab.id, {
        favIconUrl: tab.favIconUrl,
        id: action.tab.id,
        selected: state.selectAll,
        title: action.tab.title,
        url: tab.url,
      });

      const tabIds = [
        ...state.tabIds.splice(0, action.tab.index),
        action.tab.id,
        ...state.tabIds.splice(action.tab.Index),
      ];

      return filterTabs({
        ...state,
        tabsById,
        tabIds,
      });
    }

    case MOVE_TAB: {
      const tabIds = state.tabIds.slice();

      const [tabId] = tabIds.splice(action.fromIndex, 1);
      tabIds.splice(action.toIndex, 0, tabId);

      return filterTabs({
        ...state,
        tabIds,
      });
    }

    case REMOVE_TAB:
      if (action.isWindowClosing) {
        return state;
      } else {
        const tabsById = cloneTabs(state.tabsById, without=action.tabId);
        const tabIds = state.tabIds.slice();
        const index = state.tabIds.indexOf(action.tabId);

        tabIds.splice(tabIndex, 1);

        return filterTabs({
          ...state,
          tabsById,
          tabIds,
        });
      }

    case UPDATE_TAB: {
      let changed = false;
      for (const key of updateFields) {
        if (action.changeInfo.hasOwnProperty(key)) {
          changed = true;
        }
      }

      /* If none of the relevant fields change, we can ignore the event. */
      if (!changed) {
        return state;
      }
      
      const tabsById = cloneTabs(state.tabsById);
      const tabInfo = tabsById.get(action.tabId);

      for (const key of updateFields) {
        if (action.changeInfo.hasOwnProperty(key)) {
          tabInfo[key] = changeInfo[key];
        }
      }

      return filterTabs({
        ...state,
        tabsById,
      });
    }

    case SET_FILTER:
      return filterTabs({
        ...state,
        filter,
      });

    case TOGGLE_SELECT_ALL: {
      const selectAll = !state.selectAll;
      const tabsById = cloneTabs(state.tabsById, unselect=true);

      for (const tabId of state.filteredTabIds) {
        tabsById.get(tabId).selected = selectAll;
      }

      return {
        ...state,
        selectAll,
        tabsById,
      };
    }

    case GATHER_SELECTED_TABS: {
      const tabs = getSelectedTabs(state);
      const firstId = tabs.shift();
      const index = state.tabIds.indexOf(firstId);

      browser.tabs.move(tabs, { windowId: state.windowId, index });
    }

    case CLOSE_SELECTED_TABS:
      browser.tabs.close(getSelectedTabs(state));
      return state;

    default:
      return state;
  }
};

export default reducer;
