import React, { useEffect } from "react";

const ChatWootWidget = () => {
    useEffect(() => {
        // Tạo script
        const script = document.createElement("script");
        script.src = "https://app.chatwoot.com/packs/js/sdk.js";
        script.defer = true;
        script.async = true;

        script.onload = () => {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: "LJN42hdhLMcAR8Y3A8Ky7ojB",
                    baseUrl: "https://app.chatwoot.com",
                });
            }
        };

        // Gắn script vào body
        document.body.appendChild(script);

        // Cleanup khi component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="chatwoot-widget"></div>;
};

export default ChatWootWidget;
