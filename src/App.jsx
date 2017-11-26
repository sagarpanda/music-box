import React from 'react';
import BaseLayout from './BaseLayout';
import Audio from './Audio';
import SongList from './SongList';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      song: null
    };
    this.onSongChange = this.onSongChange.bind(this);
  }

  onSongChange(song) {
    this.setState({ song });
  }

  render() {
    return (
      <BaseLayout>
        <div>
          <div>Hello</div>
          <SongList onChange={this.onSongChange} />
          <Audio song={this.state.song} />
        </div>
      </BaseLayout>
    );
  }
}

export default App;
