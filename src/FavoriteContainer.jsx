import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import AppContext from './AppContext';
import Playlist from './playlist/Playlist';

class FavoriteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      message: ''
    };
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }
  componentDidMount() {
    axios.get('/api/user/favorite')
      .then((response) => {
        const data = response.data.body.map(item => ({ ...item, isFavorite: true }));
        this.setState({ data });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.setState({ message: 'Please login to use this feature.' });
        }
      });
  }
  handleFavoriteClick(isChecked, track) {
    if (!isChecked) {
      axios.delete('/api/user/favorite', { data: { trackId: track.trackId } })
        .then(() => {
          const data = this.state.data.filter(item => item.trackId !== track.trackId);
          this.setState({ data, message: '' });
        })
        .catch(err => console.log(err));
    }
  }
  render() {
    return (
      <AppContext.Consumer>
        {
          ({
            playingId, playingStatus, onSongSelectInAlbum
          }) => (
            <Fragment>
              {
                this.state.message && <Typography variant="body2" style={{ textAlign: 'center', padding: 20 }}>{this.state.message}</Typography>
              }
              <Playlist
                playingId={playingId}
                playingStatus={playingStatus}
                data={this.state.data}
                onChange={track => onSongSelectInAlbum(track.trackId, this.state.data)}
                onFavoriteClick={this.handleFavoriteClick}
              />
            </Fragment>
          )
        }
      </AppContext.Consumer>
    );
  }

}

export default FavoriteContainer;
