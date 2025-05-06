(() => {
  // Add CSS for transitions and effects
  (() => {
    const style = document.createElement("style");
    style.id = "sidenavbarNew";
    style.textContent = `
  
          .sidebar-navigation {
            /* width: 256px;
             background-color: #fff;
             border-right: 1px solid #ccc;
             box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.16);
             height: 100vh; */
            overflow-y: auto;
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
          }
          .sidebar-navigation a:hover {
            background-color:#FF9500;
            color: #141414;
          }
          .sidebar-navigation a.active {
            background-color: #FF9500;
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
        
          #sidebar-v2 :is([class*="hl_nav-header"] nav > a:not(div.sidebar-navigation),#backButtonv2, .menu-title,[class*="hl_nav-header"] nav > .divider,.hl_new_badge) {
            display:none;
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
      a.textContent = item.title;
      let src = item.url || "#";
      a.setAttribute("data-href", src);
      a.id = "clone-" + item.id;
      a.className = `w-full group px-3 flex items-center
            justify-start md:justify-center lg:justify-start xl:justify-start text-sm rounded-md
            cursor-pointer custom-link font-medium opacity-70 hover:opacity-100 py-2 md:py-2`;

      a.setAttribute("parent_finder", item.id);

      if (src != "#" && src != "") {
        a.onclick = function (e) {
          e.preventDefault();
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
    console.log(url);
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
      .querySelectorAll(".hl_nav-header nav ." + is_active)
      .forEach((x) => {
        x.classList.remove(is_active);
      });
  }

  function makeActive(elem, redirectTo = "") {
    if (redirectTo != "") {
      routeChange(redirectTo);
    }

    function doActive(elem) {
      removeActive();
      elem.classList.add(is_active);
    }
    doActive(elem);
    setTimeout(doActive, 600, elem);
    setTimeout(doActive, 1500, elem);
  }

  const findAndAppendHiddenItems = () => {
    const hiddenItems = items.filter((item) => {
      const element = document.querySelector(item.id);
      return (
        element &&
        (element.style.display === "none" ||
          window.getComputedStyle(element).display === "none")
      );
    });

    hiddenItems.forEach((item) => {
      console.log(`Appending hidden item with ID: ${item.id}`);
      sidebarLoc.appendChild(createMenu([item]));
    });
  };

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

    waitElement(".hl_nav-settings").then((x) => {
      x.remove();
    });

    let selector = isSettingPage()
      ? "hl_nav-header-without-footer"
      : "hl_nav-header";
    let mainSelector = `#sidebar-v2 .${selector} nav`;
    waitElement(mainSelector).then((sidebarLoc) => {
      if (!document.querySelector(".sidebar-navigation")) {
        const sidebar = document.createElement("div");
        sidebar.classList.add("sidebar-navigation");
        sidebar.appendChild(createMenu(items));
        sidebarLoc.append(sidebar);

        setTimeout(() => {
          document
            .querySelectorAll(mainSelector + " [parent_finder]")
            .forEach((x) => {
              let parent = x.getAttribute("parent_finder");
              waitElement(`a[id="${parent}"],a[meta="${parent}"]`)
                .then((selector) => {
                  x.parentElement.prepend(selector);
                  x.remove();
                })
                .catch((t) => {});
            });
        }, 400);
      }
      // findAndAppendHiddenItems();
    });
  }
})();
