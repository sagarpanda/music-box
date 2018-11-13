import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ImageIcon from '@material-ui/icons/Image';
// import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/PlaylistAdd';
import MusicIcon from './../assets/Music';

class PlayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleAddToPlaylistClick = this.handleAddToPlaylistClick.bind(this);
  }
  handleFavoriteClick() {
    const { onFavoriteClick, item } = this.props;
    onFavoriteClick(item);
  }
  handleAddToPlaylistClick() {
    const { onAddToPlaylistClick, item } = this.props;
    onAddToPlaylistClick(item);
  }
  render() {
    const {
      item, playingId, hideAddToPlaylist, onChange
    } = this.props;
    return (
      <ListItem button onClick={() => onChange(item)}>
        <ListItemIcon>
          <Avatar>
            {
              playingId === item.id ?
                <MusicIcon /> :
                <ImageIcon />
            }
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={item.title} secondary={item.artist} />
        <ListItemSecondaryAction>
          <IconButton aria-label="File Size">
            <Typography variant="caption" color="inherit">{item.size}</Typography>
          </IconButton>
          <IconButton aria-label="Favorite" onClick={this.handleFavoriteClick}>
            <FavoriteIcon />
          </IconButton>
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

export default PlayItem;
