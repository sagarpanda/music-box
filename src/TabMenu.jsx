import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
  tabs: {
    marginTop: 15
  },
  tabContent: {
    flex: 1,
    overflow: 'auto'
  }
};

class TabMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <Tabs
        className={classes.tabs}
        value={0}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Playlist" />
        <Tab label="Favourite" />
        <Tab label="Album" />
      </Tabs>
    );
  }
}


TabMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TabMenu);
