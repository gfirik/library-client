"use client";

import React, { useEffect } from "react";
import Script from "next/script";

const ScriptsBlock: React.FC = () => {
  useEffect(() => {
    const handleScriptLoad = () => {
      const event = new Event("telegram-web-app-loaded");
      window.dispatchEvent(event);
    };

    const scriptElement = document.querySelector(
      'script[src="https://telegram.org/js/telegram-web-app.js"]'
    );

    if (scriptElement) {
      scriptElement.addEventListener("load", handleScriptLoad);
    }

    return () => {
      if (scriptElement) {
        scriptElement.removeEventListener("load", handleScriptLoad);
      }
    };
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      onLoad={() => window.dispatchEvent(new Event("telegram-web-app-loaded"))}
      defer
    />
  );
};

export default ScriptsBlock;
