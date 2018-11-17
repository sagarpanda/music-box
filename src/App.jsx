import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ldFindIndex from 'lodash/findIndex';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Header from './common/Header';
import PlaylistContainer from './playlist/PlaylistContainer';
import AlbumContainer from './album/AlbumContainer';
import FavoriteContainer from './FavoriteContainer';
import AudioPlayer from './common/AudioPlayer';
import TabMenu from './common/TabMenu';
import './App.css';
import AppContext from './AppContext';

function NoMatch({ location }) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

const styles = {
  appContent: {
    flex: 1
  },
  tabWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  }
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPlaylist: [
        /* {
          trackId: '11',
          source: 'http://mrsinger.in/siteuploads/files/sfd4/1892/Ariana%20Grande%20-%20Side%20To%20Side%20ft.%20Nicki%20Minaj(MrSinger.In).mp3',
          title: 'Side to Side',
          artist: 'Ariana Grande',
          image: 'https://pm1.narvii.com/6329/b3fa4068df8d44333c78e685d38d4c448215191c_hq.jpg',
          size: '3.63 mb',
          albumId: '1',
          albumName: 'My Album'
        },
        {
          trackId: '12',
          source: 'http://mrsinger.in/siteuploads/files/sfd4/1904/Fifth%20Harmony%20-%20Work%20from%20Home%20ft.%20Ty%20Dolla(MrSinger.In).mp3',
          title: 'Work from Home',
          artist: 'Fifth Harmony',
          image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Work_From_Home_%28featuring_Ty_Dolla_%24ign%29_%28Official_Single_Cover%29_by_Fifth_Harmony.png/220px-Work_From_Home_%28featuring_Ty_Dolla_%24ign%29_%28Official_Single_Cover%29_by_Fifth_Harmony.png',
          size: '3.36 mb',
          albumId: '1',
          albumName: 'My Album'
        } */
      ],
      playingId: null,
      playingStatus: 'pause' // play, plause, stop
    };
    this.handleNextPlay = this.handleNextPlay.bind(this);
    this.handlePrevPlay = this.handlePrevPlay.bind(this);
    this.handlePlayPauseToggle = this.handlePlayPauseToggle.bind(this);
    this.handleSongChange = this.handleSongChange.bind(this);
    this.handleSongSelectInAlbum = this.handleSongSelectInAlbum.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleAddToPlaylistClick = this.handleAddToPlaylistClick.bind(this);
  }

  getCurrentPlayDetail() {
    const { currentPlaylist, playingId } = this.state;
    const index = ldFindIndex(currentPlaylist, { trackId: playingId });
    return { ...currentPlaylist[index] };
  }

  handleSongSelectInAlbum(playingId, currentPlaylist) {
    const { playingId: id, playingStatus } = this.state;
    let status = 'pause';
    if (playingId === id) {
      status = playingStatus;
    }
    this.setState({ playingId, currentPlaylist, playingStatus: status });
  }

  handleSongChange(option) {
    const { playingId, playingStatus } = this.state;
    let status = 'pause';
    if (playingId === option.trackId) {
      status = playingStatus;
    }
    this.setState({ playingId: option.trackId, playingStatus: status });
  }

  updatePlaylistFav(isChecked, track) {
    const currentPlaylist = this.state.map((item) => {
      let rtn = item;
      if (item.trackId === track.trackId) {
        rtn = { ...item, isFavorite: isChecked };
      }
      return rtn;
    });
    this.setState({ currentPlaylist });
  }

  handleFavoriteClick(isChecked, song) {
    console.log('asd', this.state.playingId, isChecked);
    if (isChecked) {
      axios.post('/api/user/favorite', song)
        .then((response) => {
          console.log('response', response);
        })
        .catch(err => console.log(err));
    } else {
      axios.delete('/api/user/favorite', { data: { trackId: song.trackId } })
        .then((response) => {
          console.log('response', response);
        })
        .catch(err => console.log(err));
    }
  }

  handleAddToPlaylistClick(song) {
    const { currentPlaylist } = this.state;
    // console.log(song);
    /* axios.post('/api/user/playlist', song)
      .then((response) => {
        console.log('response', response);
      })
      .catch(err => console.log(err)); */
    this.setState({ currentPlaylist: [...currentPlaylist, song] });
  }

  handleNextPlay() {
    const { currentPlaylist, playingId, playingStatus } = this.state;
    const index = ldFindIndex(currentPlaylist, { trackId: playingId });
    const nextIndex = currentPlaylist.length > (index + 1) ? (index + 1) : 0;

    let status = 'pause';
    if (currentPlaylist.length === 1) {
      status = playingStatus;
    }

    this.setState({ playingId: currentPlaylist[nextIndex].trackId, playingStatus: status });
  }

  handlePrevPlay() {
    const { currentPlaylist, playingId, playingStatus } = this.state;
    const index = ldFindIndex(currentPlaylist, { trackId: playingId });
    const prevIndex = (index - 1) > -1 ? (index - 1) : (currentPlaylist - 1);

    let status = 'pause';
    if (currentPlaylist.length === 1) {
      status = playingStatus;
    }

    this.setState({ playingId: currentPlaylist[prevIndex].trackId, playingStatus: status });
  }

  handlePlayPauseToggle(status) {
    this.setState({ playingStatus: status });
  }

  render() {
    const { classes } = this.props;
    const currentPlay = this.getCurrentPlayDetail();
    const provideProps = {
      ...this.state,
      onSongSelectInAlbum: this.handleSongSelectInAlbum,
      onFavoriteClick: this.handleFavoriteClick,
      onAddToPlaylistClick: this.handleAddToPlaylistClick,
      onSongChange: this.handleSongChange
    };
    return (
      <AppContext.Provider value={provideProps}>
        <Router>
          <Fragment>
            <Header>
              <Route path="/" component={TabMenu} />
            </Header>
            <Grid className={classes.appContent} container>
              <Grid item className={classes.tabWrapper}>
                <Switch>
                  <Route path="/" exact component={AlbumContainer} />
                  <Route path="/album" component={AlbumContainer} />
                  <Route path="/playlist" component={PlaylistContainer} />
                  <Route path="/favorites" component={FavoriteContainer} />
                  <Route component={NoMatch} />
                </Switch>
              </Grid>
            </Grid>
            {
              this.state.playingId &&
                <AudioPlayer
                  {...currentPlay}
                  onPlayPauseToggle={this.handlePlayPauseToggle}
                  onNext={this.handleNextPlay}
                  onPrev={this.handlePrevPlay}
                />
            }
          </Fragment>
        </Router>
      </AppContext.Provider>
    );
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
