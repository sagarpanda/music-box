import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Audio.css';

class Audio extends Component {
  componentDidMount() {
    this.eAudio.addEventListener('error', (e) => {
      // this.props.onError(e);
      console.log('error', e);
    });

    // When enough of the file has downloaded to start playing
    this.eAudio.addEventListener('canplay', (e) => {
      // this.props.onCanPlay(e);
      console.log('canplay', e);
    });

    // When enough of the file has downloaded to play the entire file
    this.eAudio.addEventListener('canplaythrough', (e) => {
      // this.props.onCanPlayThrough(e);
      console.log('canplaythrough', e);
    });

    // When audio play starts
    this.eAudio.addEventListener('play', (e) => {
      this.setListenTrack();
      // this.props.onPlay(e);
      console.log('play', e);
    });

    // When unloading the audio player (switching to another src)
    this.eAudio.addEventListener('abort', (e) => {
      this.clearListenTrack();
      // this.props.onAbort(e);
      console.log('abort', e);
    });

    // When the file has finished playing to the end
    this.eAudio.addEventListener('ended', (e) => {
      this.clearListenTrack();
      // this.props.onEnded(e);
      console.log('ended', e);
    });

    // When the user pauses playback
    this.eAudio.addEventListener('pause', (e) => {
      this.clearListenTrack();
      // this.props.onPause(e);
      console.log('pause', e);
    });

    // When the user drags the time indicator to a new time
    this.eAudio.addEventListener('seeked', (e) => {
      this.clearListenTrack();
      // this.props.onSeeked(e);
      console.log('seeked', e);
    });

    this.eAudio.addEventListener('loadedmetadata', (e) => {
      // this.props.onLoadedMetadata(e);
      console.log('loadedmetadata', e);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.eAudio.load();
    this.eAudio.play();
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      // const listenInterval = this.props.listenInterval;
      const listenInterval = 1000;
      this.listenTracker = setInterval(() => {
        // this.props.onListen(this.eAudio.currentTime);
        // console.log(this.eAudio.currentTime)
      }, listenInterval);
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  render() {
    const path = this.props.song ? this.props.song.path : null;
    return (
      <div className="mp3audio">
        <audio
          controls
          preload="false"
          ref={(elm) => {
            this.eAudio = elm;
          }}
        >
          <track kind="captions" />
          <source src={path} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}

Audio.defaultProps = {
  song: null
};

Audio.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    path: PropTypes.string
  })
};

export default Audio;
