import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  metadata, utils, MODULE_TYPES, redux,
} from '@ohif/core';

import { extensionManager } from '../util/ohif-init';
import { getStudies, setStudies } from '../redux/reducers/meta-reducer';
import { loadStudyMetaData } from '../util/dicom-web';

const { setStudyData } = redux.actions;
const { studyMetadataManager } = utils;
const { OHIFStudyMetadata } = metadata;

const Viewer = () => {
  const dispatch = useDispatch();
  const [studyMeta, setStudyMeta] = useState({});

  const StudyInstanceUID = '1.3.6.1.4.1.25403.345050719074.3824.20170125095438.5';

  useEffect(() => {
    async function load() {
      // --- Fetch the study ---
      const study = await loadStudyMetaData(StudyInstanceUID);

      // --- Create displaySets ---
      const studyMetaData = new OHIFStudyMetadata(study, StudyInstanceUID);
      const sopModule = extensionManager?.modules?.sopClassHandlerModule;

      if (!study.displaySets) {
        const displaySets = studyMetaData.createDisplaySets(sopModule);
        study.displaySets = displaySets;
        dispatch({ type: 'SET_STUDY_DISPLAY_SETS', StudyInstanceUID, displaySets });
      }

      if (study.derivedDisplaySets) {
        studyMetaData._addDerivedDisplaySets(study.derivedDisplaySets);
      }

      if (!studyMetadataManager.get(StudyInstanceUID)) {
        studyMetadataManager.add(studyMetaData);
      }

      // -- Sort displaySets to the series
      const {
        series, displaySets,
      } = study;

      const displaySetToSeries = (ds, ser) => ds.SeriesInstanceUID === ser.SeriesInstanceUID;

      const seriesWithDisplaySets = series.map((ser) => {
        const [displaySet] = displaySets.filter((ds) => displaySetToSeries(ds, ser));

        return {
          ...ser,
          ...displaySet,
        };
      });

      study.series = seriesWithDisplaySets;

      // --- Finalize by saving the collected/created data ---
      const thinStudyData = {
        StudyInstanceUID,
        series: study.series.map(({ SeriesInstanceUID }) => ({ SeriesInstanceUID })),
      };
      dispatch(setStudyData(StudyInstanceUID, thinStudyData));
      dispatch(setStudies([study]));
      setStudyMeta(study);

      const innerSelectedSeries = study.series[0];

      // --- Load first series to viewport ---
      dispatch({
        type: 'VIEWPORT::SET_SPECIFIC_DATA',
        viewportIndex: 0,
        viewportSpecificData: {
          plugin: 'cornerstone',
          ...innerSelectedSeries,
          InstanceNumber: 1,
        },
      });
    }
    if (extensionManager?.modules?.sopClassHandlerModule) {
      load();
    }
  }, [extensionManager, extensionManager.module]);

  const ViewportComponent = extensionManager.modules[MODULE_TYPES.VIEWPORT][0].module;

  const studies = useSelector(getStudies);
  const displaySet = useSelector((state) => state.viewports.viewportSpecificData[0]);

  const viewportData = {
    displaySet: displaySet || {},
    studies,
  };

  const {
    series = [],
    PatientName,
    PatientID,
  } = studyMeta;

  const selectedSeries = series[0] || {};
  const {
    SeriesInstanceUID,
  } = selectedSeries;

  return (
    <>
      SE-Viewer: The thinnest
      <div>
        <div>
          {`StudyInstanceUID: ${StudyInstanceUID}`}
        </div>
        <div>
          {`Number of series: ${series.length}`}
        </div>
        <div>
          {`Patient: ${PatientName} (${PatientID})`}
        </div>
        <div>
          {`Selected Series: ${SeriesInstanceUID}`}
        </div>
      </div>
      <div data-cy="panel" style={{ height: '500px', width: '500px', backgroundColor: '#000' }}>
        <ViewportComponent
          viewportIndex={0}
          viewportData={viewportData}
        />
      </div>
    </>
  );
};

export default Viewer;
