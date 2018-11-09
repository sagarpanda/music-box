import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import LinearProgress from '@material-ui/core/LinearProgress';
import AudioNative from './AudioNative';


/* function getTimeLeft(currentTime, duration) {
  const timeLeft = duration - currentTime;
  let s = timeLeft % 60;
  let m = Math.floor(timeLeft / 60) % 60;
  s = s < 10 ? `0${s}` : s;
  m = m < 10 ? `0${m}` : m;
  const time = `${m}:${s}`;
  return time;
} */
function getFormattedTime(currentTime) {
  let s = currentTime % 60;
  let m = parseInt((currentTime / 60) % 60, 10);
  s = s < 10 ? `0${s}` : s;
  m = m < 10 ? `0${m}` : m;
  const time = `${m}:${s}`;
  return time;
}

const styles = theme => ({
  card: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto',
    paddingBottom: 0
  },
  cover: {
    width: 151
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  },
  progress: {
    flex: 1,
    marginLeft: 5
  },
  duration: {
    padding: 12
  }
});

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadedMetadata: false,
      playOnLoadMeta: false,
      isPaused: true,
      elapsedTime: '00:00',
      duration: '00:00',
      buffered: 0,
      progress: 0
    };
    // Audio Events
    this.setAudioElmRef = this.setAudioElmRef.bind(this);
    this.setAudioSrcElmRef = this.setAudioSrcElmRef.bind(this);
    this.handleAudioError = this.handleAudioError.bind(this);
    this.handleAudioCanPlay = this.handleAudioCanPlay.bind(this);
    this.handleAudioCanPlayThrough = this.handleAudioCanPlayThrough.bind(this);
    this.handleAudioPlay = this.handleAudioPlay.bind(this);
    this.handleAudioAbort = this.handleAudioAbort.bind(this);
    this.handleAudioEnded = this.handleAudioEnded.bind(this);
    this.handleAudioPause = this.handleAudioPause.bind(this);
    this.handleAudioSeeked = this.handleAudioSeeked.bind(this);
    this.handleAudioLoadedMetadata = this.handleAudioLoadedMetadata.bind(this);
    this.handleAudioTimeUpdate = this.handleAudioTimeUpdate.bind(this);
    // Player Events
    this.handlePlayClick = this.handlePlayClick.bind(this);
  }
  componentDidMount() {
    window.player = this;
    this.eAudio.addEventListener('error', this.handleAudioError);

    // When enough of the file has downloaded to start playing
    this.eAudio.addEventListener('canplay', this.handleAudioCanPlay);

    // When enough of the file has downloaded to play the entire file
    this.eAudio.addEventListener('canplaythrough', this.handleAudioCanPlayThrough);

    // When audio play starts
    this.eAudio.addEventListener('play', this.handleAudioPlay);

    // When unloading the audio player (switching to another src)
    this.eAudio.addEventListener('abort', this.handleAudioAbort);

    // When the file has finished playing to the end
    this.eAudio.addEventListener('ended', this.handleAudioEnded);

    // When the user pauses playback
    this.eAudio.addEventListener('pause', this.handleAudioPause);

    // When the user drags the time indicator to a new time
    this.eAudio.addEventListener('seeked', this.handleAudioSeeked);

    this.eAudio.addEventListener('loadedmetadata', this.handleAudioLoadedMetadata);

    this.eAudio.addEventListener('timeupdate', this.handleAudioTimeUpdate);
  }
  componentDidUpdate() {
    if (this.eAudioSrc.src !== this.props.source) {
      this.eAudioSrc.src = this.props.source;
      this.eAudio.load();
    }
  }
  setAudioElmRef(elm) {
    this.eAudio = elm;
  }
  setAudioSrcElmRef(elm) {
    this.eAudioSrc = elm;
  }
  handleAudioError(e) {
    // this.props.onError(e);
    console.log('error', e, this.eAudio);
  }
  handleAudioCanPlay(e) {
    // this.props.onCanPlay(e);
    console.log('canplay', e, this.eAudio);
  }
  handleAudioCanPlayThrough(e) {
    // this.props.onCanPlayThrough(e);
    console.log('canplaythrough', e, this.eAudio);
  }
  handleAudioPlay() {
    this.setState({ isPaused: false });
  }
  handleAudioAbort(e) {
    // this.props.onAbort(e);
    console.log('abort', e, this.eAudio);
    this.setState({
      isLoadedMetadata: false,
      playOnLoadMeta: true,
      isPaused: true,
      elapsedTime: '00:00',
      progress: 0,
      buffered: 0
    });
  }
  handleAudioEnded(e) {
    console.log('ended', e, this.eAudio);
    this.eAudio.pause();
    /* this.setState({
      playOnLoadMeta: true,
      isPaused: true,
      elapsedTime: '00:00',
      progress: 0,
      buffered: 100
    }) ;*/
  }
  handleAudioPause() {
    this.setState({ isPaused: true });
  }
  handleAudioSeeked(e) {
    console.log('seeked', e, this.eAudio);
  }
  handleAudioLoadedMetadata(e) {
    const { playOnLoadMeta } = this.state;
    console.log('loadedmetadata', e);
    let duration = parseInt(this.eAudio.duration, 10);
    duration = getFormattedTime(duration);
    this.setState({
      isLoadedMetadata: true,
      duration,
      playOnLoadMeta: false
    }, () => {
      if (playOnLoadMeta) {
        this.eAudio.play();
      }
    });
  }
  handleAudioTimeUpdate() {
    const duration = parseInt(this.eAudio.duration, 10);
    const currentTime = parseInt(this.eAudio.currentTime, 10);
    const elapsedTime = getFormattedTime(currentTime, duration);

    let buffered = 0;
    if (this.eAudio.buffered.length > 0) {
      buffered = (this.eAudio.buffered.end(0) * 100) / duration;
    }
    buffered = parseFloat(buffered.toFixed(2));

    let progress = (currentTime * 100) / duration;
    progress = parseFloat(progress.toFixed(2));

    this.setState({ elapsedTime, progress, buffered });
  }
  handlePlayClick() {
    if (this.state.isPaused) {
      this.eAudio.play();
    } else {
      this.eAudio.pause();
    }
  }
  handlePauseClick() {
    this.eAudio.pause();
  }
  render() {
    const { classes, theme } = this.props;
    const {
      isLoadedMetadata,
      isPaused,
      elapsedTime,
      duration,
      progress,
      buffered
    } = this.state;
    return (
      <Card className={classes.card}>
        <AudioNative
          setAudioElmRef={this.setAudioElmRef}
          setAudioSrcElmRef={this.setAudioSrcElmRef}
          source={this.props.source}
        />
        <CardMedia
          className={classes.cover}
          image={this.props.image}
          title="Live from space album cover"
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="title">
              {this.props.title} &nbsp;
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {this.props.artist} {elapsedTime} / {duration}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton disabled={!isLoadedMetadata} aria-label="Previous" onClick={this.props.onPrev}>
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton
              disabled={!isLoadedMetadata}
              aria-label="Play/pause"
              onClick={this.handlePlayClick}
            >
              {
                isPaused ?
                  <PlayArrowIcon className={classes.playIcon} /> :
                  <PauseIcon className={classes.playIcon} />
              }
            </IconButton>
            <IconButton disabled={!isLoadedMetadata} aria-label="Next" onClick={this.props.onNext}>
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
            <LinearProgress className={classes.progress} variant="buffer" value={progress} valueBuffer={buffered} />
            <Typography
              className={classes.duration}
              component="span"
              variant="subheading"
              color="textSecondary"
            >
              {duration}
            </Typography>
          </div>
        </div>
      </Card>
    );
  }
}

AudioPlayer.defaultProps = {
  image: 'https://i.imgur.com/aQs9CC6.jpg',
  artist: '',
  onNext: () => {},
  onPrev: () => {}
};

AudioPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  image: PropTypes.string,
  onNext: PropTypes.func,
  onPrev: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(AudioPlayer);
