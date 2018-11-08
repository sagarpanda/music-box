import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ImageIcon from '@material-ui/icons/Image';
import songList from './SongData';

const styles = {
  tabContent: {
    flex: 1,
    overflow: 'auto'
  }
};

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.tabContent}>
          <List component="nav">
            {
              songList.map(item => (
                <ListItem button key={item.title}>
                  <ListItemIcon><Avatar> <ImageIcon /></Avatar></ListItemIcon>
                  <ListItemText primary={item.title} />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="inherit">3:40</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            }
          </List>
        </div>
      </Fragment>
    );
  }
}

Playlist.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Playlist);
