import React, { Component } from 'react';
import './Audio.css';

class Audio extends Component {

    componentDidMount() {

        const eAudio = this.eAudio;
        eAudio.addEventListener('error', (e) => {
          //this.props.onError(e);
          console.log('error');
        });

        // When enough of the file has downloaded to start playing
        eAudio.addEventListener('canplay', (e) => {
          //this.props.onCanPlay(e);
          console.log('canplay');
        });

        // When enough of the file has downloaded to play the entire file
        eAudio.addEventListener('canplaythrough', (e) => {
          //this.props.onCanPlayThrough(e);
          console.log('canplaythrough');
        });

        // When audio play starts
        eAudio.addEventListener('play', (e) => {
          this.setListenTrack();
          //this.props.onPlay(e);
          console.log('play');
        });

        // When unloading the audio player (switching to another src)
        eAudio.addEventListener('abort', (e) => {
          this.clearListenTrack();
          //this.props.onAbort(e);
          console.log('abort');
        });

        // When the file has finished playing to the end
        eAudio.addEventListener('ended', (e) => {
          this.clearListenTrack();
          //this.props.onEnded(e);
          console.log('ended');
        });

        // When the user pauses playback
        eAudio.addEventListener('pause', (e) => {
          this.clearListenTrack();
          //this.props.onPause(e);
          console.log('pause');
        });

        // When the user drags the time indicator to a new time
        eAudio.addEventListener('seeked', (e) => {
          this.clearListenTrack();
          //this.props.onSeeked(e);
          console.log('seeked');
        });

        eAudio.addEventListener('loadedmetadata', (e) => {
          //this.props.onLoadedMetadata(e);
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
        //const listenInterval = this.props.listenInterval;
        const listenInterval = 1000;
        this.listenTracker = setInterval(() => {
          //this.props.onListen(this.eAudio.currentTime);
          //console.log(this.eAudio.currentTime)
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
                <audio controls
                    preload="false"
                    ref={elm => {this.eAudio = elm}}>
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

export default Audio;
