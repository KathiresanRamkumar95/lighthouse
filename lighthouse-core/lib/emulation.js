/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// @ts-nocheck
'use strict';

/**
 * Nexus 5X metrics adapted from emulated_devices/module.json
 */

const customConf = require('./customConfiguration.js');
const TYPICAL_MOBILE_THROTTLING_METRICS = customConf.TYPICAL_MOBILE_THROTTLING_METRICS;
const NO_THROTTLING_METRICS = customConf.NO_THROTTLING_METRICS;
const NO_CPU_THROTTLE_METRICS = customConf.NO_CPU_THROTTLE_METRICS;
const CPU_4XTHROTTLE_METRICS = customConf.CPU_4XTHROTTLE_METRICS;
const CPU_6XTHROTTLE_METRICS = customConf.CPU_6XTHROTTLE_METRICS;


const NEXUS5X_EMULATION_METRICS = {
  mobile: true,
  screenWidth: 412,
  screenHeight: 732,
  width: 412,
  height: 732,
  positionX: 0,
  positionY: 0,
  scale: 1,
  deviceScaleFactor: 2.625,
  fitWindow: false,
  screenOrientation: {
    angle: 0,
    type: 'portraitPrimary',
  },
};

const NEXUS5X_USERAGENT = {
  userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36' +
    '(KHTML, like Gecko) Chrome/61.0.3116.0 Mobile Safari/537.36',
};

/**
 * Adjustments needed for DevTools network throttling to simulate
 * more realistic network conditions.
 * See: crbug.com/721112
 */
const OFFLINE_METRICS = {
  offline: true,
  // values of 0 remove any active throttling. crbug.com/456324#c9
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
};

function enableNexus5X(driver) {
  // COMPAT FIMXE
  // Injecting this function clientside is no longer neccessary as of m62. This is done
  // on the backend when `Emulation.setTouchEmulationEnabled` is set.
  //   https://bugs.chromium.org/p/chromium/issues/detail?id=133915#c63
  // Once m62 hits stable (~Oct 20th) we can nuke this entirely
  /**
   * Finalizes touch emulation by enabling `"ontouchstart" in window` feature detect
   * to work. Messy hack, though copied verbatim from DevTools' emulation/TouchModel.js
   * where it's been working for years. addScriptToEvaluateOnLoad runs before any of the
   * page's JavaScript executes.
   */
  /* eslint-disable no-proto */ /* global window, document */ /* istanbul ignore next */
  const injectedTouchEventsFunction = function() {
    const touchEvents = ['ontouchstart', 'ontouchend', 'ontouchmove', 'ontouchcancel'];
    const recepients = [window.__proto__, document.__proto__];
    for (let i = 0; i < touchEvents.length; ++i) {
      for (let j = 0; j < recepients.length; ++j) {
        if (!(touchEvents[i] in recepients[j])) {
          Object.defineProperty(recepients[j], touchEvents[i], {
            value: null, writable: true, configurable: true, enumerable: true,
          });
        }
      }
    }
  };
  /* eslint-enable */

  return Promise.all([
    driver.sendCommand('Emulation.setDeviceMetricsOverride', NEXUS5X_EMULATION_METRICS),
    // Network.enable must be called for UA overriding to work
    driver.sendCommand('Network.enable'),
    driver.sendCommand('Network.setUserAgentOverride', NEXUS5X_USERAGENT),
    driver.sendCommand('Emulation.setTouchEmulationEnabled', {
      enabled: true,
      configuration: 'mobile',
    }),
    driver.sendCommand('Page.addScriptToEvaluateOnLoad', {
      scriptSource: '(' + injectedTouchEventsFunction.toString() + ')()',
    }),
  ]);
}

function enableNetworkThrottling(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', TYPICAL_MOBILE_THROTTLING_METRICS);
}

function disableNetworkThrottling(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', NO_THROTTLING_METRICS);
}

function goOffline(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', OFFLINE_METRICS);
}

function enableCPUThrottling(driver) {
  if(process.throttling6x == "6x slowdown")
  {
    return driver.sendCommand('Emulation.setCPUThrottlingRate',CPU_6XTHROTTLE_METRICS);
  }
  else if(process.throttling6x == "4x slowdown")
  {
    return driver.sendCommand('Emulation.setCPUThrottlingRate',CPU_4XTHROTTLE_METRICS);
  }
}

function disableCPUThrottling(driver) {
  return driver.sendCommand('Emulation.setCPUThrottlingRate', NO_CPU_THROTTLE_METRICS);
}

function getEmulationDesc() {
  const {latency, downloadThroughput, uploadThroughput} = TYPICAL_MOBILE_THROTTLING_METRICS;
  const byteToMbit = bytes => (bytes / 1024 / 1024 * 8).toFixed(1);
  if(process.throttling6x == "6x slowdown")
  {
    return {
    'deviceEmulation': 'Nexus 5X',
    'cpuThrottling': `${CPU_6XTHROTTLE_METRICS.rate}x slowdown`,
    'networkThrottling': `${latency}ms RTT, ${byteToMbit(downloadThroughput)}Mbps down, ` +
        `${byteToMbit(uploadThroughput)}Mbps up`,
    };
  }
  else if(process.throttling6x == "4x slowdown")
  {
    return {
    'deviceEmulation': 'Nexus 5X',
    'cpuThrottling': `${CPU_4XTHROTTLE_METRICS.rate}x slowdown`,
    'networkThrottling': `${latency}ms RTT, ${byteToMbit(downloadThroughput)}Mbps down, ` +
        `${byteToMbit(uploadThroughput)}Mbps up`,
    };
  }
  else
  {
    return {
    'deviceEmulation': 'Nexus 5X',
    'cpuThrottling': `${NO_CPU_THROTTLE_METRICS.rate}x slowdown Kathir`,
    'networkThrottling': `${latency}ms RTT, ${byteToMbit(downloadThroughput)}Mbps down, ` +
        `${byteToMbit(uploadThroughput)}Mbps up`,
    };
  }
  
}

module.exports = {
  enableNexus5X,
  enableNetworkThrottling,
  disableNetworkThrottling,
  enableCPUThrottling,
  disableCPUThrottling,
  goOffline,
  getEmulationDesc,
  settings: {
    NEXUS5X_EMULATION_METRICS,
    NEXUS5X_USERAGENT,
    TYPICAL_MOBILE_THROTTLING_METRICS,
    OFFLINE_METRICS,
    NO_THROTTLING_METRICS,
    NO_CPU_THROTTLE_METRICS,
    CPU_4XTHROTTLE_METRICS,
    CPU_6XTHROTTLE_METRICS,
  },
};
