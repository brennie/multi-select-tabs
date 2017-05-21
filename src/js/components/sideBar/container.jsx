import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SideBar from "components/sideBar/sideBar";
import {
  closeSelectedTabs,
  gatherSelectedTabs,
  setFilter,
  toggleSelectAll,
} from "actions";

const mapStateToProps = function mapStateToProps(state) {
  console.log(state);
  return {
    activeTabId: state.activeTabId,
    tabs: state.filteredTabIds.map(id => state.tabsById.get(id)),
    filter: state.filter,
    selectAll: state.selectAll,
  };
};

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    closeSelectedTabs,
    gatherSelectedTabs,
    setFilter,
    toggleSelectAll,
  }, dispatch);
};

const SideBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);

export default SideBarContainer;
