import React, { Component } from 'react';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import list from './SongData';

class SongList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(index) {
        const song = { ...list[index] };
        this.props.onChange(song);
        this.setState({
            value: index
        })
    }

    render() {
        return (
            <RadioGroup
                value={this.state.value}
                onChange={this.handleChange}
                style={{height:300}}>
                {
                    list.map((item, index) => {
                        return (
                            <RadioButton
                                key={index}
                                label={item.title}
                                value={index.toString()}
                            />
                        )
                    })
                }
            </RadioGroup>
        )
    }

}

export default SongList;
