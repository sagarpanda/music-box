import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/QueueMusic';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';

const styles = {
  tabs: {
    backgroundColor: '#f5f5f5'
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
      <BottomNavigation
        value={this.props.selectedTabIndex}
        onChange={this.props.onChange}
        className={classes.tabs}
      >
        <BottomNavigationAction label="Album" value={0} icon={<LibraryMusicIcon />} />
        <BottomNavigationAction label="Playlist" value={1} icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Favorites" value={2} icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Recents" value={3} icon={<RestoreIcon />} />
      </BottomNavigation>
    );
  }
}

TabMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(TabMenu);
