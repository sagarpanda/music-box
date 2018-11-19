import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
  card: { },
  cardContent: {
    padding: 5
  },
  cardLabel: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  media: {
    height: 160
  }
};

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({ open: !state.open }));
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={24}>
        {
          this.props.albums.map((item, idx) => (
            <Grid item xs={6} sm={3} md={2} key={item.name}>
              <Card
                className={classes.card}
                onClick={() => this.props.onAlbumSelect(idx)}
              >
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={item.image}
                    title={item.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      component="h2"
                      className={classes.cardLabel}
                    >
                      { item.name }
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    );
  }
}

Album.defaultProps = {
  albums: [],
  onAlbumSelect: () => {}
};

Album.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  albums: PropTypes.array,
  onAlbumSelect: PropTypes.func
};

export default withStyles(styles)(Album);
