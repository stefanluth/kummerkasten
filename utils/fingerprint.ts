import { createHash } from 'crypto';

export async function createFingerprint(window: Window, ipAddress: string): Promise<string> {
  if (window.navigator.webdriver) return 'webdriver';
  if (window.navigator.languages === undefined) return 'noLanguages';

  const devices = (await navigator.mediaDevices.enumerateDevices()).map((device) => `${device.kind} ${device.label}`);
  const codecs = await getCodecs();
  const canvasData = getCanvasData();
  const renderer = getRenderer();

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
        devices +
        codecs +
        canvasData +
        renderer
    )
    .digest('hex');
}

function getRenderer(): string {
  const gl = document.createElement('canvas').getContext('webgl');
  if (!gl) return 'noWebGL';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 'noDebugInfo';

  const renderer: string = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  const supportedExtensions = gl.getSupportedExtensions();

  return `${renderer} ${supportedExtensions}`;
}

function getCanvasData() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Fingerprint', 10, 50);
  const data = canvas.toDataURL('image/png');

  return data;
}

async function getCodecs() {
  const pc = new RTCPeerConnection();

  const sessionDescription = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
  await pc.setLocalDescription(sessionDescription);
  const description = pc.localDescription as RTCSessionDescription;

  pc.close();

  const codecs = description.sdp
    .split('\n')
    .filter((line) => line.includes('a=rtpmap'))
    .map((line) => line.split(' ')[1]);

  return codecs;
}
