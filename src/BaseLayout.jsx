import React from 'react';
import {
  AppBar,
  IconButton,
  Layout,
  NavDrawer,
  Panel,
  Sidebar
} from 'react-toolbox';
import './BaseLayout.css';

class BaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerActive: false,
      drawerPinned: false,
      sidebarPinned: false,
      winHeight: window.innerHeight
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  toggleDrawerActive() {
    this.setState({ drawerActive: !this.state.drawerActive });
  }

  toggleDrawerPinned() {
    this.setState({ drawerPinned: !this.state.drawerPinned });
  }

  toggleSidebar() {
    this.setState({ sidebarPinned: !this.state.sidebarPinned });
  }

  updateDimensions() {
    this.setState({ winHeight: window.innerHeight });
  }

  render() {
    const xHeight = this.state.winHeight - 100;
    return (
      <Layout>
        <NavDrawer
          active={this.state.drawerActive}
          pinned={this.state.drawerPinned}
          permanentAt="xxxl"
          onOverlayClick={this.toggleDrawerActive}
        >
          <p>Navigation, account switcher, etc. go here.</p>
        </NavDrawer>
        <Panel>
          <AppBar leftIcon="menu" onLeftIconClick={this.toggleDrawerActive} />
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.8rem',
              height: xHeight
            }}
          >
            {this.props.children}
          </div>
        </Panel>
        <Sidebar pinned={this.state.sidebarPinned} width={5}>
          <div>
            <IconButton icon="close" onClick={this.toggleSidebar} />
          </div>
          <div style={{ flex: 1 }}>
            <p>Supplemental content goes here.</p>
          </div>
        </Sidebar>
      </Layout>
    );
  }
}

export default BaseLayout;
