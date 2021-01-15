import {
  all, put, select, takeEvery,
} from 'redux-saga/effects';

import {
  getStudies, setStudies,
} from '../reducers/meta-reducer';

function* setStudyDisplaySets({ StudyInstanceUID, displaySets }) {
  const currentStudies = yield select(getStudies);

  currentStudies.forEach((study) => {
    if (study.StudyInstanceUID === StudyInstanceUID) {
      study.displaySets = displaySets;
    }
  });

  yield put(setStudies(currentStudies));
}

export default function* rootSaga() {
  yield all([
    takeEvery('SET_STUDY_DISPLAY_SETS', setStudyDisplaySets),
  ]);
}
