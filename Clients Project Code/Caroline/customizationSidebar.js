(() => {
  (() => {
    const style = document.createElement("style");
    style.id = "sidenavbarNew";
    style.textContent = `
    .sidebar-navigation {
      overflow-y: auto;
      height: 82vh;
    }
    .sidebar-v2-location #sidebar-v2 .hl_nav-header, .sidebar-v2-location #sidebar-v2 .hl_nav-settings {
      overflow-y: hidden !important;
      max-height: calc(100vh - 6rem) !important;
    }
    .sidebar-navigation ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .sidebar-navigation li {
      position: relative;
    }
    .sidebar-navigation a {
      padding: 10px 20px;
      text-decoration: none;
      color: #141414;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-navigation a:hover {
      background:#FF9500;
      color: #141414;
    }
    .sidebar-navigation a.active {
      background: #FF9500 !important;
      color: #141414;
    }
    .sidebar-navigation ul ul {
      display: none;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s ease-in-out;
      padding-left: 20px;
    }
    .sidebar-navigation li:hover > ul {
      display: block;
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.3s, transform 0.5s ease-in-out;
    }
    .sidebar-navigation ul > li.dropDownArrow > a::after {
      content: '';
      width: 20px;
      height: 20px;
      margin-left: 8px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>') no-repeat center;
      display: inline-block;
      transition: transform 0.3s ease-in-out;
    }

 .sidebar-navigation ul  a.custom-link i ,.sidebar-navigation ul a.custom-link > span:first-child {
    display:none;
}


    .sidebar-navigation ul > li.dropDownArrow:hover > a::after {
      transform: rotate(180deg);
    }
    .sidebar-v2-location #sidebar-v2 :is([class*="hl_nav-header"] nav > a:not(div.sidebar-navigation), .sidebar-v2-location #backButtonv2, .sidebar-v2-location .menu-title, .sidebar-v2-location [class*="hl_nav-header"] nav > .divider, .sidebar-v2-location .hl_new_badge) {
      display: none;
    }
    a#sb_settings {
      display: none;
    }
    #sidebar-v2 .hl_nav-header nav a.active, #sidebar-v2 .hl_nav-header nav a:hover, #sidebar-v2 .hl_nav-header-without-footer nav a.active, #sidebar-v2 .hl_nav-header-without-footer nav a:hover, #sidebar-v2 .hl_nav-settings nav a.active, #sidebar-v2 .hl_nav-settings nav a:hover, .sidebar-v2-location #sidebar-v2 .hl_nav-header nav a.active, .sidebar-v2-location #sidebar-v2 .hl_nav-header nav a:hover, .sidebar-v2-location #sidebar-v2 .hl_nav-header-without-footer nav a.active, .sidebar-v2-location #sidebar-v2 .hl_nav-header-without-footer nav a:hover, .sidebar-v2-location #sidebar-v2 .hl_nav-settings nav a.active,.sidebar-v2-location #sidebar-v2 .hl_nav-settings nav a:hover {
      color: #FF9500 !important;
    }
  `;
    document.head.appendChild(style);
  })();

  function waitElement(selector, time = 10000) {
    return new Promise((resolve, reject) => {
      let timewaiter = null;
      const elm = document.querySelector(selector);
      if (elm) {
        resolve(elm);
        return;
      }
      const observer = new MutationObserver(() => {
        const elm = document.querySelector(selector);
        if (elm) {
          clearTimeout(timewaiter);
          observer.disconnect();
          resolve(elm);
        }
      });
      if (time > 0) {
        timewaiter = setTimeout(() => {
          reject("not found");
        }, time);
      }
      try {
        observer.observe(document.body, { subtree: true, childList: true });
      } catch (error) {
        reject(new Error(`Error observing DOM: ${error.message}`));
      }
    });
  }

  let is_active = "active";
  const createMenu = (menu, parent = false) => {
    const ul = document.createElement("ul");
    menu.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      let isCustomLink = false;
      try {
        isCustomLink = item.id.split("-").length == 5;
      } catch (error) {}
      if (!isCustomLink) {
        a.textContent = item.title;
        a.className = `w-full group px-3 flex items-center
                justify-start md:justify-center lg:justify-start xl:justify-start text-sm rounded-md
                cursor-pointer custom-link font-medium opacity-70 hover:opacity-100 py-2 md:py-2`;
      }
      a.setAttribute("customLink", isCustomLink ? 1 : 0);
      if (item.parent === true) {
        li.className = "dropDownArrow";
      }
      let src = item.url || "#";
      a.setAttribute("data-href", src);
      a.id = "clone-" + item.id;

      a.setAttribute("parent_finder", item.id);
      if (src != "#" && src != "") {
        a.onclick = function (e) {
          e.preventDefault();
          setTimeout(function () {
            if (a.id === "clone-sb_business-settings-v2") {
              const parentNav = a.closest("nav");
              if (parentNav) {
                waitElement(`#sb_business-settings-v2`).then((companies) => {
                  companies.click();
                  makeActive(this, a.href);
                });
              }
            }
          }, 50);

          makeActive(this, item.url);
        };
      }
      li.appendChild(a);
      if (item.childs) {
        const subMenu = createMenu(item.childs, true);

        li.appendChild(subMenu);
      }
      ul.appendChild(li);
    });
    return ul;
  };

  function routeChange(url = "") {
    url = `/v2/location/${getLocationId()}/${url}`;
    try {
      history.pushState({}, null, url);
      window.dispatchEvent(new Event("popstate"));
    } catch (err) {
      if (url != "") {
        location.href = url;
      }
    }
  }

  function getLocationId() {
    let locationid = "";
    try {
      loc = location.href.split("location/");
      locationid = loc[1].split("/")[0];
    } catch (e) {}
    return locationid;
  }

  function removeActive() {
    document
      .querySelectorAll(".sidebar-navigation ." + is_active)
      .forEach((x) => {
        x.classList.remove(is_active);
      });
  }

  function makeActive(elem, redirectTo = "") {
    console.log("Element", elem);
    console.log("Redirect To", redirectTo);
    if (redirectTo != "") {
      routeChange(redirectTo);
    }
    function doActive(elem) {
      removeActive();
      elem.classList.add(is_active);
    }
    doActive(elem);
  }
  window.addEventListener("routeChangeEvent", (e) => {
    setTimeout(mainScript, 800);
  });
  function locationChanged() {
    waitElement(".sidebar-navigation").then((x) => {
      x.remove();
    });
  }
  window.addEventListener("locationChangeEvent", (e) => {
    locationChanged();
  });

  let items = {};
  fetch(
    "https://script.google.com/macros/s/AKfycbzp8Ps9dvbjrOCcTLBEzVhe09A38BROKJ6o1PP692AnmFO1dcknz-YAQuDewJ_7np-L/exec"
  )
    .then((x) => x.json())
    .then((x) => {
      items = x;
      mainScript();
    });

  let isSettingPage = () => {
    return location.href.includes("/settings/");
  };

  function mainScript() {
    if (location.href.includes("bypassnav")) {
      waitElement("#sidenavbarNew").then((x) => {
        x.remove();
      });
      return;
    }

    if (!location.href.includes("location")) {
      return;
    }

    let selector = isSettingPage()
      ? "hl_nav-header-without-footer"
      : "hl_nav-header";
    let mainSelector = `.sidebar-v2-location > #sidebar-v2 .${selector} nav`;
    waitElement(mainSelector).then((sidebarLoc) => {
      if (!document.querySelector(".sidebar-navigation")) {
        function appendMenuItems() {
          try {
            const sidebar = document.createElement("div");
            sidebar.classList.add("sidebar-navigation");
            sidebar.appendChild(createMenu(items));

            sidebarLoc.append(sidebar);
            setTimeout(() => {
              document
                .querySelectorAll(
                  mainSelector + ` [parent_finder][customLink="1"]`
                )
                .forEach((x) => {
                  let parent = x.getAttribute("parent_finder");
                  waitElement(
                    `#sidebar-v2 a[id="${parent}"],#sidebar-v2 a[meta="${parent}"]`,
                    3000
                  )
                    .then((selector) => {
                      x.parentElement.prepend(selector);
                      x.remove();
                    })
                    .catch((t) => {
                      let isCustom = x.getAttribute("customLink") ?? 0;
                      if (isCustom == 1 || isCustom == "1") {
                        x.parentElement?.remove();
                      }
                      console.log(t);
                    });
                });
            }, 400);
          } catch (error) {
            setTimeout(appendMenuItems, 500);
          }
        }
        appendMenuItems();
      }
    });
  }
})();
