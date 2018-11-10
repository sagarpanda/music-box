import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
  card: {
    width: 122,
    float: 'left',
    margin: 12
  },
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
      <Fragment>
        {
          this.props.albums.map((item, idx) => (
            <Card
              className={classes.card}
              key={item.name}
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
          ))
        }
      </Fragment>
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
