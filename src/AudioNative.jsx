import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  hiddenPlayer: {
    display: 'none'
  }
};

class AudioNative extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { classes } = this.props;
    // const path = 'http://data2.mymp3singer.fun/files/sfd144/71725/Manzoor%20E%20Khuda_64(MyMp3Singer).mp3';
    const path = this.props.source;
    return (
      <div className={classes.hiddenPlayer}>
        <audio
          controls
          preload="false"
          ref={this.props.setAudioElmRef}
        >
          <track kind="captions" />
          <source ref={this.props.setAudioSrcElmRef} src={path} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}

AudioNative.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  setAudioElmRef: PropTypes.func.isRequired,
  setAudioSrcElmRef: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired
};

export default withStyles(styles)(AudioNative);
