import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    this.state = {
      navs: ['/album', '/playlist', '/favorites', '/recents']
    };
  }
  render() {
    const { classes, location } = this.props;
    let index = this.state.navs.indexOf(location.pathname);
    if (location.pathname === '/') {
      index = 0;
    }
    return (
      <BottomNavigation
        value={index}
        className={classes.tabs}
      >
        <BottomNavigationAction component={Link} to="/album" label="Album" value={0} icon={<LibraryMusicIcon />} />
        <BottomNavigationAction component={Link} to="/playlist" label="Playlist" value={1} icon={<LocationOnIcon />} />
        <BottomNavigationAction component={Link} to="/favorites" label="Favorites" value={2} icon={<FavoriteIcon />} />
        { /*<BottomNavigationAction component={Link} to="/recents" label="Recents" value={3} icon={<RestoreIcon />} />*/ }
      </BottomNavigation>
    );
  }
}

TabMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired
};

export default withStyles(styles)(TabMenu);
