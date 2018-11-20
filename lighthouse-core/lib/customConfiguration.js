

//Network Throttling metrics

const LATENCY_FACTOR = 3.75;
const THROUGHPUT_FACTOR = 0.9;

const TARGET_LATENCY = 150; // 150ms
const TARGET_DOWNLOAD_THROUGHPUT = Math.floor(1.6 * 1024 * 1024 / 8); // 1.6Mbps
const TARGET_UPLOAD_THROUGHPUT = Math.floor(750 * 1024 / 8); // 750Kbps

const TYPICAL_MOBILE_THROTTLING_METRICS = {
  targetLatency: TARGET_LATENCY,
  latency: TARGET_LATENCY * LATENCY_FACTOR,
  targetDownloadThroughput: TARGET_DOWNLOAD_THROUGHPUT,
  downloadThroughput: TARGET_DOWNLOAD_THROUGHPUT * THROUGHPUT_FACTOR,
  targetUploadThroughput: TARGET_UPLOAD_THROUGHPUT,
  uploadThroughput: TARGET_UPLOAD_THROUGHPUT * THROUGHPUT_FACTOR,
  offline: false,
};

const latencySlow3g = 400;
const downloadThroughputSlow3g=Math.floor(400* 1024 / 8); 
const upThroughputSlow3g=Math.floor(400* 1024 / 8); 


const TYPICAL_MOBILE_THROTTLING_METRICS_FOR_SLOW3G = {
  targetLatency: latencySlow3g,
  latency: latencySlow3g * LATENCY_FACTOR,
  targetDownloadThroughput: downloadThroughputSlow3g,
  downloadThroughput: downloadThroughputSlow3g * THROUGHPUT_FACTOR,
  targetUploadThroughput: upThroughputSlow3g,
  uploadThroughput: upThroughputSlow3g * THROUGHPUT_FACTOR,
  offline: false,
};

const NO_THROTTLING_METRICS = {
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
  offline: false,
};



//CPU Throttling metrics
const NO_CPU_THROTTLE_METRICS = {
  rate: 1,
};

const CPU_4XTHROTTLE_METRICS = {
  rate: 4,
};

const CPU_6XTHROTTLE_METRICS = {
  rate: 6,
};

module.exports = {
    TYPICAL_MOBILE_THROTTLING_METRICS,
    TYPICAL_MOBILE_THROTTLING_METRICS_FOR_SLOW3G,
    NO_THROTTLING_METRICS,
    NO_CPU_THROTTLE_METRICS,
    CPU_4XTHROTTLE_METRICS,
    CPU_6XTHROTTLE_METRICS,
};
