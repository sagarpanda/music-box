import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ldFindIndex from 'lodash/findIndex';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';
import Playlist from './Playlist';
import Album from './Album';
import AudioPlayer from './AudioPlayer';
import TabMenu from './TabMenu';
import './App.css';

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
        {
          id: '11',
          source: 'http://mrsinger.in/siteuploads/files/sfd4/1892/Ariana%20Grande%20-%20Side%20To%20Side%20ft.%20Nicki%20Minaj(MrSinger.In).mp3',
          title: 'Side to Side',
          artist: 'Ariana Grande',
          image: 'https://pm1.narvii.com/6329/b3fa4068df8d44333c78e685d38d4c448215191c_hq.jpg',
          size: '3.63mb'
        },
        {
          id: '12',
          source: 'http://mrsinger.in/siteuploads/files/sfd4/1904/Fifth%20Harmony%20-%20Work%20from%20Home%20ft.%20Ty%20Dolla(MrSinger.In).mp3',
          title: 'Work from Home',
          artist: 'Fifth Harmony',
          image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Work_From_Home_%28featuring_Ty_Dolla_%24ign%29_%28Official_Single_Cover%29_by_Fifth_Harmony.png/220px-Work_From_Home_%28featuring_Ty_Dolla_%24ign%29_%28Official_Single_Cover%29_by_Fifth_Harmony.png',
          size: '3.36mb'
        }
      ],
      playingId: '11',
      selectedTabIndex: 0
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleNextPlay = this.handleNextPlay.bind(this);
    this.handlePrevPlay = this.handlePrevPlay.bind(this);
    this.handleSongChange = this.handleSongChange.bind(this);
    this.handleSongSelectInAlbum = this.handleSongSelectInAlbum.bind(this);
  }

  getCurrentPlayDetail() {
    const { currentPlaylist, playingId } = this.state;
    const index = ldFindIndex(currentPlaylist, { id: playingId });
    return { ...currentPlaylist[index] };
  }

  getTabContent() {
    let component = null;
    if (this.state.selectedTabIndex === 0) {
      component = (
        <Album
          playingId={this.state.playingId}
          onSongSelectInAlbum={this.handleSongSelectInAlbum}
        />
      );
    } else if (this.state.selectedTabIndex === 1) {
      component = (
        <Playlist
          hideAddToPlaylist
          playingId={this.state.playingId}
          data={this.state.currentPlaylist}
          onChange={this.handleSongChange}
        />
      );
    }
    return component;
  }

  handleTabChange(e, tabIndex) {
    this.setState({ selectedTabIndex: tabIndex });
  }

  handleSongSelectInAlbum(playingId, currentPlaylist) {
    this.setState({ playingId, currentPlaylist });
  }

  handleSongChange(option) {
    this.setState({ playingId: option.id });
  }

  handleNextPlay() {
    const { currentPlaylist, playingId } = this.state;
    const index = ldFindIndex(currentPlaylist, { id: playingId });
    const nextIndex = currentPlaylist.length > (index + 1) ? (index + 1) : 0;
    this.setState({ playingId: currentPlaylist[nextIndex].id });
  }

  handlePrevPlay() {
    const { currentPlaylist, playingId } = this.state;
    const index = ldFindIndex(currentPlaylist, { id: playingId });
    const prevIndex = (index - 1) > -1 ? (index - 1) : (currentPlaylist - 1);
    this.setState({ playingId: currentPlaylist[prevIndex].id });
  }

  render() {
    const { classes } = this.props;
    const currentPlay = this.getCurrentPlayDetail();
    const tabContent = this.getTabContent();
    return (
      <Fragment>
        <Header>
          <TabMenu
            selectedTabIndex={this.state.selectedTabIndex}
            onChange={this.handleTabChange}
          />
        </Header>
        <Grid className={classes.appContent} container>
          <Grid item className={classes.tabWrapper}>
            { tabContent }
          </Grid>
        </Grid>
        <AudioPlayer
          {...currentPlay}
          onNext={this.handleNextPlay}
          onPrev={this.handlePrevPlay}
        />
      </Fragment>
    );
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
