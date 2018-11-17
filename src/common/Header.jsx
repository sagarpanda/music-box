import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import deepOrange from '@material-ui/core/colors/deepOrange';
import AccountCircle from '@material-ui/icons/AccountCircle';
import apiConfig from './../apiConfig';

const styles = {
  appBar: {
    // backgroundColor: '#b7d9f7'
  },
  logo: {
    flex: 1
  },
  userButton: {
    marginTop: -10
  },
  orangeAvatar: {
    color: '#fff',
    backgroundColor: deepOrange[500]
  },
  paper: {
    padding: '10px 20px'
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleToggle() {
    this.setState(state => ({ open: !state.open }));
  }
  handleClose(event) {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }
  loggedInPane() {
    const { classes } = this.props;
    return (
      <Fragment>
        <IconButton
          className={classes.userButton}
          buttonRef={(node) => { this.anchorEl = node; }}
          onClick={this.handleToggle}
        >
          <AccountCircle />
        </IconButton>
        <Popper open={this.state.open} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <div>
                    <Typography>Hi {apiConfig.loggedInUser}</Typography>
                    <Button component="a" href="/logout">Logout</Button>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.appBar} position="static" color="default">
        <Toolbar>
          <Typography className={classes.logo} variant="h6" color="inherit">
            mubox
          </Typography>
          { this.props.children }
          {
            apiConfig.loggedInUser ? this.loggedInPane() :
            <Button component="a" href="/auth/facebook" color="inherit">Login</Button>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

Header.defaultProps = {
  children: null
};

Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default withStyles(styles)(Header);
