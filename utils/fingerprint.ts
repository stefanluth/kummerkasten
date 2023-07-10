import { createHash } from 'crypto';

export function createFingerprint(window: Window, ipAddress: string) {
  if (window.navigator.webdriver) return 'webdriver';
  if (window.navigator.languages === undefined) return 'noLanguages';

  return createHash('sha256')
    .update(
      new Date().getTimezoneOffset() +
        window.navigator.userAgent +
        window.screen.width +
        window.screen.height +
        window.screen.colorDepth +
        window.screen.orientation +
        window.screen.pixelDepth +
        window.screen.availWidth +
        window.screen.availHeight +
        window.navigator.cookieEnabled +
        window.navigator.hardwareConcurrency +
        window.navigator.language +
        window.navigator.maxTouchPoints +
        window.navigator.pdfViewerEnabled +
        ipAddress +
        getRenderer()
    )
    .digest('hex');
}

function getRenderer() {
  const gl = document.createElement('canvas').getContext('webgl');
  if (!gl) return 'noWebGL';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 'noDebugInfo';

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  return renderer;
}
