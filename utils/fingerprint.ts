import { createHash } from "crypto";

export function createFingerprint(w: Window) {
  if (w.navigator.webdriver) return "webdriver";
  if (w.navigator.languages === undefined) return "noLanguages";

  return createHash("sha256")
    .update(
      new Date().getTimezoneOffset() +
        w.navigator.userAgent +
        w.screen.width +
        w.screen.height +
        w.screen.colorDepth +
        w.screen.orientation +
        w.screen.pixelDepth +
        w.screen.availWidth +
        w.screen.availHeight +
        w.navigator.cookieEnabled +
        w.navigator.hardwareConcurrency +
        w.navigator.language +
        w.navigator.maxTouchPoints +
        w.navigator.pdfViewerEnabled +
        getRenderer()
    )
    .digest("hex");
}

function getRenderer() {
  const gl = document.createElement("canvas").getContext("webgl");
  if (!gl) return "noWebGL";

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "noDebugInfo";

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  return renderer;
}
