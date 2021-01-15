import { studies } from '@ohif/core';

const server = {
  name: 'DCM4CHEE',
  wadoUriRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado',
  qidoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
  wadoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
  qidoSupportsIncludeField: true,
  imageRendering: 'wadors',
  thumbnailRendering: 'wadors',
  enableStudyLazyLoad: true,
  supportsFuzzyMatching: true,
};

export async function searchStudies(filters = {}) {
  return studies.searchStudies(server, filters);
}

export async function loadStudyMetaData(studyInstanceUID) {
  return studies.retrieveStudyMetadata(server, studyInstanceUID);
}

// export async function searchStudySeries(studyUID) {
//   return get(`/dicom-web/studies/${studyUID}/series?includeField=0008103E`);
// }

// export async function loadSeriesInstances(studyUID, seriesUID) {
//   return get(`/dicom-web/studies/${studyUID}/series/${seriesUID}/instances`);
// }
