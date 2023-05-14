import { createHash } from "crypto";

export function createFingerprint(w: Window) {
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
        w.navigator.pdfViewerEnabled
    )
    .digest("hex");
}
