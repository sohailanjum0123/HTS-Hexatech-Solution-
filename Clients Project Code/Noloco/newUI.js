(() => {
  function mainScript() {
    const url = "https://gostarauto.com/api/inventory/";
    let inventoryPanel = document.querySelector(".inventory-panel");
    let locationId =
      inventoryPanel.getAttribute("data-locationId") ?? "geAOl3NEW1iIKIWheJcj";
    let setting = {
      inv_detail_path: "/inv_detail_path",
      inv_list_path: "/inventory-4195",
      detailPath: "nolocodetailpage.html",
      listPath: "nolocoinventry.html",
      dev: "funnel",
      inv_financed_path: "/financing-1280",
      inv_inquire_path: "",
    };
    let previewLink = "/v2/preview/";
    let isSandbox = false;
    let redPath = {
      local: {
        detailPath: "nolocodetailpage.html",
        listPath: "nolocoinventry.html",
      },
      funnel: {
        detailPath: previewLink + "g6JyvYUg99NF66aaYRao",
        listPath: previewLink + "rTa2zUCpzVEyzosWmvV1",
        inv_financed_path: previewLink + "e9IOetvVMhU6vORvOW9X",
        inv_inquire_path: "",
      },
    };
    let isLocal = setting.dev == "local";

    if (!isLocal) {
      isSandbox = location.href.includes(previewLink);
    }
    if (isSandbox) {
      setting.inv_detail_path = redPath.funnel.detailPath;
      setting.inv_list_path = redPath.funnel.listPath;
      setting.inv_financed_path = redPath.funnel.inv_financed_path;
    }

    function getPath(list = false, def = "") {
      isDev = setting.dev ?? false;
      path = list
        ? isDev
          ? setting.listPath
          : setting.inv_list_path
        : isDev
        ? setting.detailPath
        : setting.inv_detail_path;
      return path ?? def;
    }

    setting.dev = isLocal;

    let financeButton = `<span class="data-action" data-type="financed" data-action="${
      setting.inv_financed_path ?? ""
    }" >Get Approved</span>`;

    let baseActions = `${financeButton}<span  data-type="inquire"  data-action="${
      setting.inv_inquire_path ?? ""
    }" >Inquire</span>`;

    let lastInventoryKey = "lastInventory";
    let last_inv_id = "last_inv_id";
    let settingsKey = "inv_setting";
    let currentInventory = null;

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js",
      "jquery",
      () => {
        fetchSetting();

        let action = inventoryPanel.getAttribute("data-action");
        if (action == "detail") {
          detailPageInit();
        } else if (action == "list") {
          listPageInit();
        } else if (action == "slider") {
          inventorySlider();
        } else if (action == "finance") {
          financedIframe();
        }
      }
    );
    const params = new URLSearchParams(location.search);
    function financedIframe() {
      console.log("IframEmbedded");

      // Create the iframe element
      let frame = document.createElement("iframe");
      frame.id = "financedFrame";
      frame.setAttribute("style", "width:100%;height:800px");

      // Retrieve inventoryId from URL parameters
      let inventoryId = params.get("id") ?? "";
      frame.src = `https://app2.starautocrm.com/+/-Eb71UihF/wchAnCRHH?dealerIdVal=${locationId}&inventoryId=${inventoryId}`;

      // Wait for .IframEmbedded element to be available
      waitElement(".inventory-panel").then((iframeEmbed) => {
        if (iframeEmbed) {
          // Append the iframe to the .IframEmbedded element
          iframeEmbed.appendChild(frame);
        }
      });
    }
    function waitElement(selector) {
      return new Promise((resolve, reject) => {
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

    function toggleLoader(show) {
      const loader = document.getElementById("loader");
      loader.style.display = show ? "block" : "none";
    }

    function getCalculator(price) {
      return `<div  class="payment-calculator ">
                    <h3 style="margin-top: 75px;">Payment Calculator</h3>
                    <form >
                      <div class="form-group-attached">
                        <div class="form-group form-group-default">
                          <p>Vehicle Price</p>
                          <input class="form-control field" type="number" step="0.1" id="vehicle_price" data-v-min="0" value="${price}" placeholder="Vehicle Price" autocomplete="off">
                        </div>
                        <div class="row">
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Down Payment</p>
                              <input class="form-control field" type="number" id="down_payment" value="0" placeholder="Down Payment">
                            </div>
                          </div>
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Trade-In Value</p>
                              <input class="form-control field" type="number" id="trade_in" value="0" placeholder="Trade-In Value">
                            </div>
                          </div>
                        </div>
                        <div class="form-group form-group-default">
                          <p>Sales Tax Percentage</p>
                          <input class="form-control field" type="number" step="0.1" id="sales_tax" value="2.90" placeholder="Sales Tax Percentage">
                        </div>
                        <div class="row">
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Interest Rate</p>
                              <input class="form-control field" type="number" step="0.1"  id="interest_rate" value="2.88" placeholder="Interest Rate">
                            </div>
                          </div>
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Term</p>
                              <select class="form-control field" id="term" placeholder="Term">
                                                                  <option>12</option>
                                                                  <option>24</option>
                                                                  <option>36</option>
                                                                  <option>48</option>
                                                                  <option>60</option>
                                                                  <option>66</option>
                                                                  <option>72</option>
                                                                  <option>84</option>
                                                      </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group-attached m-t-10 finance-totals">
                        <div class="row">
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Amount Financed</p>
                              <input class="form-control " type="text" id="amount_financed" value="0" placeholder="Amount Financed" disabled="">
                            </div>
                          </div>
                          <div class="col-sm-6">
                            <div class="form-group form-group-default">
                              <p>Monthly Payment</p>
                              <input class="form-control " type="text" id="monthly_payment" value="0" placeholder="Monthly Payment" disabled="">
                            </div>
                          </div>
                        </div>
                      </div>
                      <p style="font-size: 12px; margin-top: 15px;">This calculation is only an estimate and is not an accurate representation of the actual monthly payment. Interest rate and term are subject to credit approval. It may include other taxes, fees, regulatory charges, etc.</p>
                    </form>

                    <div class="actions-btns actions text-center" >
                      ${financeButton}
                    </div>
                  </div>`;
    }

    function loadScript(src, id, callback) {
      let sc = document.createElement("script");
      sc.id = id;
      sc.src = src;
      sc.onload = function () {
        if (typeof callback == "function") {
          callback(arguments);
        }
      };

      if (!document.querySelector("#" + id)) {
        document.body.appendChild(sc);
      } else {
        if (typeof callback == "function") {
          callback(arguments);
        }
      }
    }

    function imagesCreator(images) {
      try {
        if (!Array.isArray(images)) {
          images = images.split(",");
        }

        // Get the first image
        const featuredImage = images[0];

        // Return the HTML for only the first image
        return `
    <a data-fslightbox="gallery" href="${featuredImage}">
      <img src="${featuredImage}" class="img-responsive img-fluid"/>
    </a>`;
      } catch (error) {
        console.error(error);
      }
    }
    function getGalleryImages(photos) {
      return `<div class="gallery-top">
      <div class="images">
       ${imagesCreator(photos)}
      </div>
     </div>`;
    }

    function detailPageInit() {
      function gotoListPage() {
        location.href = getPath(true, "/");
      }
      function getVinContainer(vin) {
        vin = vin.trim();
        return `<div class="vin-container" ${vin == "" ? "hidden" : ""}> ${
          vin == "" ? "not_found" : vin
        }</div>`;
      }

      function displayDetail(item, ignoreCache = false) {
        if (Object.keys(item).length > 0) {
          const generateVehicleOptions = () => {
            if (!item.vehicleOptions) return "";

            // Split options into two columns
            const options = item.vehicleOptions
              .split("\n")
              .filter((opt) => opt.trim() !== "");
            const half = Math.ceil(options.length / 2);
            const leftCol = options.slice(0, half);
            const rightCol = options.slice(half);

            return `
            <div aria-label="Vehicle options left column" class="specs-left">
                <h4>Vehicle Options</h4>
                ${leftCol.map((opt) => `<div>${opt}</div>`).join("")}
            </div>
            <div aria-label="Vehicle options center column" class="specs-center">
                ${rightCol.map((opt) => `<div>${opt}</div>`).join("")}
            </div>
        `;
          };

          // Generate similar vehicles HTML dynamically
          const generateSimilarVehicles = () => {
            if (!item.similarVehicles || !item.similarVehicles.length)
              return "";
            return `
            <div aria-label="Similar vehicles" class="similar-vehicles">
                <h4>Similar Vehicles</h4>
                ${item.similarVehicles
                  .map(
                    (vehicle) => `
                    <div class="vehicle">
                        <img
                            alt="${vehicle.year} ${vehicle.make} ${
                      vehicle.model
                    } ${vehicle.color} car front 3-4 view"
                            height="100"
                            src="${
                              vehicle.imageUrl ||
                              "https://via.placeholder.com/180x100?text=No+Image"
                            }"
                            width="180"
                        />
                        <div class="caption">${vehicle.year} ${vehicle.make} ${
                      vehicle.model
                    }</div>
                        <div class="price">${
                          vehicle.price ? `$${vehicle.price}` : "Call for price"
                        }</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
          };

          currentInventory = item;
          console;

          inventoryPanel.innerHTML = ` <div class="Wrapper">
      <main>
        <h1>${
          item.name ?? ""
        } -  <span  style="font-weight: bold; font-size: 1.5rem" }>${
            item?.listedPrice ? `$${item.listedPrice}` : ""
          }</span></h1>
        <h2>${item.transmission}</h2>
        <div class="container">
          <div class="top-section">
            <div class="image-box">
              <div class="social-bar">
                <a href="#" aria-label="Facebook"
                  ><i class="fab fa-facebook-f"></i
                ></a>
                <a href="#" aria-label="Twitter"
                  ><i class="fab fa-twitter"></i
                ></a>
                <a href="#" aria-label="Pinterest"
                  ><i class="fab fa-pinterest"></i
                ></a>
              </div>
              <div aria-label="Car image and badges" class="car-image-section">
                <img
                  alt="Silver 2016 Acura RDX SUV front 3-4 view in showroom with Premium Motors logo and phone number on top corners"
                  height="350"
                  src="${
                    item.photosUrls
                      ? item.photosUrls[0]
                      : "https://cdn.dealrimages.com/UR%2FR5%2F2H%2F2283TQVGC0VGWU.jpg?h=800"
                  }"
                  width="600"
                />
                <div class="tag-bar">
                  <div class="tag">Digital Contracting</div>
                  <div class="tag">Video Walkarounds</div>
                  <div class="tag">Shipping Nationwide</div>
                </div>
                <div class="divider"></div>
                <div class="buttons-row">
                  <button type="button">View Photos</button>
                  <button type="button">Get Financed</button>
                  <button type="button">Calculate Payment</button>
                </div>
              </div>
            </div>
            <iframe src="https://api.leadconnectorhq.com/widget/form/mLHgAuuusc1fuY8smxcz?notrack=true" frameborder="0"></iframe>
          </div>
          <div class="details-section">
            <div class="detail-column">
                <div class="detail"><strong>Stock #:</strong> ${
                  item.stock ?? "N/A"
                }</div>
                <div class="detail"><strong>VIN:</strong> ${
                  item.vin ?? "N/A"
                }</div>
                <div class="detail"><strong>Mileage:</strong> ${
                  item.miles ? item.miles + " mi" : "N/A"
                }</div>
            </div>
            <div class="detail-column">
                <div class="detail">
                    <strong><i class="fas fa-bolt"></i> Engine:</strong> ${
                      item.engineSize ?? "N/A"
                    }L ${item.engineCylinders ?? "N/A"}cyl
                </div>
                <div class="detail">
                    <strong><i class="fas fa-cogs"></i> Transmission:</strong> ${
                      item.transmission ?? "N/A"
                    }
                </div>
                <div class="detail">
                    <strong><i class="fas fa-gas-pump"></i> Fuel Type:</strong> ${
                      item.fuelType ?? "N/A"
                    }
                </div>
            </div>
            <div class="detail-column">
                <div class="detail">
                    <strong><i class="fas fa-shapes"></i> Body Type:</strong> ${
                      item.bodyType ?? "N/A"
                    }
                </div>
                <div class="detail">
                    <strong><i class="fas fa-fill-drip"></i> Exterior Color:</strong> ${
                      item.exteriorColor ?? "N/A"
                    }
                </div>
                <div class="detail">
                    <strong><i class="fas fa-couch"></i> Interior Color:</strong> ${
                      item.interiorColor ?? "N/A"
                    }
                </div>
            </div>
            <div class="mpg-box">
                <h4>Fuel Economy</h4>
                <div class="mpg-inner">
                    <div>
                        <div class="mpg-label">CITY</div>
                        <div class="mpg-value">20</div>
                    </div>
                    <div class="mpg-icon">
                        <i class="fas fa-gas-pump"></i>
                    </div>
                    <div>
                        <div class="mpg-label">HWY</div>
                        <div class="mpg-value">28</div>
                    </div>
                </div>
            </div>
        </div>
          <div aria-label="Vehicle description" class="description">
            <h4>Vehicle Description</h4>
            <p>${truncateDescription(
              item.description ?? "",
              (maxLength = 80)
            ).trim()}</p>
          </div>
          <div
            aria-label="Vehicle options and similar vehicles"
            class="bottom-section"
          >
          ${generateVehicleOptions()}
          ${generateSimilarVehicles()}
          </div>
        </div>
      </main>
      <section aria-label="Visit our Dealership" class="dealership-section">
        <h3>Visit our Dealership!!</h3>
        <div class="dealership-content">
          <div aria-label="Map location of dealership" class="map-container">
            <img
              alt="Map showing location of 14778 E Broad St, Reynoldsburg, OH 43068, USA with nearby streets and landmarks"
              height="280"
              src="https://storage.googleapis.com/a1aa/image/8be007c6-e872-494d-105c-d2dd66d89a21.jpg"
              width="600"
            />
          </div>
          <div aria-label="Dealership contact information" class="contact-info">
            <p>Call Us</p>
            <strong> Premium Motors LLC </strong>
            <p>Ema</p>
            <p>2ND COLUMN</p>
            <p>Ca</p>
            <p>2ND COLUMN</p>
            <p>Call Us</p>
            <p>844-579-4845</p>
            <p>Il Us</p>
            <p>844-579-4845</p>
            <p>Il Us</p>
            <strong> dealer-premium-motors@leads.dearicloud.com </strong>
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
          </div>
        </div>
      </section>
    </div>
     
     `;

          // Add any additional event listeners or functionality here
          setTimeout(function () {
            document
              .querySelectorAll(".buttons-row button")
              .forEach((button) => {
                button.addEventListener("click", function () {
                  if (this.textContent === "View Photos") {
                    // Handle photo viewing
                  } else if (this.textContent === "Get Financed") {
                    // Handle financing
                  } else if (this.textContent === "Calculate Payment") {
                    // Handle payment calculation
                  }
                });
              });
          });

          calculateData();

          loadGlobe3d();
        } else {
          if (!ignoreCache) {
            gotoListPage();
          }
        }
      }
      function loadGlobe3d() {
        loadScript("https://us-central1-glo3d-c338b.cloudfunctions.net/script");
      }

      waitElement(".detail .params").then((VinStock) => {
        if (VinStock) {
          ThreeDModel();
        }
        ThreeDModel();
      });

      function calculateData() {
        let parent = document.querySelector(".payment-calculator");
        let t = {};
        document
          .querySelectorAll(".payment-calculator .field")
          .forEach((xt) => {
            let value = xt.value == "" ? 0 : xt.value;
            value = value.includes(".") ? parseFloat(value) : parseInt(value);
            t[xt.id] = value;
          });
        if (t?.term == "0") {
          t.term = 66;
          parent.querySelector("#term").value = 66;
        }

        t.financed_amount =
          ((t.vehicle_price - t.trade_in) * t.sales_tax) / 100 +
          t.vehicle_price -
          t.down_payment -
          t.trade_in;
        var a = (0.01 * parseFloat(t.interest_rate)) / 12,
          e = parseInt(t.term);
        (t.financed_amount += t.financed_amount * (a / (365 / 12)) * 0),
          (e =
            0 < a
              ? (function (e, a) {
                  a = Math.pow(10, a);
                  return Math.round(e * a) / a;
                })(
                  (t.financed_amount * (a * Math.pow(1 + a, e))) /
                    (Math.pow(1 + a, e) - 1),
                  2
                )
              : t.financed_amount / e),
          (t.monthly_payment = e),
          (parent.querySelector("[id='amount_financed']").value =
            t.financed_amount),
          (parent.querySelector("[id='monthly_payment']").value =
            t.monthly_payment);
      }

      let uuid = params.get("id") ?? "";
      if (uuid == "") {
        gotoListPage();
        return;
      }

      inventoryPanel.innerHTML = getLoader(true, "150px", "150px");

      let lastInventoryId = localStorage.getItem(last_inv_id);
      if (lastInventoryId == uuid) {
        let lastInv = localStorage.getItem(lastInventoryKey) ?? "{}";
        displayDetail(JSON.parse(lastInv), true);
      }
      (async () => {
        const response = await fetch(
          `${url}get/${uuid}?locationId=${locationId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let item = (data?.data?.inventoryCollection?.edges ?? [])[0] ?? {};
        displayDetail(item.node ?? {});
      })();
    }
    function truncateDescription(description, maxLength) {
      return description.length > maxLength
        ? description.slice(0, maxLength) + "..."
        : description;
    }

    function handleScripts(settings = {}, scriptData = []) {
      setting = { ...settings, ...setting };
      scriptData.forEach((t) => {
        try {
          let exec = t.executer.split(",");

          if (exec.includes(location.pathname)) {
          }
        } catch (error) {}
      });
    }

    function fetchSetting() {
      let scripts = "scripts";
      let settingData = localStorage.getItem(settingsKey) ?? "{}";
      let scriptData = localStorage.getItem(settingsKey + scripts) ?? "[]";
      handleScripts(JSON.parse(settingData), JSON.parse(scriptData));
      fetch(`${url}settings`)
        .then((t) => t.json())
        .then((x) => {
          localStorage.setItem(settingsKey, JSON.stringify(x.settings));
          scriptData = x.scripts ?? [];
          localStorage.setItem(
            settingsKey + scripts,
            JSON.stringify(scriptData)
          );
          handleScripts(x.settings ?? {}, scriptData);
        });
    }

    function getLoader(isDisp = false, width = "100px", height = "100px") {
      return `<div class="loader" id="loader" style="width:${width};height:${height} display: ${
        isDisp ? "" : "none"
      };">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="black" stroke-width="15" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>
        </div>`;
    }

    function viewPhotos(photos) {
      let path = document.querySelector(".photosGallery");
      path.innerHTML = `${getGalleryImages(photos)}`;

      if (photos != "") {
        refreshFsLightbox();
        fsLightbox.open();
      }
    }
    let allInventory = {};
    function listPageInit() {
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/fslightbox/3.0.9/index.js",
        "jsBoxSc",
        function () {}
      );
      inventoryPanel.insertAdjacentHTML(
        "beforeEnd",
        `
  <div class="photosGallery" hidden> 
  </div>
  <div class="inventryList sidebar">
        <div class="filters filters-container" id="filters-container"></div>
    </div>
    
    <div class="main-container">
        <div id="inventory-container" class="inventory-container">

         </div>
                  ${getLoader()}
        <button id="load-more" class="load-more" style="display:none">Load More</button>
                 
    </div>
    `
      );

      waitElement(".sidebar").then((t) => {
        const sidebar = document.querySelector(".sidebar");
        const toggleButton = document.createElement("div");
        toggleButton.setAttribute("id", "sidebar-toggle");
        toggleButton.textContent = "Filters";
        toggleButton.classList.add("sidebar-toggle");

        sidebar.insertAdjacentElement("beforebegin", toggleButton);

        toggleButton.addEventListener("click", () => {
          sidebar.classList.toggle("active");
        });
      });
      function sidebar() {
        let fil = `
                      <div class="search-wrapper filter-group filter-item">
                          <input type="text" placeholder="Search inventory..." id="name" condition="contains">
                          <i class="fas fa-search"></i>
                      </div>

                      <div class="filter-group filter-item">
                          <select id="make" class="">
                              <option disabled="" selected="">Make</option>
                          </select>
                      </div>
                      <div class="filter-group filter-item">
                          <select>
                              <option disabled="" selected="">Color</option>
                          </select>
                      </div>
                      <div class="filter-group filter-item">
                          <select>
                              <option disabled="" selected="">Body Style</option>
                          </select>
                      </div>
                      <div class="filter-group filter-item">
                          <select>
                              <option disabled="" selected="">Price</option>
                          </select>
                      </div>
                      <div class="filter-group filter-item">
                          <select>
                              <option disabled="" selected="">Milage</option>
                          </select>
                      </div>
                      <button class="refineBtn">Filter</button>
                  `;

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = fil;

        const filtersContainer = document.getElementById("filters-container");
        filtersContainer.append(...tempDiv.childNodes);

        // let filtersList = [
        //   {
        //     text: "Title",
        //     placeholder: "Auto ...",
        //     id: "name",
        //     check: "contains",
        //   },
        //   {
        //     text: "Make",
        //     placeholder: "Enter Make (e.g. Nissan, Honda)",
        //     id: "make",
        //   },
        // ];

        // filtersList.forEach((x) => {
        //   const makeGroup = document.createElement("div");
        //   makeGroup.className = "filter-group filter-item";
        //   const makeLabel = document.createElement("label");
        //   makeLabel.textContent = x.text;
        //   const makeInput = document.createElement("input");
        //   makeInput.type = "text";
        //   makeInput.id = x.id;
        //   if (x.check) {
        //     makeInput.setAttribute("condition", x.check);
        //   }
        //   makeInput.placeholder = x.placeholder;
        //   makeGroup.appendChild(makeLabel);
        //   makeGroup.appendChild(makeInput);
        //   filtersContainer.appendChild(makeGroup);
        // });

        // const priceGroup = document.createElement("div");
        // priceGroup.className = "filter-group";
        // const priceLabel = document.createElement("label");
        // priceLabel.textContent = "Price Range";
        // const priceRangeDiv = document.createElement("div");
        // priceRangeDiv.className = "price-range-group";
        // const minPriceInput = document.createElement("input");
        // minPriceInput.type = "number";
        // minPriceInput.id = "min-price";
        // minPriceInput.placeholder = "Min Price";
        // const maxPriceInput = document.createElement("input");
        // maxPriceInput.type = "number";
        // maxPriceInput.id = "max-price";
        // maxPriceInput.placeholder = "Max Price";
        // priceRangeDiv.appendChild(minPriceInput);
        // priceRangeDiv.appendChild(maxPriceInput);
        // priceGroup.appendChild(priceLabel);
        // priceGroup.appendChild(priceRangeDiv);
        // filtersContainer.appendChild(priceGroup);

        // const refineButton = document.createElement("button");
        // refineButton.setAttribute("class", "refineBtn");
        // refineButton.textContent = "Filter";

        // refineButton.onclick = async function () {
        //   const filters = collectFilters(filtersList);
        //   const sorting = getSortingFilter();

        //   try {
        //     const hidesidebar = document.querySelector(
        //       ".inventryList.sidebar.active"
        //     );
        //     if (hidesidebar) {
        //       hidesidebar.classList.remove("active");
        //     }
        //   } catch (error) {
        //     console.error("Error occurred while removing class:", error);
        //   }

        //   currentIndex = 0;
        //   inventoryData = [];
        //   fetchInventory("", filters, sorting);
        // };

        // filtersContainer.appendChild(refineButton);
      }

      const listTop = document.querySelector(".listTop .listTopRight");
      const sortingGroup = createSortingDropdown();
      listTop.appendChild(sortingGroup);

      // General function to create sorting dropdown
      function createSortingDropdown() {
        const sortingGroup = document.createElement("div");
        sortingGroup.className = "filter-group";
        const sortingLabel = document.createElement("label");
        sortingLabel.textContent = "Sort By";
        const sortingSelect = document.createElement("select");
        sortingSelect.id = "sorting";

        const sortingOptions = [
          { text: "Sort by Make A-Z", value: "name-asc" },
          { text: "Sort by Make Z-A", value: "name-desc" },
          { text: "Year: Newest to Oldest", value: "year-asc" },
          { text: "Year: Oldest to Newest", value: "year-desc" },
        ];

        sortingOptions.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt.value;
          option.textContent = opt.text;
          sortingSelect.appendChild(option);
        });

        sortingGroup.appendChild(sortingLabel);
        sortingGroup.appendChild(sortingSelect);
        return sortingGroup;
      }

      // General function to collect filter values
      function collectFilters(filtersList) {
        const filters = {};

        filtersList.forEach((filter) => {
          const value = document.getElementById(filter.id).value.trim();
          if (value) {
            filters[filter.id] = {
              column: filter.id,
              value,
              order: filter.check || "equals",
            };
          }
        });

        const minPrice = document.getElementById("min-price").value.trim();
        const maxPrice = document.getElementById("max-price").value.trim();

        if (minPrice || maxPrice) {
          filters["price"] = [];
          const minPriceValue = parseFloat(minPrice);
          const maxPriceValue = parseFloat(maxPrice);

          if (maxPriceValue && minPriceValue && maxPriceValue < minPriceValue) {
            alert("Max price must be greater than or equal to Min price");
            return filters;
          }

          if (minPrice && minPriceValue >= 0) {
            filters["price"].push({
              column: "listedPrice",
              value: minPriceValue,
              order: "gte",
            });
          }

          if (maxPrice && maxPriceValue >= 0) {
            filters["price"].push({
              column: "listedPrice",
              value: maxPriceValue,
              order: "lte",
            });
          }

          if (
            (minPrice && minPriceValue < 0) ||
            (maxPrice && maxPriceValue < 0)
          ) {
            alert("Please enter positive values for price fields");
          }
        }

        return filters;
      }

      // General function to get sorting filter
      function getSortingFilter() {
        const sortingValue = document.getElementById("sorting").value;
        if (sortingValue) {
          const [column, direction] = sortingValue.split("-");
          return {
            column,
            direction: direction.toUpperCase(),
          };
        }
        return null;
      }

      let inventoryData = [];

      let filters = {};

      let afterCursor = null;
      let hasNextPage = false;

      itemsPerPage = 10;
      function handleInventoryData(
        data,
        newData = false,
        lastCursor = "",

        hasCache = false
      ) {
        let inventoryCollection = data?.data?.inventoryCollection ?? null;
        inventoryData = (inventoryCollection?.edges ?? []).map(
          (edge) => edge.node
        );
        afterCursor = inventoryCollection?.pageInfo?.endCursor ?? null;
        hasNextPage = inventoryCollection?.pageInfo?.hasNextPage ?? null;
        setTimeout(function () {
          toggleLoader(false);
        }, 800);

        if (afterCursor && !hasCache) {
          let items = localStorage.getItem(itemKey + afterCursor) ?? "";
          if (items == "" && lastCursor == "") {
            for (let [k, v] of Object.entries(localStorage)) {
              if (k.includes(itemKey)) {
                localStorage.removeItem(k);
              }
            }
          }
          localStorage.setItem(itemKey + lastCursor, JSON.stringify(data));
        }
        appendItemsToContainer(newData);
      }

      let itemKey = "inv-items_";

      function IsresponseOK(response, data) {
        dispLoadMore(false);
        function errorIcon() {
          return (erroIconHtml = container.innerHTML =
            `
      <div class="data-not-found">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="100px" width="100px" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM18.38 16.62l-1.77 1.77L12 13.77l-4.62 4.62-1.77-1.77L10.23 12 5.62 7.38l1.77-1.77L12 10.23l4.62-4.62 1.77 1.77L13.77 12l4.61 4.62z"/>
        </svg>
      </div>`);
        }

        // Check if response is not OK
        if (response && !response.ok) {
          errorIcon();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (data) {
          const inventoryCollection = data?.data?.inventoryCollection ?? null;
          const inventoryData = inventoryCollection?.edges ?? [];
          if (inventoryData.length === 0) {
            errorIcon();
            return false;
          }
        }
        return true;
      }

      async function fetchInventory(
        afterCursor = "",
        filters = {},
        sorting = {}
      ) {
        try {
          toggleLoader(true);

          const localStorageKey = itemKey + afterCursor;
          let items = localStorage.getItem(localStorageKey);
          let parsedItems = items ? JSON.parse(items) : "";

          const isNewRequest = afterCursor === "";
          const hasFilters = Object.keys(filters).length > 0;

          if (parsedItems && !hasFilters) {
            handleInventoryData(parsedItems, isNewRequest, afterCursor, true);
          }

          const options = {
            method: "POST",
            body: JSON.stringify({
              limit: itemsPerPage,
              after: afterCursor,
              filters: filters,
              sorting: sorting,
              locationId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (parsedItems == "" || hasFilters) {
            const response = await fetch(`${url}list`, options);

            if (response.ok) {
              const data = await response.json();

              IsresponseOK(response, "");
              const isValid = IsresponseOK(response, data);
              if (!isValid) {
                return;
              }

              handleInventoryData(
                data,
                isNewRequest,
                afterCursor,
                hasFilters,
                false
              );
            } else {
              IsresponseOK(response, null);
            }
          }
        } catch (error) {
          console.error("Error fetching inventory:", error);
        } finally {
          toggleLoader(false);
        }
      }

      const container = document.getElementById("inventory-container");
      const loadMoreBtn = document.getElementById("load-more");
      loadMoreBtn.onclick = function () {
        dispLoadMore(false);
        if (hasNextPage) {
          fetchInventory(afterCursor, filters);
        }
      };

      function dispLoadMore(show) {
        loadMoreBtn.style.display = show ? "block" : "none";
      }

      let inventoryItemKey = "inventory-item";

      function appendItemsToContainer(isNew = false) {
        if (isNew) {
          container.innerHTML = ``;
        }
        let allInventoryHTML = "";
        let dncSrc = "data-src";
        let defPhoto = "https://placehold.co/400";
        inventoryData.forEach((item) => {
          let mainid = item.uuid ?? ""; //item.id;
          allInventory[mainid] = item;
          if (item.name) {
            let photo = defPhoto;
            try {
              photo = (
                item?.featuredPhoto?.url ??
                item?.photosUrls ??
                ""
              ).split(",");
              // if (Array.isArray(photo)) {
              //   photo = photo[0];
              // }
            } catch (error) {}
            let itemHTML = `
                <div class="inventoryCard">
                <div class="cardHeader">
                <div class="${inventoryItemKey}" data-id="${mainid}">
                <div class="featuredImage">
                <img class="lazy" ${dncSrc}="${photo}" alt="${item.make ?? ""}">
      </div>
                <div class="inventory-details">
                <div class="inventoryDetailTop">
                    <h3>${item.year ?? ""} ${item.make ?? ""} ${
              item.model ?? ""
            }</h3>
             <div class="right-side">
                    <p class="price"><span  style="font-weight: bold; font-size: 1.5rem" }>${
                      item?.listedPrice ? `$${item.listedPrice}` : "$6578"
                    }</span></p>
                   
                </div>
                </div>
                    <h5>${truncateDescription(
                      item.description ?? "",
                      (maxLength = 50)
                    ).trim()}</h5>
                 
                    <div class="specs">`;
            if (!checkIsEmpty(item.miles ?? "")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/483/483497.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Miles:</span><span> ${item.miles}</span></div>`;
            }

            if (!checkIsEmpty(item.stock ?? "")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/9131/9131563.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Stock: </span><span> ${item.stock}</span></div>`;
            }

            if (!checkIsEmpty(item.drivetrain ?? "")) {
              itemHTML += ` <div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/62/62512.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Drivetrain:</span><span> ${item.drivetrain}</span></div>`;
            }
            if (!checkIsEmpty(item.exteriorColor ?? "Black")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/7180/7180272.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Exterior Color:</span><span> ${item.exteriorColor}</span></div>`;
            }
            if (!checkIsEmpty(item.interiorColor ?? "gray")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/494/494967.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Interior Color:</span><span> ${item.interiorColor}</span></div>`;
            }
            if (!checkIsEmpty(item.interiorMaterial ?? "Leather")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/8944/8944308.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Materials:</span><span> ${item.interiorColor}</span></div>`;
            }
            if (!checkIsEmpty(item.engineCylinders ?? "")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/483/483497.png " width="15" height="15" alt="" title="" class="img-small"><span class="badgeHeading">Engine:</span><span> ${
                item.engineCylinders ?? ""
              } cyl-${item.engineSize ?? ""} </span></div>`;
            }
            if (!checkIsEmpty(item.transmission ?? "")) {
              itemHTML += `<div class="specs-badge"><img src="   https://cdn-icons-png.flaticon.com/512/5444/5444942.png " width="256" height="256" alt="" title="" class="img-small"><span class="badgeHeading">Transmission:</span><span> ${item.transmission}</span></div>`;
            }

            itemHTML += `</div>
                </div>
                </div>
                </div>
                <div class="cardFooter">
             
                 <div class="actions-btns actions">
                        <span class="veiw_detail" data-id="${mainid}" data-action="open" >View Details</span>
                        <span class="data-action" data-type="financed" data-id="${mainid}"  data-action="${
              setting.inv_financed_path ?? ""
            }" >Get Approved</span>
            <span  data-type="inquire"  data-id="${mainid}" data-typ="inq" data-action="${
              setting.inv_inquire_path ?? ""
            }" >Inquire</span>
                    </div>
                     <div class="cardFooterRight">
                        <div data-action="" class="carafax_badge">carafex</div>
                        <img src="https://static1.cargurus.com/gfx/api/badges/dealrating/en_US/style1/good.svg" alt="Cargurus">
                    </div>
                    </div>
                   
               
                </div>
                `;

            allInventoryHTML += itemHTML;
            setTimeout(function () {
              document
                .querySelectorAll(`.veiw_detail:not(.trigger)`)
                .forEach((x) => {
                  x.classList.add("trigger");
                  x.onclick = openInventory;
                });
            }, 500);
          }
        });
        container.innerHTML += allInventoryHTML;
        document.querySelectorAll(`img.lazy[${dncSrc}]`).forEach((x) => {
          x.setAttribute("src", x.getAttribute(dncSrc));
          x.onerror = function () {
            this.onerror = null;
            this.src = defPhoto;
          };
          x.removeAttribute(dncSrc);
        });
        dispLoadMore(hasNextPage);
      }

      function openInventory(event) {
        event.preventDefault();
        let target = event.srcElement;
        if (target) {
          let inventory = target.closest(".veiw_detail");
          let id = inventory.getAttribute("data-id");
          localStorage.setItem(last_inv_id, id);
          let item = allInventory[id] ?? null;
          localStorage.setItem(lastInventoryKey, JSON.stringify(item));
          let action = target.getAttribute("data-action") ?? "open";
          if (action == "open") {
            if (item) {
              location.href = idAppend(getPath(false), `id=${id}`);
              console.log("OPENLocation", location.href);
            }
          } else if (action == "photo") {
            viewPhotos(item.photosUrls ?? "");
          } else {
            handleFinanced(item, action);
          }
        }
      }
      sidebar();
      toggleLoader();
      fetchInventory();
    }

    function handleActions(event1) {
      let event = event1.srcElement;
      let action = event.getAttribute("data-action") ?? "-";
      let loc = event.getAttribute("data-id") ?? "-";
      let typ = event.getAttribute("data-typ") ?? "inf";
      let item = currentInventory ?? allInventory[loc] ?? null;

      if (action == "open") {
        openInventory(event);
      } else {
        handleFinanced(item, action);
      }
    }

    function openHLPopup() {
      var event = new Event("customWidgetOpenPopup");
      window.dispatchEvent(event);
    }

    function findValue(obj, map) {
      function valueFixer(obj, map) {
        map = map.replaceAll("{", "");
        map = map.replaceAll("}", "");
        let path = map.split(".");
        path.forEach((key) => {
          if (key != "") {
            obj = obj[key] ?? {};
          }
        });
        obj = typeof obj == "object" || typeof obj == "undefined" ? "" : obj;
        obj = ["null", null, undefined, "undefined"].includes(obj) ? "" : obj;
        return obj;
      }
      const matches = map.match(/\{\{\s*[\w.]+\s*\}\}/g);

      if (matches) {
        matches.forEach((t) => {
          map = map.replaceAll(t, valueFixer(obj, t));
        });
        obj = map;
      } else {
        obj = valueFixer(obj, map);
      }
      return obj;
    }

    function idAppend(uri, id = "", post = "") {
      uri = uri + (uri.includes("?") ? "&" : "?");
      return `${uri}${id}${post == "" ? "" : "&" + post}`;
    }

    function handleFinanced(item, action, openInIframe = true) {
      let title = "";
      let keyMap = setting.inv_key_mapping ?? "";
      if (keyMap != "") {
        title = findValue(item, keyMap);
      } else {
        title = item.name ?? "";
      }
      console.log("ITem", item, "Title", title, "KeyMap", keyMap);
      if (action == "") {
        try {
          let key = setting.inv_key_info ?? "";
          if (key != "") {
            openHLPopup();
            waitElement(key).then((t) => {
              document.querySelectorAll(key).forEach((x) => {
                x.value = title;
                x.dispatchEvent(new Event("input"));
              });
            });
          }
        } catch (error) {
          console.log("ERROR" + error);
        }
      } else {
        if (!action.includes("http")) {
          if (!action.startsWith("/")) {
            action += "/";
          }
        }
        let key = setting.inv_key_info ?? "";

        const url = idAppend(action, "id=" + (item.id ?? ""));
        if (openInIframe) {
          openUrlInIframe(url);
        } else {
          location.href = url;
        }
      }
    }

    function openUrlInIframe(url) {
      // Check if iframe container already exists
      let iframeContainer = document.getElementById("iframe-container");

      // If it doesn't exist, create it
      if (!iframeContainer) {
        iframeContainer = document.createElement("div");
        iframeContainer.id = "iframe-container";
        iframeContainer.style.position = "fixed";
        iframeContainer.style.top = "0";
        iframeContainer.style.left = "0";
        iframeContainer.style.width = "100vw";
        iframeContainer.style.height = "100vh";
        iframeContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        iframeContainer.style.zIndex = "10000";

        iframeContainer.innerHTML = `
      <div style="position: relative; width: 90%; height: 90%; margin: 5% auto; background: white; border-radius: 8px; overflow: hidden;">
        <button onclick="document.getElementById('iframe-container').remove()" 
                style="position: absolute; top: 10px; right: 10px; z-index: 10; background: red; color: white; border: none; padding: 6px 12px; cursor: pointer;">
          Close
        </button>
        <iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>
      </div>
    `;

        document.body.appendChild(iframeContainer);
      } else {
        // If it exists, just update the iframe URL
        iframeContainer.querySelector("iframe").src = url;
      }
    }

    waitElement(".actions-btns")
      .then((p) => {
        p.onclick = handleActions;
      })
      .catch((error) => {
        console.log(error);
      });

    function checkIsEmpty(val) {
      try {
        val = val.trim();
      } catch (error) {}
      return ["", null, "null", "undefined", undefined].includes(val);
    }

    function inventorySlider() {
      function loadCSS(url) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }

      function loadScript(url, callback) {
        const script = document.createElement("script");
        script.src = url;
        script.onload = callback;
        document.body.appendChild(script);
      }

      loadCSS(
        "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css"
      );
      loadCSS(
        "https://www.jquerycarouselimagevideo.com/css/multimedia_perspective_carousel.css"
      );
      loadCSS("https://www.jquerycarouselimagevideo.com/css/prettyPhoto.css");

      loadScript(
        "https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js",
        function () {
          loadScript(
            "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js",
            function () {
              loadScript(
                "https://www.jquerycarouselimagevideo.com/js/jquery.ui.touch-punch.min.js",
                function () {
                  loadScript(
                    "https://www.jquerycarouselimagevideo.com/js/multimedia_perspective_carousel.js",
                    function () {
                      loadScript(
                        "https://www.jquerycarouselimagevideo.com/js/jquery.prettyPhoto.js",
                        function () {
                          initializeCarousel();
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );

      function initializeCarousel() {
        jQuery(document).ready(function () {
          const carouselList = $(".multimedia_perspective_carousel_list");
          async function fetchAndPopulate() {
            try {
              const response = await fetch(`${url}list`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  limit: 10,
                  locationId: locationId,
                }),
              });

              if (response.ok) {
                const data = await response.json();
                console.log("SLIDER RESPONSE:", data);
                let item = data?.data?.inventoryCollection?.edges ?? [];
                populateCarousel(item);
              } else {
                throw new Error("API response not OK");
              }
            } catch (error) {
              console.error("Error fetching vehicle data:", error);
            }
          }
          function populateCarousel(vehicles) {
            carouselList.empty();
            vehicles.forEach((vehicle) => {
              const naming = document.querySelector(".elementTitle .newFS");
              if (naming) {
                naming.textContent = `${vehicle?.node?.name ?? ""}`;
              }
              const listItem = `
                      <li class="sliderContainer" data-title="${
                        vehicle.title
                      }" data-link="${vehicle.link}">
                   <div class="container">
      <div class="image-container">
<img src="${vehicle?.node?.photosUrls ?? ""}"  alt="">

      </div>
      <div class="info">
      <div class="leftinfo">
          <h2>${truncateDescription(
            vehicle?.node?.name ?? "",
            (maxLength = 20)
          ).trim()}</h2>
          <p>${vehicle?.node?.miles ?? ""} mi &bull; ${
                vehicle?.node?.listedPrice ?? ""
              }</p>
          </div>
          <div class="rightInfo">
             <a href="#" class="shop-btn" data-action="list">Shop Now</a>
          </div>
      </div>
  </div>

                      </li>`;
              carouselList.append(listItem);
            });

            $(
              "#multimedia_perspective_carousel_black"
            ).multimedia_perspective_carousel({
              width100Proc: true,
              responsive: true,
              width: 1920,
              height: 500,
              imageWidth: 700,
              imageHeight: 500,
              autoPlay: 55,
              autoHideBottomNav: false,
              showElementTitle: true,
              titleColor: "#FFFFFF",
              elementsHorizontalSpacing: 140,
              verticalAdjustment: 0,
              numberOfVisibleItems: 9,
              nextPrevMarginTop: 40,
              bottomNavMarginBottom: -9999,
            });
          }
          fetchAndPopulate();
        });
      }
    }

    waitElement(
      "div.sliderSection .inner > div > .inner > div > .vertical.inner"
    ).then((t) => {
      console.log("Slider", t);
      if (t) {
        inventorySlider();
      }
    });
  }
  document.addEventListener("hydrationDone", function (e) {
    setTimeout(mainScript, 1500);
  });
})();
