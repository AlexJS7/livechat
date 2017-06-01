import React, { PropTypes } from 'react';

import Header from './Header';

const styles = {
  mainWrapper: {
    overflow: 'hidden',
    width: '100%',
    background: '#efefef',
    maxHeight: '100vh',
  },
  contentWrapper: {
    width: '100%',
    margin: '0 auto',
    boxShadow: '0 0 20px -8px rgba(0, 0, 0, 0.4)',
  },
  mainBody: {
    zIndex: '1',
    paddingTop: '98px',
    display: 'flex',
    height: '100vh',
  },
};

const Main = ({ children }) => (
  <div className="mainWrapper" style={styles.mainWrapper}>
    <div className="contentWrapper" style={styles.contentWrapper}>
      <Header />
      <div className="mainBody" style={styles.mainBody}>
        {children}
      </div>
    </div>
  </div>
);

Main.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Main;
