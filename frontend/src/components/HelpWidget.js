import React, { useEffect } from "react";

const HelpWidget = () => {
  useEffect(() => {
    // Check if Tawk.to script is already present
    if (document.getElementById("tawk-to-script")) return;

    const script = document.createElement("script");
    script.id = "tawk-to-script";
    script.src = "https://embed.tawk.to/680736d0b57ff7190d14d80f/1ipe2s86l";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null; // No visible UI needed
};

export default HelpWidget;