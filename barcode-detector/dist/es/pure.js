var Ye = (o, h, s) => {
  if (!h.has(o))
    throw TypeError("Cannot " + s);
};
var re = (o, h, s) => (Ye(o, h, "read from private field"), s ? s.call(o) : h.get(o)), ze = (o, h, s) => {
  if (h.has(o))
    throw TypeError("Cannot add the same private member more than once");
  h instanceof WeakSet ? h.add(o) : h.set(o, s);
}, Ne = (o, h, s, $) => (Ye(o, h, "write to private field"), $ ? $.call(o, s) : h.set(o, s), s);
const Qe = [
  ["aztec", "Aztec"],
  ["code_128", "Code128"],
  ["code_39", "Code39"],
  ["code_93", "Code93"],
  ["codabar", "Codabar"],
  ["databar", "DataBar"],
  ["databar_expanded", "DataBarExpanded"],
  ["data_matrix", "DataMatrix"],
  ["dx_film_edge", "DXFilmEdge"],
  ["ean_13", "EAN-13"],
  ["ean_8", "EAN-8"],
  ["itf", "ITF"],
  ["maxi_code", "MaxiCode"],
  ["micro_qr_code", "MicroQRCode"],
  ["pdf417", "PDF417"],
  ["qr_code", "QRCode"],
  ["rm_qr_code", "rMQRCode"],
  ["upc_a", "UPC-A"],
  ["upc_e", "UPC-E"],
  ["linear_codes", "Linear-Codes"],
  ["matrix_codes", "Matrix-Codes"]
], Da = [...Qe, ["unknown"]].map((o) => o[0]), It = new Map(
  Qe
);
function xa(o) {
  for (const [h, s] of It)
    if (o === s)
      return h;
  return "unknown";
}
function Fa(o) {
  if (Ze(o))
    return {
      width: o.naturalWidth,
      height: o.naturalHeight
    };
  if (Je(o))
    return {
      width: o.width.baseVal.value,
      height: o.height.baseVal.value
    };
  if (Ke(o))
    return {
      width: o.videoWidth,
      height: o.videoHeight
    };
  if (er(o))
    return {
      width: o.width,
      height: o.height
    };
  if (nr(o))
    return {
      width: o.displayWidth,
      height: o.displayHeight
    };
  if (tr(o))
    return {
      width: o.width,
      height: o.height
    };
  if (rr(o))
    return {
      width: o.width,
      height: o.height
    };
  throw new TypeError(
    "The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'."
  );
}
function Ze(o) {
  try {
    return o instanceof HTMLImageElement;
  } catch {
    return !1;
  }
}
function Je(o) {
  try {
    return o instanceof SVGImageElement;
  } catch {
    return !1;
  }
}
function Ke(o) {
  try {
    return o instanceof HTMLVideoElement;
  } catch {
    return !1;
  }
}
function tr(o) {
  try {
    return o instanceof HTMLCanvasElement;
  } catch {
    return !1;
  }
}
function er(o) {
  try {
    return o instanceof ImageBitmap;
  } catch {
    return !1;
  }
}
function rr(o) {
  try {
    return o instanceof OffscreenCanvas;
  } catch {
    return !1;
  }
}
function nr(o) {
  try {
    return o instanceof VideoFrame;
  } catch {
    return !1;
  }
}
function ar(o) {
  try {
    return o instanceof Blob;
  } catch {
    return !1;
  }
}
function Ma(o) {
  try {
    return o instanceof ImageData;
  } catch {
    return !1;
  }
}
function Sa(o, h) {
  try {
    const s = new OffscreenCanvas(o, h);
    if (s.getContext("2d") instanceof OffscreenCanvasRenderingContext2D)
      return s;
    throw void 0;
  } catch {
    const s = document.createElement("canvas");
    return s.width = o, s.height = h, s;
  }
}
async function or(o) {
  if (Ze(o) && !await Wa(o))
    throw new DOMException(
      "Failed to load or decode HTMLImageElement.",
      "InvalidStateError"
    );
  if (Je(o) && !await ka(o))
    throw new DOMException(
      "Failed to load or decode SVGImageElement.",
      "InvalidStateError"
    );
  if (nr(o) && Ha(o))
    throw new DOMException("VideoFrame is closed.", "InvalidStateError");
  if (Ke(o) && (o.readyState === 0 || o.readyState === 1))
    throw new DOMException("Invalid element or state.", "InvalidStateError");
  if (er(o) && Ua(o))
    throw new DOMException(
      "The image source is detached.",
      "InvalidStateError"
    );
  const { width: h, height: s } = Fa(o);
  if (h === 0 || s === 0)
    return null;
  const g = Sa(h, s).getContext("2d");
  g.drawImage(o, 0, 0);
  try {
    return g.getImageData(0, 0, h, s);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function ja(o) {
  let h;
  try {
    if (globalThis.createImageBitmap)
      h = await createImageBitmap(o);
    else if (globalThis.Image) {
      h = new Image();
      let $ = "";
      try {
        $ = URL.createObjectURL(o), h.src = $, await h.decode();
      } finally {
        URL.revokeObjectURL($);
      }
    } else
      return o;
  } catch {
    throw new DOMException(
      "Failed to load or decode Blob.",
      "InvalidStateError"
    );
  }
  return await or(h);
}
function Ia(o) {
  const { width: h, height: s } = o;
  if (h === 0 || s === 0)
    return null;
  const $ = o.getContext("2d");
  try {
    return $.getImageData(0, 0, h, s);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function Ra(o) {
  if (ar(o))
    return await ja(o);
  if (Ma(o)) {
    if (Ba(o))
      throw new DOMException(
        "The image data has been detached.",
        "InvalidStateError"
      );
    return o;
  }
  return tr(o) || rr(o) ? Ia(o) : await or(o);
}
async function Wa(o) {
  try {
    return await o.decode(), !0;
  } catch {
    return !1;
  }
}
async function ka(o) {
  var h;
  try {
    return await ((h = o.decode) == null ? void 0 : h.call(o)), !0;
  } catch {
    return !1;
  }
}
function Ha(o) {
  return o.format === null;
}
function Ba(o) {
  return o.data.buffer.byteLength === 0;
}
function Ua(o) {
  return o.width === 0 && o.height === 0;
}
function Ge(o, h) {
  return o instanceof DOMException ? new DOMException(`${h}: ${o.message}`, o.name) : o instanceof Error ? new o.constructor(`${h}: ${o.message}`) : new Error(`${h}: ${o}`);
}
const Xe = [
  "Aztec",
  "Codabar",
  "Code128",
  "Code39",
  "Code93",
  "DataBar",
  "DataBarExpanded",
  "DataMatrix",
  "DXFilmEdge",
  "EAN-13",
  "EAN-8",
  "ITF",
  "Linear-Codes",
  "Matrix-Codes",
  "MaxiCode",
  "MicroQRCode",
  "None",
  "PDF417",
  "QRCode",
  "rMQRCode",
  "UPC-A",
  "UPC-E"
];
function Va(o) {
  return o.join("|");
}
function La(o) {
  const h = qe(o);
  let s = 0, $ = Xe.length - 1;
  for (; s <= $; ) {
    const g = Math.floor((s + $) / 2), b = Xe[g], H = qe(b);
    if (H === h)
      return b;
    H < h ? s = g + 1 : $ = g - 1;
  }
  return "None";
}
function qe(o) {
  return o.toLowerCase().replace(/_-\[\]/g, "");
}
function Ya(o, h) {
  return o.Binarizer[h];
}
function za(o, h) {
  return o.CharacterSet[h];
}
const Na = [
  "Text",
  "Binary",
  "Mixed",
  "GS1",
  "ISO15434",
  "UnknownECI"
];
function Ga(o) {
  return Na[o.value];
}
function Xa(o, h) {
  return o.EanAddOnSymbol[h];
}
function qa(o, h) {
  return o.TextMode[h];
}
const lt = {
  formats: [],
  tryHarder: !0,
  tryRotate: !0,
  tryInvert: !0,
  tryDownscale: !0,
  binarizer: "LocalAverage",
  isPure: !1,
  downscaleFactor: 3,
  downscaleThreshold: 500,
  minLineCount: 2,
  maxNumberOfSymbols: 255,
  tryCode39ExtendedMode: !1,
  validateCode39CheckSum: !1,
  validateITFCheckSum: !1,
  returnCodabarStartEnd: !1,
  returnErrors: !1,
  eanAddOnSymbol: "Read",
  textMode: "Plain",
  characterSet: "Unknown"
};
function ir(o, h) {
  return {
    ...h,
    formats: Va(h.formats),
    binarizer: Ya(o, h.binarizer),
    eanAddOnSymbol: Xa(
      o,
      h.eanAddOnSymbol
    ),
    textMode: qa(o, h.textMode),
    characterSet: za(
      o,
      h.characterSet
    )
  };
}
function sr(o) {
  return {
    ...o,
    format: La(o.format),
    eccLevel: o.eccLevel,
    contentType: Ga(o.contentType)
  };
}
const Qa = {
  locateFile: (o, h) => {
    const s = o.match(/_(.+?)\.wasm$/);
    return s ? `https://fastly.jsdelivr.net/npm/zxing-wasm@1.1.3/dist/${s[1]}/${o}` : h + o;
  }
};
let ne = /* @__PURE__ */ new WeakMap();
function ae(o, h) {
  var s;
  const $ = ne.get(o);
  if ($ != null && $.modulePromise && (h === void 0 || Object.is(h, $.moduleOverrides)))
    return $.modulePromise;
  const g = (s = h != null ? h : $ == null ? void 0 : $.moduleOverrides) != null ? s : Qa, b = o({
    ...g
  });
  return ne.set(o, {
    moduleOverrides: g,
    modulePromise: b
  }), b;
}
function Za(o, h) {
  ne.set(o, {
    moduleOverrides: h
  });
}
async function Ja(o, h, s = lt) {
  const $ = {
    ...lt,
    ...s
  }, g = await ae(o), { size: b } = h, H = new Uint8Array(await h.arrayBuffer()), L = g._malloc(b);
  g.HEAPU8.set(H, L);
  const B = g.readBarcodesFromImage(
    L,
    b,
    ir(g, $)
  );
  g._free(L);
  const M = [];
  for (let Y = 0; Y < B.size(); ++Y)
    M.push(
      sr(B.get(Y))
    );
  return M;
}
async function Ka(o, h, s = lt) {
  const $ = {
    ...lt,
    ...s
  }, g = await ae(o), {
    data: b,
    width: H,
    height: L,
    data: { byteLength: B }
  } = h, M = g._malloc(B);
  g.HEAPU8.set(b, M);
  const Y = g.readBarcodesFromPixmap(
    M,
    H,
    L,
    ir(g, $)
  );
  g._free(M);
  const G = [];
  for (let U = 0; U < Y.size(); ++U)
    G.push(
      sr(Y.get(U))
    );
  return G;
}
({
  ...lt,
  formats: [...lt.formats]
});
var Rt = (() => {
  var o = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(h = {}) {
    var s = h, $, g;
    s.ready = new Promise((t, e) => {
      $ = t, g = e;
    });
    var b = Object.assign({}, s), H = "./this.program", L = typeof window == "object", B = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var M = "";
    function Y(t) {
      return s.locateFile ? s.locateFile(t, M) : M + t;
    }
    var G;
    (L || B) && (B ? M = self.location.href : typeof document < "u" && document.currentScript && (M = document.currentScript.src), o && (M = o), M.indexOf("blob:") !== 0 ? M = M.substr(0, M.replace(/[?#].*/, "").lastIndexOf("/") + 1) : M = "", B && (G = (t) => {
      var e = new XMLHttpRequest();
      return e.open("GET", t, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
    })), s.print || console.log.bind(console);
    var U = s.printErr || console.error.bind(console);
    Object.assign(s, b), b = null, s.arguments && s.arguments, s.thisProgram && (H = s.thisProgram), s.quit && s.quit;
    var Q;
    s.wasmBinary && (Q = s.wasmBinary), typeof WebAssembly != "object" && bt("no native wasm support detected");
    var tt, dt = !1, V, W, at, ft, k, T, oe, ie;
    function se() {
      var t = tt.buffer;
      s.HEAP8 = V = new Int8Array(t), s.HEAP16 = at = new Int16Array(t), s.HEAPU8 = W = new Uint8Array(t), s.HEAPU16 = ft = new Uint16Array(t), s.HEAP32 = k = new Int32Array(t), s.HEAPU32 = T = new Uint32Array(t), s.HEAPF32 = oe = new Float32Array(t), s.HEAPF64 = ie = new Float64Array(t);
    }
    var ue = [], ce = [], le = [];
    function ur() {
      if (s.preRun)
        for (typeof s.preRun == "function" && (s.preRun = [s.preRun]); s.preRun.length; )
          dr(s.preRun.shift());
      Wt(ue);
    }
    function cr() {
      Wt(ce);
    }
    function lr() {
      if (s.postRun)
        for (typeof s.postRun == "function" && (s.postRun = [s.postRun]); s.postRun.length; )
          hr(s.postRun.shift());
      Wt(le);
    }
    function dr(t) {
      ue.unshift(t);
    }
    function fr(t) {
      ce.unshift(t);
    }
    function hr(t) {
      le.unshift(t);
    }
    var et = 0, ht = null;
    function pr(t) {
      var e;
      et++, (e = s.monitorRunDependencies) === null || e === void 0 || e.call(s, et);
    }
    function mr(t) {
      var e;
      if (et--, (e = s.monitorRunDependencies) === null || e === void 0 || e.call(s, et), et == 0 && ht) {
        var r = ht;
        ht = null, r();
      }
    }
    function bt(t) {
      var e;
      (e = s.onAbort) === null || e === void 0 || e.call(s, t), t = "Aborted(" + t + ")", U(t), dt = !0, t += ". Build with -sASSERTIONS for more info.";
      var r = new WebAssembly.RuntimeError(t);
      throw g(r), r;
    }
    var vr = "data:application/octet-stream;base64,", de = (t) => t.startsWith(vr), ot;
    ot = "zxing_reader.wasm", de(ot) || (ot = Y(ot));
    function fe(t) {
      if (t == ot && Q)
        return new Uint8Array(Q);
      if (G)
        return G(t);
      throw "both async and sync fetching of the wasm failed";
    }
    function yr(t) {
      return !Q && (L || B) && typeof fetch == "function" ? fetch(t, {
        credentials: "same-origin"
      }).then((e) => {
        if (!e.ok)
          throw "failed to load wasm binary file at '" + t + "'";
        return e.arrayBuffer();
      }).catch(() => fe(t)) : Promise.resolve().then(() => fe(t));
    }
    function he(t, e, r) {
      return yr(t).then((n) => WebAssembly.instantiate(n, e)).then((n) => n).then(r, (n) => {
        U(`failed to asynchronously prepare wasm: ${n}`), bt(n);
      });
    }
    function gr(t, e, r, n) {
      return !t && typeof WebAssembly.instantiateStreaming == "function" && !de(e) && typeof fetch == "function" ? fetch(e, {
        credentials: "same-origin"
      }).then((a) => {
        var i = WebAssembly.instantiateStreaming(a, r);
        return i.then(n, function(u) {
          return U(`wasm streaming compile failed: ${u}`), U("falling back to ArrayBuffer instantiation"), he(e, r, n);
        });
      }) : he(e, r, n);
    }
    function wr() {
      var t = {
        a: sa
      };
      function e(n, a) {
        return S = n.exports, tt = S.ia, se(), _e = S.ma, fr(S.ja), mr(), S;
      }
      pr();
      function r(n) {
        e(n.instance);
      }
      if (s.instantiateWasm)
        try {
          return s.instantiateWasm(t, e);
        } catch (n) {
          U(`Module.instantiateWasm callback failed with error: ${n}`), g(n);
        }
      return gr(Q, ot, t, r).catch(g), {};
    }
    var Wt = (t) => {
      for (; t.length > 0; )
        t.shift()(s);
    };
    s.noExitRuntime;
    var Ct = [], _t = 0, $r = (t) => {
      var e = new kt(t);
      return e.get_caught() || (e.set_caught(!0), _t--), e.set_rethrown(!1), Ct.push(e), We(e.excPtr), e.get_exception_ptr();
    }, Z = 0, br = () => {
      P(0, 0);
      var t = Ct.pop();
      Re(t.excPtr), Z = 0;
    };
    function kt(t) {
      this.excPtr = t, this.ptr = t - 24, this.set_type = function(e) {
        T[this.ptr + 4 >> 2] = e;
      }, this.get_type = function() {
        return T[this.ptr + 4 >> 2];
      }, this.set_destructor = function(e) {
        T[this.ptr + 8 >> 2] = e;
      }, this.get_destructor = function() {
        return T[this.ptr + 8 >> 2];
      }, this.set_caught = function(e) {
        e = e ? 1 : 0, V[this.ptr + 12 >> 0] = e;
      }, this.get_caught = function() {
        return V[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(e) {
        e = e ? 1 : 0, V[this.ptr + 13 >> 0] = e;
      }, this.get_rethrown = function() {
        return V[this.ptr + 13 >> 0] != 0;
      }, this.init = function(e, r) {
        this.set_adjusted_ptr(0), this.set_type(e), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(e) {
        T[this.ptr + 16 >> 2] = e;
      }, this.get_adjusted_ptr = function() {
        return T[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var e = He(this.get_type());
        if (e)
          return T[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var Cr = (t) => {
      throw Z || (Z = t), Z;
    }, Ht = (t) => {
      var e = Z;
      if (!e)
        return $t(0), 0;
      var r = new kt(e);
      r.set_adjusted_ptr(e);
      var n = r.get_type();
      if (!n)
        return $t(0), e;
      for (var a in t) {
        var i = t[a];
        if (i === 0 || i === n)
          break;
        var u = r.ptr + 16;
        if (ke(i, n, u))
          return $t(i), e;
      }
      return $t(n), e;
    }, _r = () => Ht([]), Tr = (t) => Ht([t]), Pr = (t, e) => Ht([t, e]), Er = () => {
      var t = Ct.pop();
      t || bt("no exception to throw");
      var e = t.excPtr;
      throw t.get_rethrown() || (Ct.push(t), t.set_rethrown(!0), t.set_caught(!1), _t++), Z = e, Z;
    }, Ar = (t, e, r) => {
      var n = new kt(t);
      throw n.init(e, r), Z = t, _t++, Z;
    }, Or = () => _t, Tt = {}, Bt = (t) => {
      for (; t.length; ) {
        var e = t.pop(), r = t.pop();
        r(e);
      }
    };
    function Ut(t) {
      return this.fromWireType(k[t >> 2]);
    }
    var it = {}, rt = {}, Pt = {}, pe, Et = (t) => {
      throw new pe(t);
    }, nt = (t, e, r) => {
      t.forEach(function(c) {
        Pt[c] = e;
      });
      function n(c) {
        var l = r(c);
        l.length !== t.length && Et("Mismatched type converter count");
        for (var f = 0; f < t.length; ++f)
          X(t[f], l[f]);
      }
      var a = new Array(e.length), i = [], u = 0;
      e.forEach((c, l) => {
        rt.hasOwnProperty(c) ? a[l] = rt[c] : (i.push(c), it.hasOwnProperty(c) || (it[c] = []), it[c].push(() => {
          a[l] = rt[c], ++u, u === i.length && n(a);
        }));
      }), i.length === 0 && n(a);
    }, Dr = (t) => {
      var e = Tt[t];
      delete Tt[t];
      var r = e.rawConstructor, n = e.rawDestructor, a = e.fields, i = a.map((u) => u.getterReturnType).concat(a.map((u) => u.setterArgumentType));
      nt([t], i, (u) => {
        var c = {};
        return a.forEach((l, f) => {
          var p = l.fieldName, v = u[f], y = l.getter, w = l.getterContext, E = u[f + a.length], x = l.setter, _ = l.setterContext;
          c[p] = {
            read: (R) => v.fromWireType(y(w, R)),
            write: (R, d) => {
              var m = [];
              x(_, R, E.toWireType(m, d)), Bt(m);
            }
          };
        }), [{
          name: e.name,
          fromWireType: (l) => {
            var f = {};
            for (var p in c)
              f[p] = c[p].read(l);
            return n(l), f;
          },
          toWireType: (l, f) => {
            for (var p in c)
              if (!(p in f))
                throw new TypeError(`Missing field: "${p}"`);
            var v = r();
            for (p in c)
              c[p].write(v, f[p]);
            return l !== null && l.push(n, v), v;
          },
          argPackAdvance: q,
          readValueFromPointer: Ut,
          destructorFunction: n
        }];
      });
    }, xr = (t, e, r, n, a) => {
    }, Fr = () => {
      for (var t = new Array(256), e = 0; e < 256; ++e)
        t[e] = String.fromCharCode(e);
      me = t;
    }, me, I = (t) => {
      for (var e = "", r = t; W[r]; )
        e += me[W[r++]];
      return e;
    }, st, C = (t) => {
      throw new st(t);
    };
    function Mr(t, e) {
      let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var n = e.name;
      if (t || C(`type "${n}" must have a positive integer typeid pointer`), rt.hasOwnProperty(t)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        C(`Cannot register type '${n}' twice`);
      }
      if (rt[t] = e, delete Pt[t], it.hasOwnProperty(t)) {
        var a = it[t];
        delete it[t], a.forEach((i) => i());
      }
    }
    function X(t, e) {
      let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (!("argPackAdvance" in e))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Mr(t, e, r);
    }
    var q = 8, Sr = (t, e, r, n) => {
      e = I(e), X(t, {
        name: e,
        fromWireType: function(a) {
          return !!a;
        },
        toWireType: function(a, i) {
          return i ? r : n;
        },
        argPackAdvance: q,
        readValueFromPointer: function(a) {
          return this.fromWireType(W[a]);
        },
        destructorFunction: null
      });
    }, jr = (t) => ({
      count: t.count,
      deleteScheduled: t.deleteScheduled,
      preservePointerOnDelete: t.preservePointerOnDelete,
      ptr: t.ptr,
      ptrType: t.ptrType,
      smartPtr: t.smartPtr,
      smartPtrType: t.smartPtrType
    }), Vt = (t) => {
      function e(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      C(e(t) + " instance already deleted");
    }, Lt = !1, ve = (t) => {
    }, Ir = (t) => {
      t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
    }, ye = (t) => {
      t.count.value -= 1;
      var e = t.count.value === 0;
      e && Ir(t);
    }, ge = (t, e, r) => {
      if (e === r)
        return t;
      if (r.baseClass === void 0)
        return null;
      var n = ge(t, e, r.baseClass);
      return n === null ? null : r.downcast(n);
    }, we = {}, Rr = () => Object.keys(vt).length, Wr = () => {
      var t = [];
      for (var e in vt)
        vt.hasOwnProperty(e) && t.push(vt[e]);
      return t;
    }, pt = [], Yt = () => {
      for (; pt.length; ) {
        var t = pt.pop();
        t.$$.deleteScheduled = !1, t.delete();
      }
    }, mt, kr = (t) => {
      mt = t, pt.length && mt && mt(Yt);
    }, Hr = () => {
      s.getInheritedInstanceCount = Rr, s.getLiveInheritedInstances = Wr, s.flushPendingDeletes = Yt, s.setDelayFunction = kr;
    }, vt = {}, Br = (t, e) => {
      for (e === void 0 && C("ptr should not be undefined"); t.baseClass; )
        e = t.upcast(e), t = t.baseClass;
      return e;
    }, Ur = (t, e) => (e = Br(t, e), vt[e]), At = (t, e) => {
      (!e.ptrType || !e.ptr) && Et("makeClassHandle requires ptr and ptrType");
      var r = !!e.smartPtrType, n = !!e.smartPtr;
      return r !== n && Et("Both smartPtrType and smartPtr must be specified"), e.count = {
        value: 1
      }, yt(Object.create(t, {
        $$: {
          value: e,
          writable: !0
        }
      }));
    };
    function Vr(t) {
      var e = this.getPointee(t);
      if (!e)
        return this.destructor(t), null;
      var r = Ur(this.registeredClass, e);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = e, r.$$.smartPtr = t, r.clone();
        var n = r.clone();
        return this.destructor(t), n;
      }
      function a() {
        return this.isSmartPointer ? At(this.registeredClass.instancePrototype, {
          ptrType: this.pointeeType,
          ptr: e,
          smartPtrType: this,
          smartPtr: t
        }) : At(this.registeredClass.instancePrototype, {
          ptrType: this,
          ptr: t
        });
      }
      var i = this.registeredClass.getActualType(e), u = we[i];
      if (!u)
        return a.call(this);
      var c;
      this.isConst ? c = u.constPointerType : c = u.pointerType;
      var l = ge(e, this.registeredClass, c.registeredClass);
      return l === null ? a.call(this) : this.isSmartPointer ? At(c.registeredClass.instancePrototype, {
        ptrType: c,
        ptr: l,
        smartPtrType: this,
        smartPtr: t
      }) : At(c.registeredClass.instancePrototype, {
        ptrType: c,
        ptr: l
      });
    }
    var yt = (t) => typeof FinalizationRegistry > "u" ? (yt = (e) => e, t) : (Lt = new FinalizationRegistry((e) => {
      ye(e.$$);
    }), yt = (e) => {
      var r = e.$$, n = !!r.smartPtr;
      if (n) {
        var a = {
          $$: r
        };
        Lt.register(e, a, e);
      }
      return e;
    }, ve = (e) => Lt.unregister(e), yt(t)), Lr = () => {
      Object.assign(Ot.prototype, {
        isAliasOf(t) {
          if (!(this instanceof Ot) || !(t instanceof Ot))
            return !1;
          var e = this.$$.ptrType.registeredClass, r = this.$$.ptr;
          t.$$ = t.$$;
          for (var n = t.$$.ptrType.registeredClass, a = t.$$.ptr; e.baseClass; )
            r = e.upcast(r), e = e.baseClass;
          for (; n.baseClass; )
            a = n.upcast(a), n = n.baseClass;
          return e === n && r === a;
        },
        clone() {
          if (this.$$.ptr || Vt(this), this.$$.preservePointerOnDelete)
            return this.$$.count.value += 1, this;
          var t = yt(Object.create(Object.getPrototypeOf(this), {
            $$: {
              value: jr(this.$$)
            }
          }));
          return t.$$.count.value += 1, t.$$.deleteScheduled = !1, t;
        },
        delete() {
          this.$$.ptr || Vt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C("Object already scheduled for deletion"), ve(this), ye(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
        },
        isDeleted() {
          return !this.$$.ptr;
        },
        deleteLater() {
          return this.$$.ptr || Vt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C("Object already scheduled for deletion"), pt.push(this), pt.length === 1 && mt && mt(Yt), this.$$.deleteScheduled = !0, this;
        }
      });
    };
    function Ot() {
    }
    var gt = (t, e) => Object.defineProperty(e, "name", {
      value: t
    }), $e = (t, e, r) => {
      if (t[e].overloadTable === void 0) {
        var n = t[e];
        t[e] = function() {
          return t[e].overloadTable.hasOwnProperty(arguments.length) || C(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[e].overloadTable})!`), t[e].overloadTable[arguments.length].apply(this, arguments);
        }, t[e].overloadTable = [], t[e].overloadTable[n.argCount] = n;
      }
    }, zt = (t, e, r) => {
      s.hasOwnProperty(t) ? ((r === void 0 || s[t].overloadTable !== void 0 && s[t].overloadTable[r] !== void 0) && C(`Cannot register public name '${t}' twice`), $e(s, t, t), s.hasOwnProperty(r) && C(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), s[t].overloadTable[r] = e) : (s[t] = e, r !== void 0 && (s[t].numArguments = r));
    }, Yr = 48, zr = 57, Nr = (t) => {
      if (t === void 0)
        return "_unknown";
      t = t.replace(/[^a-zA-Z0-9_]/g, "$");
      var e = t.charCodeAt(0);
      return e >= Yr && e <= zr ? `_${t}` : t;
    };
    function Gr(t, e, r, n, a, i, u, c) {
      this.name = t, this.constructor = e, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = a, this.getActualType = i, this.upcast = u, this.downcast = c, this.pureVirtualFunctions = [];
    }
    var Nt = (t, e, r) => {
      for (; e !== r; )
        e.upcast || C(`Expected null or instance of ${r.name}, got an instance of ${e.name}`), t = e.upcast(t), e = e.baseClass;
      return t;
    };
    function Xr(t, e) {
      if (e === null)
        return this.isReference && C(`null is not a valid ${this.name}`), 0;
      e.$$ || C(`Cannot pass "${Zt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = e.$$.ptrType.registeredClass, n = Nt(e.$$.ptr, r, this.registeredClass);
      return n;
    }
    function qr(t, e) {
      var r;
      if (e === null)
        return this.isReference && C(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), t !== null && t.push(this.rawDestructor, r), r) : 0;
      (!e || !e.$$) && C(`Cannot pass "${Zt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && e.$$.ptrType.isConst && C(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`);
      var n = e.$$.ptrType.registeredClass;
      if (r = Nt(e.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (e.$$.smartPtr === void 0 && C("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            e.$$.smartPtrType === this ? r = e.$$.smartPtr : C(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = e.$$.smartPtr;
            break;
          case 2:
            if (e.$$.smartPtrType === this)
              r = e.$$.smartPtr;
            else {
              var a = e.clone();
              r = this.rawShare(r, J.toHandle(() => a.delete())), t !== null && t.push(this.rawDestructor, r);
            }
            break;
          default:
            C("Unsupporting sharing policy");
        }
      return r;
    }
    function Qr(t, e) {
      if (e === null)
        return this.isReference && C(`null is not a valid ${this.name}`), 0;
      e.$$ || C(`Cannot pass "${Zt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`), e.$$.ptrType.isConst && C(`Cannot convert argument of type ${e.$$.ptrType.name} to parameter type ${this.name}`);
      var r = e.$$.ptrType.registeredClass, n = Nt(e.$$.ptr, r, this.registeredClass);
      return n;
    }
    function be(t) {
      return this.fromWireType(T[t >> 2]);
    }
    var Zr = () => {
      Object.assign(Dt.prototype, {
        getPointee(t) {
          return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
        },
        destructor(t) {
          var e;
          (e = this.rawDestructor) === null || e === void 0 || e.call(this, t);
        },
        argPackAdvance: q,
        readValueFromPointer: be,
        deleteObject(t) {
          t !== null && t.delete();
        },
        fromWireType: Vr
      });
    };
    function Dt(t, e, r, n, a, i, u, c, l, f, p) {
      this.name = t, this.registeredClass = e, this.isReference = r, this.isConst = n, this.isSmartPointer = a, this.pointeeType = i, this.sharingPolicy = u, this.rawGetPointee = c, this.rawConstructor = l, this.rawShare = f, this.rawDestructor = p, !a && e.baseClass === void 0 ? n ? (this.toWireType = Xr, this.destructorFunction = null) : (this.toWireType = Qr, this.destructorFunction = null) : this.toWireType = qr;
    }
    var Ce = (t, e, r) => {
      s.hasOwnProperty(t) || Et("Replacing nonexistant public symbol"), s[t].overloadTable !== void 0 && r !== void 0 ? s[t].overloadTable[r] = e : (s[t] = e, s[t].argCount = r);
    }, Jr = (t, e, r) => {
      var n = s["dynCall_" + t];
      return r && r.length ? n.apply(null, [e].concat(r)) : n.call(null, e);
    }, xt = [], _e, A = (t) => {
      var e = xt[t];
      return e || (t >= xt.length && (xt.length = t + 1), xt[t] = e = _e.get(t)), e;
    }, Kr = (t, e, r) => {
      if (t.includes("j"))
        return Jr(t, e, r);
      var n = A(e).apply(null, r);
      return n;
    }, tn = (t, e) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), Kr(t, e, r);
      };
    }, N = (t, e) => {
      t = I(t);
      function r() {
        return t.includes("j") ? tn(t, e) : A(e);
      }
      var n = r();
      return typeof n != "function" && C(`unknown function pointer with signature ${t}: ${e}`), n;
    }, en = (t, e) => {
      var r = gt(e, function(n) {
        this.name = e, this.message = n;
        var a = new Error(n).stack;
        a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(t.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }, Te, Pe = (t) => {
      var e = Ie(t), r = I(e);
      return K(e), r;
    }, Ft = (t, e) => {
      var r = [], n = {};
      function a(i) {
        if (!n[i] && !rt[i]) {
          if (Pt[i]) {
            Pt[i].forEach(a);
            return;
          }
          r.push(i), n[i] = !0;
        }
      }
      throw e.forEach(a), new Te(`${t}: ` + r.map(Pe).join([", "]));
    }, rn = (t, e, r, n, a, i, u, c, l, f, p, v, y) => {
      p = I(p), i = N(a, i), c && (c = N(u, c)), f && (f = N(l, f)), y = N(v, y);
      var w = Nr(p);
      zt(w, function() {
        Ft(`Cannot construct ${p} due to unbound types`, [n]);
      }), nt([t, e, r], n ? [n] : [], function(E) {
        E = E[0];
        var x, _;
        n ? (x = E.registeredClass, _ = x.instancePrototype) : _ = Ot.prototype;
        var R = gt(p, function() {
          if (Object.getPrototypeOf(this) !== d)
            throw new st("Use 'new' to construct " + p);
          if (m.constructor_body === void 0)
            throw new st(p + " has no accessible constructor");
          var Le = m.constructor_body[arguments.length];
          if (Le === void 0)
            throw new st(`Tried to invoke ctor of ${p} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(m.constructor_body).toString()}) parameters instead!`);
          return Le.apply(this, arguments);
        }), d = Object.create(_, {
          constructor: {
            value: R
          }
        });
        R.prototype = d;
        var m = new Gr(p, R, d, y, x, i, c, f);
        if (m.baseClass) {
          var F, j;
          (j = (F = m.baseClass).__derivedClasses) !== null && j !== void 0 || (F.__derivedClasses = []), m.baseClass.__derivedClasses.push(m);
        }
        var ut = new Dt(p, m, !0, !1, !1), jt = new Dt(p + "*", m, !1, !1, !1), Ve = new Dt(p + " const*", m, !1, !0, !1);
        return we[t] = {
          pointerType: jt,
          constPointerType: Ve
        }, Ce(w, R), [ut, jt, Ve];
      });
    }, Gt = (t, e) => {
      for (var r = [], n = 0; n < t; n++)
        r.push(T[e + n * 4 >> 2]);
      return r;
    };
    function nn(t) {
      for (var e = 1; e < t.length; ++e)
        if (t[e] !== null && t[e].destructorFunction === void 0)
          return !0;
      return !1;
    }
    function Xt(t, e, r, n, a, i) {
      var u = e.length;
      u < 2 && C("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var c = e[1] !== null && r !== null, l = nn(e), f = e[0].name !== "void", p = u - 2, v = new Array(p), y = [], w = [], E = function() {
        arguments.length !== p && C(`function ${t} called with ${arguments.length} arguments, expected ${p}`), w.length = 0;
        var x;
        y.length = c ? 2 : 1, y[0] = a, c && (x = e[1].toWireType(w, this), y[1] = x);
        for (var _ = 0; _ < p; ++_)
          v[_] = e[_ + 2].toWireType(w, arguments[_]), y.push(v[_]);
        var R = n.apply(null, y);
        function d(m) {
          if (l)
            Bt(w);
          else
            for (var F = c ? 1 : 2; F < e.length; F++) {
              var j = F === 1 ? x : v[F - 2];
              e[F].destructorFunction !== null && e[F].destructorFunction(j);
            }
          if (f)
            return e[0].fromWireType(m);
        }
        return d(R);
      };
      return gt(t, E);
    }
    var an = (t, e, r, n, a, i) => {
      var u = Gt(e, r);
      a = N(n, a), nt([], [t], function(c) {
        c = c[0];
        var l = `constructor ${c.name}`;
        if (c.registeredClass.constructor_body === void 0 && (c.registeredClass.constructor_body = []), c.registeredClass.constructor_body[e - 1] !== void 0)
          throw new st(`Cannot register multiple constructors with identical number of parameters (${e - 1}) for class '${c.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return c.registeredClass.constructor_body[e - 1] = () => {
          Ft(`Cannot construct ${c.name} due to unbound types`, u);
        }, nt([], u, (f) => (f.splice(1, 0, null), c.registeredClass.constructor_body[e - 1] = Xt(l, f, null, a, i), [])), [];
      });
    }, Ee = (t) => {
      t = t.trim();
      const e = t.indexOf("(");
      return e !== -1 ? t.substr(0, e) : t;
    }, on = (t, e, r, n, a, i, u, c, l) => {
      var f = Gt(r, n);
      e = I(e), e = Ee(e), i = N(a, i), nt([], [t], function(p) {
        p = p[0];
        var v = `${p.name}.${e}`;
        e.startsWith("@@") && (e = Symbol[e.substring(2)]), c && p.registeredClass.pureVirtualFunctions.push(e);
        function y() {
          Ft(`Cannot call ${v} due to unbound types`, f);
        }
        var w = p.registeredClass.instancePrototype, E = w[e];
        return E === void 0 || E.overloadTable === void 0 && E.className !== p.name && E.argCount === r - 2 ? (y.argCount = r - 2, y.className = p.name, w[e] = y) : ($e(w, e, v), w[e].overloadTable[r - 2] = y), nt([], f, function(x) {
          var _ = Xt(v, x, p, i, u);
          return w[e].overloadTable === void 0 ? (_.argCount = r - 2, w[e] = _) : w[e].overloadTable[r - 2] = _, [];
        }), [];
      });
    };
    function sn() {
      Object.assign(Ae.prototype, {
        get(t) {
          return this.allocated[t];
        },
        has(t) {
          return this.allocated[t] !== void 0;
        },
        allocate(t) {
          var e = this.freelist.pop() || this.allocated.length;
          return this.allocated[e] = t, e;
        },
        free(t) {
          this.allocated[t] = void 0, this.freelist.push(t);
        }
      });
    }
    function Ae() {
      this.allocated = [void 0], this.freelist = [];
    }
    var z = new Ae(), qt = (t) => {
      t >= z.reserved && --z.get(t).refcount === 0 && z.free(t);
    }, un = () => {
      for (var t = 0, e = z.reserved; e < z.allocated.length; ++e)
        z.allocated[e] !== void 0 && ++t;
      return t;
    }, cn = () => {
      z.allocated.push({
        value: void 0
      }, {
        value: null
      }, {
        value: !0
      }, {
        value: !1
      }), z.reserved = z.allocated.length, s.count_emval_handles = un;
    }, J = {
      toValue: (t) => (t || C("Cannot use deleted val. handle = " + t), z.get(t).value),
      toHandle: (t) => {
        switch (t) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            return z.allocate({
              refcount: 1,
              value: t
            });
        }
      }
    }, ln = (t, e) => {
      e = I(e), X(t, {
        name: e,
        fromWireType: (r) => {
          var n = J.toValue(r);
          return qt(r), n;
        },
        toWireType: (r, n) => J.toHandle(n),
        argPackAdvance: q,
        readValueFromPointer: Ut,
        destructorFunction: null
      });
    }, dn = (t, e, r) => {
      switch (e) {
        case 1:
          return r ? function(n) {
            return this.fromWireType(V[n >> 0]);
          } : function(n) {
            return this.fromWireType(W[n >> 0]);
          };
        case 2:
          return r ? function(n) {
            return this.fromWireType(at[n >> 1]);
          } : function(n) {
            return this.fromWireType(ft[n >> 1]);
          };
        case 4:
          return r ? function(n) {
            return this.fromWireType(k[n >> 2]);
          } : function(n) {
            return this.fromWireType(T[n >> 2]);
          };
        default:
          throw new TypeError(`invalid integer width (${e}): ${t}`);
      }
    }, fn = (t, e, r, n) => {
      e = I(e);
      function a() {
      }
      a.values = {}, X(t, {
        name: e,
        constructor: a,
        fromWireType: function(i) {
          return this.constructor.values[i];
        },
        toWireType: (i, u) => u.value,
        argPackAdvance: q,
        readValueFromPointer: dn(e, r, n),
        destructorFunction: null
      }), zt(e, a);
    }, Qt = (t, e) => {
      var r = rt[t];
      return r === void 0 && C(e + " has unknown type " + Pe(t)), r;
    }, hn = (t, e, r) => {
      var n = Qt(t, "enum");
      e = I(e);
      var a = n.constructor, i = Object.create(n.constructor.prototype, {
        value: {
          value: r
        },
        constructor: {
          value: gt(`${n.name}_${e}`, function() {
          })
        }
      });
      a.values[r] = i, a[e] = i;
    }, Zt = (t) => {
      if (t === null)
        return "null";
      var e = typeof t;
      return e === "object" || e === "array" || e === "function" ? t.toString() : "" + t;
    }, pn = (t, e) => {
      switch (e) {
        case 4:
          return function(r) {
            return this.fromWireType(oe[r >> 2]);
          };
        case 8:
          return function(r) {
            return this.fromWireType(ie[r >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${e}): ${t}`);
      }
    }, mn = (t, e, r) => {
      e = I(e), X(t, {
        name: e,
        fromWireType: (n) => n,
        toWireType: (n, a) => a,
        argPackAdvance: q,
        readValueFromPointer: pn(e, r),
        destructorFunction: null
      });
    }, vn = (t, e, r, n, a, i, u) => {
      var c = Gt(e, r);
      t = I(t), t = Ee(t), a = N(n, a), zt(t, function() {
        Ft(`Cannot call ${t} due to unbound types`, c);
      }, e - 1), nt([], c, function(l) {
        var f = [l[0], null].concat(l.slice(1));
        return Ce(t, Xt(t, f, null, a, i), e - 1), [];
      });
    }, yn = (t, e, r) => {
      switch (e) {
        case 1:
          return r ? (n) => V[n >> 0] : (n) => W[n >> 0];
        case 2:
          return r ? (n) => at[n >> 1] : (n) => ft[n >> 1];
        case 4:
          return r ? (n) => k[n >> 2] : (n) => T[n >> 2];
        default:
          throw new TypeError(`invalid integer width (${e}): ${t}`);
      }
    }, gn = (t, e, r, n, a) => {
      e = I(e);
      var i = (p) => p;
      if (n === 0) {
        var u = 32 - 8 * r;
        i = (p) => p << u >>> u;
      }
      var c = e.includes("unsigned"), l = (p, v) => {
      }, f;
      c ? f = function(p, v) {
        return l(v, this.name), v >>> 0;
      } : f = function(p, v) {
        return l(v, this.name), v;
      }, X(t, {
        name: e,
        fromWireType: i,
        toWireType: f,
        argPackAdvance: q,
        readValueFromPointer: yn(e, r, n !== 0),
        destructorFunction: null
      });
    }, wn = (t, e, r) => {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a = n[e];
      function i(u) {
        var c = T[u >> 2], l = T[u + 4 >> 2];
        return new a(V.buffer, l, c);
      }
      r = I(r), X(t, {
        name: r,
        fromWireType: i,
        argPackAdvance: q,
        readValueFromPointer: i
      }, {
        ignoreDuplicateRegistrations: !0
      });
    }, Oe = (t, e, r, n) => {
      if (!(n > 0))
        return 0;
      for (var a = r, i = r + n - 1, u = 0; u < t.length; ++u) {
        var c = t.charCodeAt(u);
        if (c >= 55296 && c <= 57343) {
          var l = t.charCodeAt(++u);
          c = 65536 + ((c & 1023) << 10) | l & 1023;
        }
        if (c <= 127) {
          if (r >= i)
            break;
          e[r++] = c;
        } else if (c <= 2047) {
          if (r + 1 >= i)
            break;
          e[r++] = 192 | c >> 6, e[r++] = 128 | c & 63;
        } else if (c <= 65535) {
          if (r + 2 >= i)
            break;
          e[r++] = 224 | c >> 12, e[r++] = 128 | c >> 6 & 63, e[r++] = 128 | c & 63;
        } else {
          if (r + 3 >= i)
            break;
          e[r++] = 240 | c >> 18, e[r++] = 128 | c >> 12 & 63, e[r++] = 128 | c >> 6 & 63, e[r++] = 128 | c & 63;
        }
      }
      return e[r] = 0, r - a;
    }, $n = (t, e, r) => Oe(t, W, e, r), De = (t) => {
      for (var e = 0, r = 0; r < t.length; ++r) {
        var n = t.charCodeAt(r);
        n <= 127 ? e++ : n <= 2047 ? e += 2 : n >= 55296 && n <= 57343 ? (e += 4, ++r) : e += 3;
      }
      return e;
    }, xe = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, bn = (t, e, r) => {
      for (var n = e + r, a = e; t[a] && !(a >= n); )
        ++a;
      if (a - e > 16 && t.buffer && xe)
        return xe.decode(t.subarray(e, a));
      for (var i = ""; e < a; ) {
        var u = t[e++];
        if (!(u & 128)) {
          i += String.fromCharCode(u);
          continue;
        }
        var c = t[e++] & 63;
        if ((u & 224) == 192) {
          i += String.fromCharCode((u & 31) << 6 | c);
          continue;
        }
        var l = t[e++] & 63;
        if ((u & 240) == 224 ? u = (u & 15) << 12 | c << 6 | l : u = (u & 7) << 18 | c << 12 | l << 6 | t[e++] & 63, u < 65536)
          i += String.fromCharCode(u);
        else {
          var f = u - 65536;
          i += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
        }
      }
      return i;
    }, Jt = (t, e) => t ? bn(W, t, e) : "", Cn = (t, e) => {
      e = I(e);
      var r = e === "std::string";
      X(t, {
        name: e,
        fromWireType(n) {
          var a = T[n >> 2], i = n + 4, u;
          if (r)
            for (var c = i, l = 0; l <= a; ++l) {
              var f = i + l;
              if (l == a || W[f] == 0) {
                var p = f - c, v = Jt(c, p);
                u === void 0 ? u = v : (u += "\0", u += v), c = f + 1;
              }
            }
          else {
            for (var y = new Array(a), l = 0; l < a; ++l)
              y[l] = String.fromCharCode(W[i + l]);
            u = y.join("");
          }
          return K(n), u;
        },
        toWireType(n, a) {
          a instanceof ArrayBuffer && (a = new Uint8Array(a));
          var i, u = typeof a == "string";
          u || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || C("Cannot pass non-string to std::string"), r && u ? i = De(a) : i = a.length;
          var c = ee(4 + i + 1), l = c + 4;
          if (T[c >> 2] = i, r && u)
            $n(a, l, i + 1);
          else if (u)
            for (var f = 0; f < i; ++f) {
              var p = a.charCodeAt(f);
              p > 255 && (K(l), C("String has UTF-16 code units that do not fit in 8 bits")), W[l + f] = p;
            }
          else
            for (var f = 0; f < i; ++f)
              W[l + f] = a[f];
          return n !== null && n.push(K, c), c;
        },
        argPackAdvance: q,
        readValueFromPointer: be,
        destructorFunction(n) {
          K(n);
        }
      });
    }, Fe = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, _n = (t, e) => {
      for (var r = t, n = r >> 1, a = n + e / 2; !(n >= a) && ft[n]; )
        ++n;
      if (r = n << 1, r - t > 32 && Fe)
        return Fe.decode(W.subarray(t, r));
      for (var i = "", u = 0; !(u >= e / 2); ++u) {
        var c = at[t + u * 2 >> 1];
        if (c == 0)
          break;
        i += String.fromCharCode(c);
      }
      return i;
    }, Tn = (t, e, r) => {
      var n;
      if ((n = r) !== null && n !== void 0 || (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var a = e, i = r < t.length * 2 ? r / 2 : t.length, u = 0; u < i; ++u) {
        var c = t.charCodeAt(u);
        at[e >> 1] = c, e += 2;
      }
      return at[e >> 1] = 0, e - a;
    }, Pn = (t) => t.length * 2, En = (t, e) => {
      for (var r = 0, n = ""; !(r >= e / 4); ) {
        var a = k[t + r * 4 >> 2];
        if (a == 0)
          break;
        if (++r, a >= 65536) {
          var i = a - 65536;
          n += String.fromCharCode(55296 | i >> 10, 56320 | i & 1023);
        } else
          n += String.fromCharCode(a);
      }
      return n;
    }, An = (t, e, r) => {
      var n;
      if ((n = r) !== null && n !== void 0 || (r = 2147483647), r < 4)
        return 0;
      for (var a = e, i = a + r - 4, u = 0; u < t.length; ++u) {
        var c = t.charCodeAt(u);
        if (c >= 55296 && c <= 57343) {
          var l = t.charCodeAt(++u);
          c = 65536 + ((c & 1023) << 10) | l & 1023;
        }
        if (k[e >> 2] = c, e += 4, e + 4 > i)
          break;
      }
      return k[e >> 2] = 0, e - a;
    }, On = (t) => {
      for (var e = 0, r = 0; r < t.length; ++r) {
        var n = t.charCodeAt(r);
        n >= 55296 && n <= 57343 && ++r, e += 4;
      }
      return e;
    }, Dn = (t, e, r) => {
      r = I(r);
      var n, a, i, u, c;
      e === 2 ? (n = _n, a = Tn, u = Pn, i = () => ft, c = 1) : e === 4 && (n = En, a = An, u = On, i = () => T, c = 2), X(t, {
        name: r,
        fromWireType: (l) => {
          for (var f = T[l >> 2], p = i(), v, y = l + 4, w = 0; w <= f; ++w) {
            var E = l + 4 + w * e;
            if (w == f || p[E >> c] == 0) {
              var x = E - y, _ = n(y, x);
              v === void 0 ? v = _ : (v += "\0", v += _), y = E + e;
            }
          }
          return K(l), v;
        },
        toWireType: (l, f) => {
          typeof f != "string" && C(`Cannot pass non-string to C++ string type ${r}`);
          var p = u(f), v = ee(4 + p + e);
          return T[v >> 2] = p >> c, a(f, v + 4, p + e), l !== null && l.push(K, v), v;
        },
        argPackAdvance: q,
        readValueFromPointer: Ut,
        destructorFunction(l) {
          K(l);
        }
      });
    }, xn = (t, e, r, n, a, i) => {
      Tt[t] = {
        name: I(e),
        rawConstructor: N(r, n),
        rawDestructor: N(a, i),
        fields: []
      };
    }, Fn = (t, e, r, n, a, i, u, c, l, f) => {
      Tt[t].fields.push({
        fieldName: I(e),
        getterReturnType: r,
        getter: N(n, a),
        getterContext: i,
        setterArgumentType: u,
        setter: N(c, l),
        setterContext: f
      });
    }, Mn = (t, e) => {
      e = I(e), X(t, {
        isVoid: !0,
        name: e,
        argPackAdvance: 0,
        fromWireType: () => {
        },
        toWireType: (r, n) => {
        }
      });
    }, Kt = [], Sn = (t, e, r, n) => (t = Kt[t], e = J.toValue(e), t(null, e, r, n)), jn = {}, In = (t) => {
      var e = jn[t];
      return e === void 0 ? I(t) : e;
    }, Me = () => {
      if (typeof globalThis == "object")
        return globalThis;
      function t(e) {
        e.$$$embind_global$$$ = e;
        var r = typeof $$$embind_global$$$ == "object" && e.$$$embind_global$$$ == e;
        return r || delete e.$$$embind_global$$$, r;
      }
      if (typeof $$$embind_global$$$ == "object" || (typeof global == "object" && t(global) ? $$$embind_global$$$ = global : typeof self == "object" && t(self) && ($$$embind_global$$$ = self), typeof $$$embind_global$$$ == "object"))
        return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }, Rn = (t) => t === 0 ? J.toHandle(Me()) : (t = In(t), J.toHandle(Me()[t])), Wn = (t) => {
      var e = Kt.length;
      return Kt.push(t), e;
    }, kn = (t, e) => {
      for (var r = new Array(t), n = 0; n < t; ++n)
        r[n] = Qt(T[e + n * 4 >> 2], "parameter " + n);
      return r;
    }, Hn = Reflect.construct, Bn = (t, e, r) => {
      var n = [], a = t.toWireType(n, r);
      return n.length && (T[e >> 2] = J.toHandle(n)), a;
    }, Un = (t, e, r) => {
      var n = kn(t, e), a = n.shift();
      t--;
      var i = new Array(t), u = (l, f, p, v) => {
        for (var y = 0, w = 0; w < t; ++w)
          i[w] = n[w].readValueFromPointer(v + y), y += n[w].argPackAdvance;
        for (var E = r === 1 ? Hn(f, i) : f.apply(l, i), w = 0; w < t; ++w) {
          var x, _;
          (x = (_ = n[w]).deleteObject) === null || x === void 0 || x.call(_, i[w]);
        }
        return Bn(a, p, E);
      }, c = `methodCaller<(${n.map((l) => l.name).join(", ")}) => ${a.name}>`;
      return Wn(gt(c, u));
    }, Vn = (t) => {
      t > 4 && (z.get(t).refcount += 1);
    }, Ln = (t) => {
      var e = J.toValue(t);
      Bt(e), qt(t);
    }, Yn = (t, e) => {
      t = Qt(t, "_emval_take_value");
      var r = t.readValueFromPointer(e);
      return J.toHandle(r);
    }, zn = () => {
      bt("");
    }, Nn = (t, e, r) => W.copyWithin(t, e, e + r), Gn = () => 2147483648, Xn = (t) => {
      var e = tt.buffer, r = (t - e.byteLength + 65535) / 65536;
      try {
        return tt.grow(r), se(), 1;
      } catch {
      }
    }, qn = (t) => {
      var e = W.length;
      t >>>= 0;
      var r = Gn();
      if (t > r)
        return !1;
      for (var n = (l, f) => l + (f - l % f) % f, a = 1; a <= 4; a *= 2) {
        var i = e * (1 + 0.2 / a);
        i = Math.min(i, t + 100663296);
        var u = Math.min(r, n(Math.max(t, i), 65536)), c = Xn(u);
        if (c)
          return !0;
      }
      return !1;
    }, te = {}, Qn = () => H || "./this.program", wt = () => {
      if (!wt.strings) {
        var t = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", e = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: t,
          _: Qn()
        };
        for (var r in te)
          te[r] === void 0 ? delete e[r] : e[r] = te[r];
        var n = [];
        for (var r in e)
          n.push(`${r}=${e[r]}`);
        wt.strings = n;
      }
      return wt.strings;
    }, Zn = (t, e) => {
      for (var r = 0; r < t.length; ++r)
        V[e++ >> 0] = t.charCodeAt(r);
      V[e >> 0] = 0;
    }, Jn = (t, e) => {
      var r = 0;
      return wt().forEach((n, a) => {
        var i = e + r;
        T[t + a * 4 >> 2] = i, Zn(n, i), r += n.length + 1;
      }), 0;
    }, Kn = (t, e) => {
      var r = wt();
      T[t >> 2] = r.length;
      var n = 0;
      return r.forEach((a) => n += a.length + 1), T[e >> 2] = n, 0;
    }, ta = (t) => t, Mt = (t) => t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0), ea = (t, e) => {
      for (var r = 0, n = 0; n <= e; r += t[n++])
        ;
      return r;
    }, Se = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], je = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], ra = (t, e) => {
      for (var r = new Date(t.getTime()); e > 0; ) {
        var n = Mt(r.getFullYear()), a = r.getMonth(), i = (n ? Se : je)[a];
        if (e > i - r.getDate())
          e -= i - r.getDate() + 1, r.setDate(1), a < 11 ? r.setMonth(a + 1) : (r.setMonth(0), r.setFullYear(r.getFullYear() + 1));
        else
          return r.setDate(r.getDate() + e), r;
      }
      return r;
    };
    function na(t, e, r) {
      var n = r > 0 ? r : De(t) + 1, a = new Array(n), i = Oe(t, a, 0, a.length);
      return e && (a.length = i), a;
    }
    var aa = (t, e) => {
      V.set(t, e);
    }, oa = (t, e, r, n) => {
      var a = T[n + 40 >> 2], i = {
        tm_sec: k[n >> 2],
        tm_min: k[n + 4 >> 2],
        tm_hour: k[n + 8 >> 2],
        tm_mday: k[n + 12 >> 2],
        tm_mon: k[n + 16 >> 2],
        tm_year: k[n + 20 >> 2],
        tm_wday: k[n + 24 >> 2],
        tm_yday: k[n + 28 >> 2],
        tm_isdst: k[n + 32 >> 2],
        tm_gmtoff: k[n + 36 >> 2],
        tm_zone: a ? Jt(a) : ""
      }, u = Jt(r), c = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
      };
      for (var l in c)
        u = u.replace(new RegExp(l, "g"), c[l]);
      var f = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], p = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function v(d, m, F) {
        for (var j = typeof d == "number" ? d.toString() : d || ""; j.length < m; )
          j = F[0] + j;
        return j;
      }
      function y(d, m) {
        return v(d, m, "0");
      }
      function w(d, m) {
        function F(ut) {
          return ut < 0 ? -1 : ut > 0 ? 1 : 0;
        }
        var j;
        return (j = F(d.getFullYear() - m.getFullYear())) === 0 && (j = F(d.getMonth() - m.getMonth())) === 0 && (j = F(d.getDate() - m.getDate())), j;
      }
      function E(d) {
        switch (d.getDay()) {
          case 0:
            return new Date(d.getFullYear() - 1, 11, 29);
          case 1:
            return d;
          case 2:
            return new Date(d.getFullYear(), 0, 3);
          case 3:
            return new Date(d.getFullYear(), 0, 2);
          case 4:
            return new Date(d.getFullYear(), 0, 1);
          case 5:
            return new Date(d.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(d.getFullYear() - 1, 11, 30);
        }
      }
      function x(d) {
        var m = ra(new Date(d.tm_year + 1900, 0, 1), d.tm_yday), F = new Date(m.getFullYear(), 0, 4), j = new Date(m.getFullYear() + 1, 0, 4), ut = E(F), jt = E(j);
        return w(ut, m) <= 0 ? w(jt, m) <= 0 ? m.getFullYear() + 1 : m.getFullYear() : m.getFullYear() - 1;
      }
      var _ = {
        "%a": (d) => f[d.tm_wday].substring(0, 3),
        "%A": (d) => f[d.tm_wday],
        "%b": (d) => p[d.tm_mon].substring(0, 3),
        "%B": (d) => p[d.tm_mon],
        "%C": (d) => {
          var m = d.tm_year + 1900;
          return y(m / 100 | 0, 2);
        },
        "%d": (d) => y(d.tm_mday, 2),
        "%e": (d) => v(d.tm_mday, 2, " "),
        "%g": (d) => x(d).toString().substring(2),
        "%G": (d) => x(d),
        "%H": (d) => y(d.tm_hour, 2),
        "%I": (d) => {
          var m = d.tm_hour;
          return m == 0 ? m = 12 : m > 12 && (m -= 12), y(m, 2);
        },
        "%j": (d) => y(d.tm_mday + ea(Mt(d.tm_year + 1900) ? Se : je, d.tm_mon - 1), 3),
        "%m": (d) => y(d.tm_mon + 1, 2),
        "%M": (d) => y(d.tm_min, 2),
        "%n": () => `
`,
        "%p": (d) => d.tm_hour >= 0 && d.tm_hour < 12 ? "AM" : "PM",
        "%S": (d) => y(d.tm_sec, 2),
        "%t": () => "	",
        "%u": (d) => d.tm_wday || 7,
        "%U": (d) => {
          var m = d.tm_yday + 7 - d.tm_wday;
          return y(Math.floor(m / 7), 2);
        },
        "%V": (d) => {
          var m = Math.floor((d.tm_yday + 7 - (d.tm_wday + 6) % 7) / 7);
          if ((d.tm_wday + 371 - d.tm_yday - 2) % 7 <= 2 && m++, m) {
            if (m == 53) {
              var F = (d.tm_wday + 371 - d.tm_yday) % 7;
              F != 4 && (F != 3 || !Mt(d.tm_year)) && (m = 1);
            }
          } else {
            m = 52;
            var j = (d.tm_wday + 7 - d.tm_yday - 1) % 7;
            (j == 4 || j == 5 && Mt(d.tm_year % 400 - 1)) && m++;
          }
          return y(m, 2);
        },
        "%w": (d) => d.tm_wday,
        "%W": (d) => {
          var m = d.tm_yday + 7 - (d.tm_wday + 6) % 7;
          return y(Math.floor(m / 7), 2);
        },
        "%y": (d) => (d.tm_year + 1900).toString().substring(2),
        "%Y": (d) => d.tm_year + 1900,
        "%z": (d) => {
          var m = d.tm_gmtoff, F = m >= 0;
          return m = Math.abs(m) / 60, m = m / 60 * 100 + m % 60, (F ? "+" : "-") + ("0000" + m).slice(-4);
        },
        "%Z": (d) => d.tm_zone,
        "%%": () => "%"
      };
      u = u.replace(/%%/g, "\0\0");
      for (var l in _)
        u.includes(l) && (u = u.replace(new RegExp(l, "g"), _[l](i)));
      u = u.replace(/\0\0/g, "%");
      var R = na(u, !1);
      return R.length > e ? 0 : (aa(R, t), R.length - 1);
    }, ia = (t, e, r, n, a) => oa(t, e, r, n);
    pe = s.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, Fr(), st = s.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Lr(), Hr(), Zr(), Te = s.UnboundTypeError = en(Error, "UnboundTypeError"), sn(), cn();
    var sa = {
      s: $r,
      u: br,
      b: _r,
      g: Tr,
      q: Pr,
      J: Er,
      f: Ar,
      V: Or,
      d: Cr,
      da: Dr,
      Q: xr,
      _: Sr,
      ca: rn,
      ba: an,
      w: on,
      Y: ln,
      x: fn,
      h: hn,
      L: mn,
      M: vn,
      t: gn,
      o: wn,
      K: Cn,
      C: Dn,
      A: xn,
      ea: Fn,
      $: Mn,
      R: Sn,
      ha: qt,
      fa: Rn,
      Z: Un,
      N: Vn,
      O: Ln,
      aa: Yn,
      B: zn,
      X: Nn,
      W: qn,
      T: Jn,
      U: Kn,
      E: _a,
      D: fa,
      F: Ca,
      n: Ta,
      a: ua,
      e: pa,
      m: da,
      k: va,
      H: $a,
      v: ga,
      G: ba,
      z: Ea,
      P: Oa,
      l: ma,
      j: ha,
      c: la,
      p: ca,
      I: wa,
      r: Pa,
      i: ya,
      y: Aa,
      ga: ta,
      S: ia
    }, S = wr(), K = s._free = (t) => (K = s._free = S.ka)(t), ee = s._malloc = (t) => (ee = s._malloc = S.la)(t), Ie = (t) => (Ie = S.na)(t), P = (t, e) => (P = S.oa)(t, e), $t = (t) => ($t = S.pa)(t), O = () => (O = S.qa)(), D = (t) => (D = S.ra)(t), Re = (t) => (Re = S.sa)(t), We = (t) => (We = S.ta)(t), ke = (t, e, r) => (ke = S.ua)(t, e, r), He = (t) => (He = S.va)(t);
    s.dynCall_viijii = (t, e, r, n, a, i, u) => (s.dynCall_viijii = S.wa)(t, e, r, n, a, i, u);
    var Be = s.dynCall_jiiii = (t, e, r, n, a) => (Be = s.dynCall_jiiii = S.xa)(t, e, r, n, a);
    s.dynCall_iiiiij = (t, e, r, n, a, i, u) => (s.dynCall_iiiiij = S.ya)(t, e, r, n, a, i, u), s.dynCall_iiiiijj = (t, e, r, n, a, i, u, c, l) => (s.dynCall_iiiiijj = S.za)(t, e, r, n, a, i, u, c, l), s.dynCall_iiiiiijj = (t, e, r, n, a, i, u, c, l, f) => (s.dynCall_iiiiiijj = S.Aa)(t, e, r, n, a, i, u, c, l, f);
    function ua(t, e) {
      var r = O();
      try {
        return A(t)(e);
      } catch (n) {
        if (D(r), n !== n + 0)
          throw n;
        P(1, 0);
      }
    }
    function ca(t, e, r, n) {
      var a = O();
      try {
        A(t)(e, r, n);
      } catch (i) {
        if (D(a), i !== i + 0)
          throw i;
        P(1, 0);
      }
    }
    function la(t, e, r) {
      var n = O();
      try {
        A(t)(e, r);
      } catch (a) {
        if (D(n), a !== a + 0)
          throw a;
        P(1, 0);
      }
    }
    function da(t, e, r, n) {
      var a = O();
      try {
        return A(t)(e, r, n);
      } catch (i) {
        if (D(a), i !== i + 0)
          throw i;
        P(1, 0);
      }
    }
    function fa(t, e, r, n, a) {
      var i = O();
      try {
        return A(t)(e, r, n, a);
      } catch (u) {
        if (D(i), u !== u + 0)
          throw u;
        P(1, 0);
      }
    }
    function ha(t, e) {
      var r = O();
      try {
        A(t)(e);
      } catch (n) {
        if (D(r), n !== n + 0)
          throw n;
        P(1, 0);
      }
    }
    function pa(t, e, r) {
      var n = O();
      try {
        return A(t)(e, r);
      } catch (a) {
        if (D(n), a !== a + 0)
          throw a;
        P(1, 0);
      }
    }
    function ma(t) {
      var e = O();
      try {
        A(t)();
      } catch (r) {
        if (D(e), r !== r + 0)
          throw r;
        P(1, 0);
      }
    }
    function va(t, e, r, n, a) {
      var i = O();
      try {
        return A(t)(e, r, n, a);
      } catch (u) {
        if (D(i), u !== u + 0)
          throw u;
        P(1, 0);
      }
    }
    function ya(t, e, r, n, a, i, u, c, l, f, p) {
      var v = O();
      try {
        A(t)(e, r, n, a, i, u, c, l, f, p);
      } catch (y) {
        if (D(v), y !== y + 0)
          throw y;
        P(1, 0);
      }
    }
    function ga(t, e, r, n, a, i, u) {
      var c = O();
      try {
        return A(t)(e, r, n, a, i, u);
      } catch (l) {
        if (D(c), l !== l + 0)
          throw l;
        P(1, 0);
      }
    }
    function wa(t, e, r, n, a) {
      var i = O();
      try {
        A(t)(e, r, n, a);
      } catch (u) {
        if (D(i), u !== u + 0)
          throw u;
        P(1, 0);
      }
    }
    function $a(t, e, r, n, a, i) {
      var u = O();
      try {
        return A(t)(e, r, n, a, i);
      } catch (c) {
        if (D(u), c !== c + 0)
          throw c;
        P(1, 0);
      }
    }
    function ba(t, e, r, n, a, i, u, c) {
      var l = O();
      try {
        return A(t)(e, r, n, a, i, u, c);
      } catch (f) {
        if (D(l), f !== f + 0)
          throw f;
        P(1, 0);
      }
    }
    function Ca(t, e, r, n) {
      var a = O();
      try {
        return A(t)(e, r, n);
      } catch (i) {
        if (D(a), i !== i + 0)
          throw i;
        P(1, 0);
      }
    }
    function _a(t, e, r, n) {
      var a = O();
      try {
        return A(t)(e, r, n);
      } catch (i) {
        if (D(a), i !== i + 0)
          throw i;
        P(1, 0);
      }
    }
    function Ta(t) {
      var e = O();
      try {
        return A(t)();
      } catch (r) {
        if (D(e), r !== r + 0)
          throw r;
        P(1, 0);
      }
    }
    function Pa(t, e, r, n, a, i, u, c) {
      var l = O();
      try {
        A(t)(e, r, n, a, i, u, c);
      } catch (f) {
        if (D(l), f !== f + 0)
          throw f;
        P(1, 0);
      }
    }
    function Ea(t, e, r, n, a, i, u, c, l, f, p, v) {
      var y = O();
      try {
        return A(t)(e, r, n, a, i, u, c, l, f, p, v);
      } catch (w) {
        if (D(y), w !== w + 0)
          throw w;
        P(1, 0);
      }
    }
    function Aa(t, e, r, n, a, i, u, c, l, f, p, v, y, w, E, x) {
      var _ = O();
      try {
        A(t)(e, r, n, a, i, u, c, l, f, p, v, y, w, E, x);
      } catch (R) {
        if (D(_), R !== R + 0)
          throw R;
        P(1, 0);
      }
    }
    function Oa(t, e, r, n, a) {
      var i = O();
      try {
        return Be(t, e, r, n, a);
      } catch (u) {
        if (D(i), u !== u + 0)
          throw u;
        P(1, 0);
      }
    }
    var St;
    ht = function t() {
      St || Ue(), St || (ht = t);
    };
    function Ue() {
      if (et > 0 || (ur(), et > 0))
        return;
      function t() {
        St || (St = !0, s.calledRun = !0, !dt && (cr(), $(s), s.onRuntimeInitialized && s.onRuntimeInitialized(), lr()));
      }
      s.setStatus ? (s.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          s.setStatus("");
        }, 1), t();
      }, 1)) : t();
    }
    if (s.preInit)
      for (typeof s.preInit == "function" && (s.preInit = [s.preInit]); s.preInit.length > 0; )
        s.preInit.pop()();
    return Ue(), h.ready;
  };
})();
function to(o) {
  return ae(
    Rt,
    o
  );
}
function ao(o) {
  return Za(
    Rt,
    o
  );
}
async function eo(o, h) {
  return Ja(
    Rt,
    o,
    h
  );
}
async function ro(o, h) {
  return Ka(
    Rt,
    o,
    h
  );
}
var ct;
class oo extends EventTarget {
  constructor(s = {}) {
    var $;
    super();
    ze(this, ct, void 0);
    try {
      const g = ($ = s == null ? void 0 : s.formats) == null ? void 0 : $.filter(
        (b) => b !== "unknown"
      );
      if ((g == null ? void 0 : g.length) === 0)
        throw new TypeError("Hint option provided, but is empty.");
      g == null || g.forEach((b) => {
        if (!It.has(b))
          throw new TypeError(
            `Failed to read the 'formats' property from 'BarcodeDetectorOptions': The provided value '${b}' is not a valid enum value of type BarcodeFormat.`
          );
      }), Ne(this, ct, g != null ? g : []), to().then((b) => {
        this.dispatchEvent(
          new CustomEvent("load", {
            detail: b
          })
        );
      }).catch((b) => {
        this.dispatchEvent(new CustomEvent("error", { detail: b }));
      });
    } catch (g) {
      throw Ge(
        g,
        "Failed to construct 'BarcodeDetector'"
      );
    }
  }
  static async getSupportedFormats() {
    return Da.filter((s) => s !== "unknown");
  }
  async detect(s) {
    try {
      const $ = await Ra(s);
      if ($ === null)
        return [];
      let g;
      try {
        ar($) ? g = await eo($, {
          tryHarder: !0,
          formats: re(this, ct).map((b) => It.get(b))
        }) : g = await ro($, {
          tryHarder: !0,
          formats: re(this, ct).map((b) => It.get(b))
        });
      } catch (b) {
        throw console.error(b), new DOMException(
          "Barcode detection service unavailable.",
          "NotSupportedError"
        );
      }
      return g.map((b) => {
        const {
          topLeft: { x: H, y: L },
          topRight: { x: B, y: M },
          bottomLeft: { x: Y, y: G },
          bottomRight: { x: U, y: Q }
        } = b.position, tt = Math.min(H, B, Y, U), dt = Math.min(L, M, G, Q), V = Math.max(H, B, Y, U), W = Math.max(L, M, G, Q);
        return {
          boundingBox: new DOMRectReadOnly(
            tt,
            dt,
            V - tt,
            W - dt
          ),
          rawValue: b.text,
          format: xa(b.format),
          cornerPoints: [
            {
              x: H,
              y: L
            },
            {
              x: B,
              y: M
            },
            {
              x: U,
              y: Q
            },
            {
              x: Y,
              y: G
            }
          ]
        };
      });
    } catch ($) {
      throw Ge(
        $,
        "Failed to execute 'detect' on 'BarcodeDetector'"
      );
    }
  }
}
ct = new WeakMap();
export {
  oo as BarcodeDetector,
  ao as setZXingModuleOverrides
};
