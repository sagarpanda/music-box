import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Playlist from './Playlist';

const styles = {
  card: {
    width: 250,
    margin: 12
  },
  media: {
    height: 250
  },
  button: {
    marginLeft: 12,
    marginTop: 8
  },
  listContent: {
    flex: 1
  }
};

class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleTrackChange = this.handleTrackChange.bind(this);
  }
  handleTrackChange(a) {
    this.props.onSongSelect(a.id);
  }
  render() {
    const { classes, album } = this.props;
    return (
      <Grid container>
        <Grid item>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={() => this.props.onAlbumSelect(-1)}
          >
            Back to Album
          </Button>
          <Card className={classes.card} key={album.name}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={album.image}
                title={album.name}
              />
              <CardContent>
                <Typography gutterBottom variant="subtitle2" component="h2">
                  { album.name }
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item className={classes.listContent}>
          {
            album.songs && <Playlist
              playingId={this.props.playingId}
              data={album.songs}
              onChange={this.handleTrackChange}
            />
          }
        </Grid>
      </Grid>
    );
  }
}

AlbumDetail.defaultProps = {
  onSongSelect: () => {},
  onAlbumSelect: () => {}
};

AlbumDetail.propTypes = {
  playingId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  album: PropTypes.object.isRequired,
  onSongSelect: PropTypes.func,
  onAlbumSelect: PropTypes.func
};

export default withStyles(styles)(AlbumDetail);
