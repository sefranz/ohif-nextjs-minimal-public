import React from 'react';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../components/App'), { ssr: false });

const DynamicApp = (props) => <App {...props} />;

export default DynamicApp;
