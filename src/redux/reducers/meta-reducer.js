import autodux from 'autodux';

const {
  reducer,
  selectors: {
    getPatientName,
    getPatientBirthdate,
    getStudies,
  },
  actions: {
    setPatientName,
    setPatientBirthdate,
    setStudies,
  },
} = autodux({
  slice: 'meta',
  initial: {
    patientName: undefined,
    patientBirthdate: undefined,
    studies: [],
  },
});

export {
  getPatientName,
  setPatientName,
  getPatientBirthdate,
  setPatientBirthdate,
  getStudies,
  setStudies,
};

export default reducer;
