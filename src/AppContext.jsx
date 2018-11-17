import React from 'react';

const AppContext = React.createContext({
  currentPlaylist: [],
  toggleTheme: () => {}
});

export default AppContext;
