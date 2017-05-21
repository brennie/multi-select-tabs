import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { activateTab, createTab, moveTab, removeTab, updateTab } from "actions";
import SideBarContainer from "components/sideBar/container";
import reducer, { defaultState } from "reducers";

const getInitialState = async function getInitialState() {
  const { id: windowId, tabs } = await browser.windows.getCurrent({
    populate: true,
  });

  const tabIds = [];
  const tabsById = new Map();
  const state = {
    tabIds,
    tabsById,
    windowId,
  };

  for (const tab of tabs) {
    tabIds.push(tab.id);
    tabsById.set(tab.id, {
      favIconUrl: tab.favIconUrl,
      id: tab.id,
      selected: false,
      title: tab.title,
      url: tab.url,
    });

    if (tab.active) {
      state.activeTabId = tab.id;
    }
  }

  state.filteredTabIds = tabIds.slice();

  return state;
};

addEventListener("load", async () => {
  const state = await getInitialState();
  const store = createStore(reducer, {
    ...defaultState,
    ...state
  });

  browser.tabs.onActivated.addListener(({ windowId, tabId }) => {
    if (windowId === state.windowId) {
      store.dispatch(activateTab(tabId));
    }
  });

  browser.tabs.onCreated.addListener(tab => {
    if (tab.windowId === state.windowId) {
      store.dispatch(createTab(tab));
    }
  });

  browser.tabs.onMoved.addListener(({ windowId, fromIndex, toIndex }) => {
    if (windowId === state.windowId) {
      store.dispatch(moveTab(fromIndex, toIndex));
    }
  });

  browser.tabs.onRemoved.addListener((tabId, { windowId, isWindowClosing }) => {
    if (windowId === state.windowId && !isWindowClosing) {
      store.dispatch(removeTab(tabId));
    }
  });

  render(
    <Provider store={store}>
      <SideBarContainer />
    </Provider>,
    document.getElementById("container"),
  );
});
