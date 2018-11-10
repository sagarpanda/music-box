import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ldTrim from 'lodash/trim';
import axios from 'axios';
import AlbumGrid from './AlbumGrid';
import AlbumDetail from './AlbumDetail';

const styles = theme => ({
  tabContent: {
    padding: 12,
    overflow: 'auto'
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  card: {
    width: 250,
    float: 'left',
    margin: 12
  },
  media: {
    height: 200
  }
});

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // shape: {
      //   name, image, songsUrl,
      //   songs: [ { id, source, title, artist, hits, size } ]
      // }
      albums: [],
      selectedAlbumIndex: -1,
      pageNum: 0
    };
    this.loading = false;
    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
    this.handleSongSelect = this.handleSongSelect.bind(this);
  }
  componentDidMount() {
    window.album = this;
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
    window.clearInterval(this.interval);
  }
  fetchAlbums() {
    this.loading = true;
    const pageNum = this.state.pageNum + 1;
    if (pageNum < 24) {
      axios.get(`/api/webCrawler/movies/${pageNum}`)
        .then((response) => {
          const albums = response.data.map(item => ({
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
    const opt = { url: ob.songsUrl, label: ob.name };
    const encode = window.btoa(JSON.stringify(opt));
    axios.get(`/api/webCrawler/movieSongs/${encode}`)
      .then((response) => {
        const songs = response.data.map((item) => {
          const {
            id,
            artist,
            hits,
            size
          } = item;
          return {
            id,
            source: item.url,
            title: ldTrim(item.label),
            artist,
            hits,
            size
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
    const songs = ob.songs.map(item => ({ ...item, image: ob.image }));
    this.props.onSongSelectInAlbum(songId, songs);
  }
  handleAlbumSelect(index) {
    this.setState({ selectedAlbumIndex: index }, () => {
      if (index !== -1 && this.state.albums[index].songs === null) {
        this.fetchSongs(index);
      }
    });
  }
  render() {
    const { classes } = this.props;
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
              album={this.state.albums[this.state.selectedAlbumIndex]}
              onAlbumSelect={this.handleAlbumSelect}
              onSongSelect={this.handleSongSelect}
            />
        }
      </div>
    );
  }
}

Album.defaultProps = {
  onSongSelectInAlbum: () => {}
};

Album.propTypes = {
  playingId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  onSongSelectInAlbum: PropTypes.func
};

export default withStyles(styles)(Album);
