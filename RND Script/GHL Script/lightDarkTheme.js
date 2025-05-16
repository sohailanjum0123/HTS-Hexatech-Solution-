
(() => {
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

  window.addEventListener('routeChangeEvent',toggleButton);

  function toggleButton() {
    if (!location.href.includes("v2/location/")) {
      return;
    }

    waitElement(".hl_header--controls").then((header) => {
      const toggleWrapper = "toggle-wrapper";
      const toggleInputId = "theme-toggle";

      if (header && !document.querySelector("." + toggleWrapper)) {
        const dashboardLocation =
          document.querySelector(".sidebar-v2-location") ?? "";
        const topHeader = document.querySelector(".hl_header--controls");

        const toggleHTML = `
          <div class="${toggleWrapper}">
            <input type="checkbox" id="${toggleInputId}" class="toggle-input">
            <label for="${toggleInputId}" class="toggle-label">
              <span class="toggle-icon light">☀️</span>
              <span class="toggle-icon dark">🌙</span>
            </label>
          </div>
        `;
        topHeader.insertAdjacentHTML("beforebegin", toggleHTML);

        const themeToggle = document.getElementById(toggleInputId);

        // Helper function to update the toggle state
        function updateToggleState() {
          const subaccountId = location.href.split("/")[5];
          const darkModeArray =
            JSON.parse(localStorage.getItem("darkModeSubaccounts")) || [];
          const isDarkMode = darkModeArray.includes(subaccountId);

          themeToggle.checked = isDarkMode; // Set the toggle state
          if (isDarkMode) {
            dashboardLocation.classList.add("dark-mode");
          } else {
            dashboardLocation.classList.remove("dark-mode");
          }
        }

        // Initial setup on load or route change
        updateToggleState();

        // Toggle change event handler
        themeToggle.addEventListener("change", (event) => {
          const subaccountId = location.href.split("/")[5];
          let darkModeArray =
            JSON.parse(localStorage.getItem("darkModeSubaccounts")) || [];

          if (event.target.checked) {
            dashboardLocation.classList.add("dark-mode");
            if (!darkModeArray.includes(subaccountId)) {
              darkModeArray.push(subaccountId);
            }
          } else {
            dashboardLocation.classList.remove("dark-mode");
            darkModeArray = darkModeArray.filter((id) => id !== subaccountId);
          }

          localStorage.setItem(
            "darkModeSubaccounts",
            JSON.stringify(darkModeArray)
          );
        });

        const observer = new MutationObserver(() => {
          if (location.href.includes("v2/location/")) {
            updateToggleState();
          }
        });
        observer.observe(document, { subtree: true, childList: true });
      }
    });
  }

  toggleButton();
})();