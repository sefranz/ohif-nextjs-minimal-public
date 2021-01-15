import React from 'react';
import dynamic from 'next/dynamic';

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false})

const PatientViewerPage = () => (
  <div className="container">
      <main>
        <Viewer />
      </main>
    </div>
);

export default PatientViewerPage;
