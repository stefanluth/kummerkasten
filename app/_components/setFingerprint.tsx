"use client";

import { useEffect } from "react";
import { createFingerprint } from "@/utils";

export function SetFingerprint() {
  useEffect(() => {
    const fingerprint = createFingerprint(window);
    document.cookie = `fingerprint=${fingerprint}; path=/; max-age=86400; samesite=strict; secure`;
    console.log(`This device's fingerprint: ${fingerprint}`);
  }, []);

  return <></>;
}
