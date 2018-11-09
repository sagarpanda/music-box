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
          source: 'http://dl2.djring.com/hd1.djring.com/320/490104/Bom+Diggy+Diggy+-+Jasmin+Walia+Zack+Knight%20(DJJOhAL.Com).mp3',
          title: 'Bom Diggy Diggy (Sonu Ke Titu Ki Sweety)',
          artist: 'Jasmin Walia, Zack Knight',
          image: 'https://content.hungama.com/audio%20track/display%20image/300x300%20jpeg/3749390405.jpg'
        },
        {
          id: '12',
          source: 'https://mymp3singer.fun/files/download/type/320/id/66559',
          title: 'Akh Lad Jaa',
          artist: 'Loveyatri'
        },
        {
          id: '13',
          source: 'https://mymp3singer.fun/files/download/type/320/id/70555',
          title: 'Proper Patola',
          artist: 'Namaste England'
        },
        {
          id: '15',
          source: 'http://data2.mymp3singer.fun/files/sfd144/71776/Lori_320(MyMp3Singer).mp3',
          title: 'Lori - Thugs of Hindostan',
          artist: 'ab'
        },
        {
          id: '14',
          source: 'https://mymp3singer.fun/files/download/type/320/id/66580',
          title: 'Aao Kabhi Haveli Pe',
          artist: 'Stree'
        }
      ],
      playingId: '15',
      selectedTabIndex: 1
    };
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleNextPlay = this.handleNextPlay.bind(this);
    this.handlePrevPlay = this.handlePrevPlay.bind(this);
    this.handleTrackChange = this.handleTrackChange.bind(this);
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
        <Playlist
          data={this.state.currentPlaylist}
          onChange={this.handleTrackChange}
        />
      );
    } else if (this.state.selectedTabIndex === 1) {
      component = <Album />;
    }
    return component;
  }

  handleTabChange(e, tabIndex) {
    this.setState({ selectedTabIndex: tabIndex });
  }

  handleTrackChange(option) {
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
