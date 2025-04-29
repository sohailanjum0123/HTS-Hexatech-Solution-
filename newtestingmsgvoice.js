(() => {

    
    function waitElement(selector) {
        return new Promise((resolve) => {
            const elm = document.querySelector(selector);
            if (elm) {
                resolve(elm);
                return;
            }
            new MutationObserver((mutations, observer) => {
                const elm = document.querySelector(selector);
                if (elm) {
                    observer.disconnect();
                    resolve(elm);
                }
            }).observe(document, { subtree: true, childList: true });
        });
    }

    let volume = 1.0; 
    let snoozeUntil = null;
    let dnd = false;

    function playNotificationSound() {
        if (dnd || (snoozeUntil && Date.now() < snoozeUntil)) return;

        const audio = new Audio("https://storage.googleapis.com/msgsndr/Q6sATpsoSLCPFf5ErtoF/media/6810abbe3176b90d8e63255d.mpeg");
        audio.volume = volume;
        audio.play().catch((err) => console.error("Audio playback error:", err));
    }

    // Function to dynamically create notification controls
    function createNotificationControls() {
        const existingControls = document.getElementById("notification-controls");
        if (existingControls) return; // Prevent duplicate controls

        const controls = document.createElement("div");
        controls.id = "notification-controls";
        controls.style.position = "fixed";
        controls.style.bottom = "20px";
        controls.style.right = "20px";
        controls.style.padding = "15px";
        controls.style.backgroundColor = "#f9f9f9";
        controls.style.border = "1px solid #ddd";
        controls.style.borderRadius = "10px";
        controls.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        controls.style.zIndex = "9999";

        controls.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label for="volumeSlider">Volume: </label>
                <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="${volume}" />
                <span id="volumeValue">${Math.round(volume * 100)}%</span>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="snoozeButton" style="padding: 5px 10px; border-radius: 5px;">Snooze (5 min)</button>
            </div>
            <div>
                <button id="dndButton" style="padding: 5px 10px; border-radius: 5px;">
                    ${dnd ? "Disable DND" : "Enable DND"}
                </button>
            </div>
        `;

        document.body.appendChild(controls);

        // Add event listeners for controls
        document.getElementById("volumeSlider").addEventListener("input", (e) => {
            volume = parseFloat(e.target.value);
            document.getElementById("volumeValue").textContent = `${Math.round(volume * 100)}%`;
        });

        document.getElementById("snoozeButton").addEventListener("click", () => {
            snoozeUntil = Date.now() + 5 * 60 * 1000; 
            alert("Notifications snoozed for 5 minutes.");
        });

        document.getElementById("dndButton").addEventListener("click", (e) => {
            dnd = !dnd;
            e.target.textContent = dnd ? "Disable DND" : "Enable DND";
            alert(dnd ? "Do Not Disturb enabled." : "Do Not Disturb disabled.");
        });
    }

    function onRouteChange() {
        console.log("Route change detected!");
        createNotificationControls();

        waitElement(".messages-group-inner").then((container) => {
            if (container) {
                console.log("Messages container detected!");

                let previousLength = container.querySelectorAll(".messages-single.--internal-comment-wrapper").length;

                new MutationObserver((mutations) => {
                    const currentLength = container.querySelectorAll(".messages-single.--internal-comment-wrapper").length;

                    if (currentLength > previousLength) {
                        console.log("New message detected!");

                        const newMessages = Array.from(container.querySelectorAll(".messages-single.--internal-comment-wrapper"))
                            .slice(previousLength);

                        newMessages.forEach((msg) => {
                            const messageText = msg.querySelector(".message-bubble")?.textContent?.trim();
                            if (messageText) {
                                alert(`New message: ${messageText}`);
                                playNotificationSound();
                            }
                        });

                        previousLength = currentLength;
                    }
                }).observe(container, { childList: true, subtree: true });
            }
        });
    }



    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange); 

    onRouteChange();
})();
