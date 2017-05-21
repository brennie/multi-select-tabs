import React from "react";
import PropTypes from "prop-types";

import TabInfo from "components/tabInfo";

const SideBar = function SideBar(props) {
  const {
    activeTabId,
    closeSelectedTabs,
    filter,
    gatherSelectedTabs,
    selectAll,
    setFilter,
    tabs,
    toggleSelectAll
  } = props;

  return (
    <div id="sidebar">
      <div id="controls">
        <button id="close" onClick={closeSelectedTabs}>
          Close
        </button>
        <button id="gather" onClick={gatherSelectedTabs}>
          Gather
        </button>
        <input
          id="filter"
          className="block"
          type="text"
          placeholder="Filter tabs..."
          onChange={e => setFilter(e.target.text)}
          value={filter}
        />
        <label className="block">
          <input
            id="select-all"
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          />
          Select all tabs
        </label>
      </div>
      <ul id="tabs-list">
        {
          tabs.map(tabInfo =>
            <TabInfo
              key={tabInfo.id}
              info={tabInfo}
              active={tabInfo.id === activeTabId}
              onSelectionChanged={() => console.error("onSelectionChanged not impl")}
              onClick={() => console.error("onClick not impl")}
             />
          )
        }
      </ul>
    </div>
  );
};

SideBar.propTypes = {
  closeSelectedTabs: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  gatherSelectedTabs: PropTypes.func.isRequired,
  selectAll: PropTypes.bool.isRequired,
  setFilter: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      favIconurl: PropTypes.string,
      id: PropTypes.number.isRequired,
      selected: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  toggleSelectAll: PropTypes.func.isRequired,
};

export default SideBar;
