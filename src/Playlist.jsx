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
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';

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
    const { classes, data } = this.props;
    return (
      <Fragment>
        <div className={classes.tabContent}>
          <List component="nav">
            {
              data.map(item => (
                <ListItem button key={item.title} onClick={() => this.props.onChange(item)}>
                  <ListItemIcon><Avatar> <ImageIcon /></Avatar></ListItemIcon>
                  <ListItemText primary={item.title} />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Duration">
                      <Typography variant="caption" color="inherit">3:40</Typography>
                    </IconButton>
                    <IconButton aria-label="Favorite">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Add to Playlist">
                      <AddIcon />
                    </IconButton>
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

Playlist.defaultProps = {
  data: [],
  onChange: () => {}
};

Playlist.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
  onChange: PropTypes.func
};

export default withStyles(styles)(Playlist);