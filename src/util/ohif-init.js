import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import {
  ExtensionManager,
  CommandsManager,
  ServicesManager,
  HotkeysManager,
  MeasurementService,
  DICOMWeb
} from '@ohif/core';
import OHIFCornerstoneExtension from '../cs-extension/src/index';
import * as cornerstoneTools from 'cornerstone-tools';
import * as Hammer from 'hammerjs';
import * as cornerstoneMath from 'cornerstone-math';

import store from '../redux/store';

let extensionManager;

export default function init() {
  localStorage.setItem("debug", "cornerstoneTools");

  // Init basic cornerstone
  window.cornerstone = cornerstone;
  window.cornerstoneWADOImageLoader = cornerstoneWADOImageLoader;

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  cornerstoneWADOImageLoader.configure({
    beforeSend: (xhr) => {
      const headers = DICOMWeb.getAuthorizationHeader();

      if (headers.Authorization) {
        xhr.setRequestHeader('Authorization', headers.Authorization);
      }
    },
    errorInterceptor: (error) => {
      console.log("WADO ERR", error);
    }
  });

  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.Hammer = Hammer;

  // Init app
  const commandsManagerConfig = {
    getAppState: () => store.getState(),
    getActiveContexts: () => [],
  };

  // Init managers
  const commandsManager = new CommandsManager(commandsManagerConfig);
  const servicesManager = new ServicesManager();
  const hotkeysManager = new HotkeysManager(commandsManager, servicesManager);

  // Init services
  servicesManager.registerServices([MeasurementService]);

  // Init extensions
  extensionManager = new ExtensionManager({
    commandsManager,
    servicesManager,
    api: {},
  });

  window.ohif = {};
  window.ohif.app = {
    commandsManager,
    hotkeysManager,
    servicesManager,
    extensionManager,
  };

  extensionManager.registerExtension(OHIFCornerstoneExtension);
}

export { extensionManager };
