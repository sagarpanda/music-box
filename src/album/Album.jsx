import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ldTrim from 'lodash/trim';
import axios from 'axios';
import AlbumGrid from './AlbumGrid';
import AlbumDetail from './AlbumDetail';
import apiConfig from './../apiConfig';

const styles = {
  tabContent: {
    padding: 22,
    overflow: 'auto'
  }
};

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // shape: {
      //   id, name, image, songsUrl,
      //   songs: [ { id, source, title, artist, hits, size } ]
      // }
      albums: [],
      selectedAlbumIndex: -1,
      pageNum: 0
    };
    this.loading = false;
    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
    this.handleSongSelect = this.handleSongSelect.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (!this.loading && this.state.selectedAlbumIndex === -1) {
        const h = (this.eAlbum.scrollHeight - this.eAlbum.offsetHeight) - 150;
        if (this.eAlbum.scrollTop > h) {
          this.fetchAlbums();
        }
      }
    }, 1000);
    this.fetchAlbums();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  fetchAlbums() {
    this.loading = true;
    const pageNum = this.state.pageNum + 1;
    if (pageNum < 13) {
      axios.get(apiConfig.getApiUrl('movies', { pageNum }))
        .then((response) => {
          const albums = response.data.map(item => ({
            id: item.id,
            name: ldTrim(item.label),
            image: item.img.replace('_1.jpg', '_3.jpg'),
            songsUrl: item.url,
            songs: null
          }));
          this.setState({
            albums: [...this.state.albums, ...albums],
            pageNum
          }, () => {
            this.loading = false;
          });
        })
        .catch(error => console.log(error));
    }
  }
  fetchSongs(idx) {
    const ob = { ...this.state.albums[idx] };
    const opt = { url: ob.songsUrl, label: ob.name, id: ob.id };
    const encode = window.btoa(JSON.stringify(opt));
    axios.get(apiConfig.getApiUrl('movieSongs', { encode }))
      .then((response) => {
        const songs = response.data.map((item) => {
          const {
            id,
            artist,
            hits,
            size,
            isFavorite
          } = item;
          return {
            trackId: id,
            source: item.url,
            title: ldTrim(item.label),
            artist,
            hits,
            size,
            isFavorite,
            albumId: ob.id,
            albumName: ob.name
          };
        });
        const albums = this.state.albums.map((item, i) => {
          let r = item;
          if (idx === i) {
            r = { ...ob, songs };
          }
          return r;
        });
        this.setState({ albums });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleSongSelect(songId) {
    const { albums, selectedAlbumIndex } = this.state;
    const ob = { ...albums[selectedAlbumIndex] };
    const songs = ob.songs.map(item => ({
      ...item, image: ob.image, albumId: ob.id, albumName: ob.name
    }));
    this.props.onSongSelectInAlbum(songId, songs);
  }
  handleAlbumSelect(index) {
    this.setState({ selectedAlbumIndex: index }, () => {
      if (index !== -1 && this.state.albums[index].songs === null) {
        this.fetchSongs(index);
      }
    });
  }
  handleFavoriteClick(isChecked, track) {
    const { onFavoriteClick } = this.props;
    const { selectedAlbumIndex, albums } = this.state;
    const imgTrack = track;
    const newAlbums = albums.map((obA, i) => {
      if (selectedAlbumIndex === i) {
        const songs = obA.songs.map((obB) => {
          if (obB.trackId === track.trackId) {
            imgTrack.image = obA.image;
            return { ...obB, isFavorite: isChecked };
          } else {
            return obB;
          }
        });
        return { ...obA, songs };
      } else {
        return obA;
      }
    });
    this.setState({ albums: newAlbums }, () => {
      onFavoriteClick(isChecked, imgTrack);
    });
  }
  render() {
    const { classes, onFavoriteClick, onAddToPlaylistClick } = this.props;
    return (
      <div
        className={classes.tabContent}
        ref={(elm) => { this.eAlbum = elm; }}
      >
        {
          this.state.selectedAlbumIndex === -1 ?
            <AlbumGrid
              albums={this.state.albums}
              onAlbumSelect={this.handleAlbumSelect}
            /> :
            <AlbumDetail
              playingId={this.props.playingId}
              playingStatus={this.props.playingStatus}
              album={this.state.albums[this.state.selectedAlbumIndex]}
              onAlbumSelect={this.handleAlbumSelect}
              onSongSelect={this.handleSongSelect}
              onFavoriteClick={this.handleFavoriteClick}
              onAddToPlaylistClick={onAddToPlaylistClick}
            />
        }
      </div>
    );
  }
}

Album.defaultProps = {
  playingId: null,
  playingStatus: null,
  onSongSelectInAlbum: () => {}
};

Album.propTypes = {
  playingId: PropTypes.string,
  playingStatus: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  onSongSelectInAlbum: PropTypes.func
};

export default withStyles(styles)(Album);
