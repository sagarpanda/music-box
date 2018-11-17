import React from 'react';
import AppContext from './../AppContext';
import Album from './Album';

function AlbumContainer() {
  return (
    <AppContext.Consumer>
      {
        ({
          playingId, playingStatus, onSongSelectInAlbum, onFavoriteClick, onAddToPlaylistClick
        }) => (
          <Album
            playingId={playingId}
            playingStatus={playingStatus}
            onSongSelectInAlbum={onSongSelectInAlbum}
            onFavoriteClick={onFavoriteClick}
            onAddToPlaylistClick={onAddToPlaylistClick}
          />
        )
      }
    </AppContext.Consumer>
  );
}

export default AlbumContainer;
