import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ImageIcon from '@material-ui/icons/Image';
// import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/PlaylistAdd';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';
import MusicIcon from './../assets/Music';
import apiConfig from './../apiConfig';

const styles = {
  favIcon: {
    margin: 0
  },
  tooltip: {
    marginTop: -20,
    padding: 10
  }
};

class PlayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleAddToPlaylistClick = this.handleAddToPlaylistClick.bind(this);
  }
  handleFavoriteClick(e, isChecked) {
    const { onFavoriteClick, item } = this.props;
    onFavoriteClick(isChecked, item);
  }
  handleAddToPlaylistClick() {
    const { onAddToPlaylistClick, item } = this.props;
    onAddToPlaylistClick(item);
  }
  render() {
    const {
      classes, item, playingId, playingStatus, hideAddToPlaylist, onChange
    } = this.props;
    let playing = <ImageIcon />;
    if (playingId === item.trackId) {
      if (playingStatus === 'play') {
        playing = <MusicIcon />;
      } else {
        playing = <PlayArrowIcon />;
      }
    }
    return (
      <ListItem button onClick={() => onChange(item)}>
        <ListItemIcon>
          <Avatar>
            { playing }
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={item.title} secondary={item.artist} />
        <ListItemSecondaryAction>
          <IconButton aria-label="File Size">
            <Typography variant="caption" color="inherit">{item.size}</Typography>
          </IconButton>
          <FormControlLabel
            className={classes.favIcon}
            control={
              <Checkbox
                disabled={!apiConfig.loggedInUser}
                checked={item.isFavorite}
                icon={<FavoriteBorder />}
                checkedIcon={<FavoriteIcon />}
                onChange={this.handleFavoriteClick}
              />
            }
          />
          {
            !this.props.hideAddToPlaylist &&
            <IconButton aria-label="Add to Playlist" onClick={this.handleAddToPlaylistClick}>
              <AddIcon />
            </IconButton>
          }
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

PlayItem.defaultProps = {
  onFavoriteClick: () => {},
  onAddToPlaylistClick: () => {}
};

PlayItem.propTypes = {
  onFavoriteClick: PropTypes.func,
  onAddToPlaylistClick: PropTypes.func
};

export default withStyles(styles)(PlayItem);
