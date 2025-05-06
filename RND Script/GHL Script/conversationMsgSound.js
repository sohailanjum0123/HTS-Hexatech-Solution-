(() => {
  (() => {
    const style = document.createElement("style");
    style.textContent = `
        .notification-controller {
        position: fixed;
        top: 60px;
        right: 10px;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        font-family: Arial, sans-serif;
        width: 300px;
        z-index: 9999;
      }
      .notification-title {
        margin-bottom: 20px;
        color: #333;
        text-align: center;
      }
      .volume-wrapper, .dnd-wrapper, .snooze-wrapper {
        margin-bottom: 20px;
      }
      .volume-label, .dnd-label, .snooze-label {
        display: block;
        margin-bottom: 5px;
        color: #555;
      }
      .volume-slider {
        width: 100%;
      }
      .dnd-toggle {
        width: 50px;
        height: 25px;
        border-radius: 50px;
        background-color: #ccc;
        position: relative;
        cursor: pointer;
      }
      .dnd-toggle.active {
        background-color: #4caf50;
      }
      .dnd-indicator {
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.3s ease;
      }
      .snooze-input {
        border: 1px solid #ddd;
        padding: 5px;
        border-radius: 5px;
        margin-right: 10px;
      }
      .snooze-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
      }
      .cn-button {
        background-color:rgb(204, 112, 7);
        color: white;
        border: none;
        border-radius: 50%;
        padding: 6px 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight:bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }
       .cn-button:hover {
         transform: scale(1.1);
        }
       .cn-button:active {
        transform: scale(1);
         }
      `;
    document.head.appendChild(style);
  })();

  let isDND = false;
  let snoozeEndTime = null;
  let notificationVolume = 1.0;
  let conversationState = {};
  function waitElement(selector) {
    return new Promise((resolve) => {
      const elm = document.querySelector(selector);
      if (elm) {
        resolve(elm);
        return;
      }
      const observer = new MutationObserver(() => {
        const elm = document.querySelector(selector);
        if (elm) {
          observer.disconnect();
          resolve(elm);
        }
      });
      observer.observe(document, { subtree: true, childList: true });
    });
  }
  function requestAndShowNotification(fullName, silent = false) {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Message!", {
            body: `You have a new message from ${fullName}.`,
            icon: "https://example.com/icon.png",
            silent,
          });
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  }
  function playNotificationSound() {
    if (isDND || (snoozeEndTime && new Date() < snoozeEndTime)) {
      return;
    }

    const audio = new Audio(
      "https://storage.googleapis.com/msgsndr/6Bp6xq8xMkkdrYKY8HSl/media/6815c3bbdb0184bc8687fde4.mpeg"
    );
    audio.volume = notificationVolume; // Set volume
    audio.play().catch((err) => {
      console.error("Error playing notification sound:", err);
    });
  }
  function unreadConversation() {
    makeAPICall("conversations/search?locationId=" + getLocationId(), "get")
      .then((response) => {
        const conversations = response?.conversations ?? [];
        if (conversations.length > 0) {
          conversations.forEach((conversation) => {
            const { id, unreadCount, fullName } = conversation;

            if (!conversationState[id]) {
              conversationState[id] = { lastUnreadCount: 0 };
            }

            if (unreadCount > conversationState[id].lastUnreadCount) {
              conversationState[id].lastUnreadCount = unreadCount;

              if (isDND || (snoozeEndTime && new Date() < snoozeEndTime)) {
                return;
              }
              playNotificationSound();
              requestAndShowNotification(fullName);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error in unreadConversation:", err);
      });
  }
  function makeAPICall(url, method = "POST", body = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          "https://services.leadconnectorhq.com/" + url,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              channel: "APP",
              "content-type": "application/json",
              version: "2021-07-28",
              priority: "u=1, i",
              source: "WEB_USER",
              "token-id": await window.getToken(),
            },
            referrer: "https://app.gohighlevel.com/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: body,
            method: method,
          }
        );
        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error("Error in fetch:", error);
        reject(error);
      }
    });
  }
  function getLocationId() {
    let locationId = "";
    try {
      const loc = location.href.split("location/");
      locationId = loc[1].split("/")[0];
    } catch (e) {
      console.error("Error extracting location ID:", e);
    }
    return locationId;
  }
  function initializeCNButton() {
    waitElement("#template-power-dialer").then((topControl) => {
      if (topControl) {
        topControl.insertAdjacentHTML(
          "beforebegin",
          `
              <div class="VoiceController">
                  <div class="controllerBtn">
                      <button class="cn-button">CN</button>
                  </div>
              </div>
            `
        );

        const cnButton = document.querySelector(".cn-button");
        if (cnButton) {
          cnButton.addEventListener("click", () => {
            isControllerVisible = !isControllerVisible;
            createControllerUI();
          });
        }
      } else {
        console.error("Element #template-power-dialer not found.");
      }
    });
  }
  let isControllerVisible = false;
  let notificationController;
  function createControllerUI() {
    if (!notificationController) {
      const container = document.createElement("div");
      container.id = "notification-controller";
      container.className = "notification-controller";
      const cnButton = document.querySelector(".cn-button");
      cnButton.addEventListener("click", (e) => {
        e.stopPropagation(); 
        container.style.display =
          container.style.display === "none" ? "block" : "none";
      });

      // Hide container on outside click
      document.addEventListener("click", (e) => {
        if (!container.contains(e.target) && e.target !== cnButton) {
          container.style.display = "none";
        }
      });

      // Title
      const title = document.createElement("h5");
      title.innerText = "Notification Controller";
      title.className = "notification-title";
      container.appendChild(title);

      // Volume Slider
      const volumeWrapper = document.createElement("div");
      volumeWrapper.className = "volume-wrapper";

      const volumeLabel = document.createElement("label");
      volumeLabel.innerText = "Volume";
      volumeLabel.className = "volume-label";

      const volumeSlider = document.createElement("input");
      volumeSlider.type = "range";
      volumeSlider.min = "0";
      volumeSlider.max = "1";
      volumeSlider.step = "0.1";
      volumeSlider.className = "volume-slider";
      volumeSlider.oninput = (e) => {
        notificationVolume = parseFloat(e.target.value);
        console.log("Volume set to:", notificationVolume);
      };

      volumeWrapper.appendChild(volumeLabel);
      volumeWrapper.appendChild(volumeSlider);
      container.appendChild(volumeWrapper);

      // DND Toggle
      const dndWrapper = document.createElement("div");
      dndWrapper.className = "dnd-wrapper";

      const dndLabel = document.createElement("label");
      dndLabel.innerText = "Do Not Disturb";
      dndLabel.className = "dnd-label";

      const dndToggle = document.createElement("div");
      dndToggle.className = isDND ? "dnd-toggle active" : "dnd-toggle";

      const dndIndicator = document.createElement("div");
      dndIndicator.className = "dnd-indicator";
      dndIndicator.style.left = isDND ? "25px" : "5px"; // Set initial position

      dndToggle.appendChild(dndIndicator);
      dndToggle.onclick = () => {
        isDND = !isDND;
        dndToggle.className = isDND ? "dnd-toggle active" : "dnd-toggle";
        dndIndicator.style.left = isDND ? "25px" : "5px";
        console.log("DND is now", isDND ? "enabled" : "disabled");
      };

      dndToggle.appendChild(dndIndicator);
      dndWrapper.appendChild(dndLabel);
      dndWrapper.appendChild(dndToggle);
      container.appendChild(dndWrapper);

      // Snooze
      const snoozeWrapper = document.createElement("div");
      snoozeWrapper.className = "snooze-wrapper";

      const snoozeLabel = document.createElement("label");
      snoozeLabel.innerText = "Snooze";
      snoozeLabel.className = "snooze-label";

      const snoozeInput = document.createElement("input");
      snoozeInput.type = "number";
      snoozeInput.min = "1";
      snoozeInput.placeholder = "Minutes";
      snoozeInput.className = "snooze-input";

      const snoozeButton = document.createElement("button");
      snoozeButton.innerText = "Set";
      snoozeButton.className = "snooze-button";
      snoozeButton.onclick = () => {
        const minutes = parseInt(snoozeInput.value, 10);
        if (!isNaN(minutes)) {
          snoozeEndTime = new Date(Date.now() + minutes * 60000);
          console.log(`Snoozed for ${minutes} minutes.`);
        } else {
          alert("Enter valid time.");
        }
      };

      snoozeWrapper.appendChild(snoozeLabel);
      snoozeWrapper.appendChild(snoozeInput);
      snoozeWrapper.appendChild(snoozeButton);
      container.appendChild(snoozeWrapper);

      document.body.appendChild(container);
      notificationController = container;
    }

    notificationController.style.display = isControllerVisible
      ? "block"
      : "none";
  }
  initializeCNButton();
  setInterval(unreadConversation, 5000);
})();
