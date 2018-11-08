import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TabMenu from './TabMenu';

const styles = {
  appBar: {
    // backgroundColor: '#b7d9f7'
  },
  logo: {
    flex: 1
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.appBar} position="static" color="default">
        <Toolbar>
          <Typography className={classes.logo} variant="h6" color="inherit">
            Music Box
          </Typography>
          <TabMenu />
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
