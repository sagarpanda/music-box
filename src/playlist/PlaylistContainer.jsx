import React from 'react';
import AppContext from './../AppContext';
import Playlist from './Playlist';

function PlaylistContainer() {
  return (
    <AppContext.Consumer>
      {
        ({
          playingId, playingStatus, currentPlaylist, onSongChange, onFavoriteClick
        }) => (
          <Playlist
            hideAddToPlaylist
            playingId={playingId}
            playingStatus={playingStatus}
            data={currentPlaylist}
            onChange={onSongChange}
            onFavoriteClick={onFavoriteClick}
          />
        )
      }
    </AppContext.Consumer>
  );
}

export default PlaylistContainer;
