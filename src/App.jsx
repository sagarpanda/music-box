import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';
import Playlist from './Playlist';
import AudioPlayer from './AudioPlayer';
import './App.css';

const styles = {
  appContent: {
    flex: 1
  },
  tabWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Header />
        <Grid className={classes.appContent} container>
          <Grid item className={classes.tabWrapper}>
            <Playlist />
          </Grid>
        </Grid>
        <AudioPlayer />
      </Fragment>
    );
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
