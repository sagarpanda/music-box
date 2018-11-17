import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import PlayItem from './PlayItem';

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
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleAddToPlaylistClick = this.handleAddToPlaylistClick.bind(this);
  }
  handleFavoriteClick(isChecked, song) {
    const { onFavoriteClick } = this.props;
    onFavoriteClick(isChecked, song);
  }
  handleAddToPlaylistClick(song) {
    const { onAddToPlaylistClick } = this.props;
    onAddToPlaylistClick(song);
  }
  render() {
    const { classes, data } = this.props;
    return (
      <Fragment>
        <div className={classes.tabContent}>
          <List component="nav">
            {
              data.map(item => (
                <PlayItem
                  key={item.title}
                  item={item}
                  playingId={this.props.playingId}
                  playingStatus={this.props.playingStatus}
                  hideAddToPlaylist={this.props.hideAddToPlaylist}
                  onChange={this.props.onChange}
                  onFavoriteClick={this.handleFavoriteClick}
                  onAddToPlaylistClick={this.handleAddToPlaylistClick}
                />
              ))
            }
          </List>
        </div>
      </Fragment>
    );
  }
}

Playlist.defaultProps = {
  playingId: null,
  playingStatus: null,
  hideAddToPlaylist: false,
  data: [],
  onChange: () => {},
  onFavoriteClick: () => {},
  onAddToPlaylistClick: () => {}
};

Playlist.propTypes = {
  hideAddToPlaylist: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  playingId: PropTypes.string,
  playingStatus: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
  onChange: PropTypes.func,
  onFavoriteClick: PropTypes.func,
  onAddToPlaylistClick: PropTypes.func
};

export default withStyles(styles)(Playlist);
