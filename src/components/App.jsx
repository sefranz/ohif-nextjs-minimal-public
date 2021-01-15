import React from 'react';
import NextApp from 'next/app';
import { Provider } from 'react-redux';

import store from '../redux/store';
import initOHIF from '../util/ohif-init';

class App extends NextApp {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    initOHIF();

    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default App;
