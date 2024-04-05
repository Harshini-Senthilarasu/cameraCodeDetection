export { setZXingModuleOverrides } from "./BarcodeDetector.js";
declare global {
    var BarcodeDetector: typeof import("./BarcodeDetector.js").BarcodeDetector;
    type BarcodeDetector = import("./BarcodeDetector.js").BarcodeDetector;
    type BarcodeFormat = import("./BarcodeDetector.js").BarcodeFormat;
    type BarcodeDetectorOptions = import("./BarcodeDetector.js").BarcodeDetectorOptions;
    type DetectedBarcode = import("./BarcodeDetector.js").DetectedBarcode;
}

"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("./pure.js");var e;(e=globalThis.BarcodeDetector)!=null||(globalThis.BarcodeDetector=r.BarcodeDetector);exports.setZXingModuleOverrides=r.setZXingModuleOverrides;
