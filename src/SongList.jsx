import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      list: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios
      .get('https://dl.dropboxusercontent.com/s/hcsfaakjd2y2sfj/songs.json?dl=1')
      .then((response) => {
        this.setState({
          list: response.data
        });
      })
      .catch((error) => {});
  }

  handleChange(index) {
    const song = { ...this.state.list[index] };
    this.props.onChange(song);
    this.setState({
      value: index
    });
  }

  render() {
    return (
      <RadioGroup
        value={this.state.value}
        onChange={this.handleChange}
        style={{ height: 300 }}
      >
        {this.state.list.map((item, index) => (
          <RadioButton
            key={index}
            label={item.title}
            value={index.toString()}
          />
        ))}
      </RadioGroup>
    );
  }
}

SongList.defaultProps = {
  onChange: () => {}
};

SongList.propTypes = {
  onChange: PropTypes.func
};

export default SongList;
