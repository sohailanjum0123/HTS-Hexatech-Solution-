

    (() => {
        let locationId = "{{location.id}}";

        let extraTotals = {};
        let productIdPhoto = "67c8cf9f42a34d03470b08d7";
        let productIdVideo = "67c8d105f51cf411f5d4b1cb";
        let signaturePriceId = "67eea57bfd99c1ae1c5b956c";
        let activePhotographer = {
            id: "67f6d366846c480b88c3b555",
            product: "67f6d366846c4820aec3b553",
            count: 1,
        };
        let activeVideographer = {
            id: "67f6d366846c481f0dc3b557",
            product: "67f6d366846c4820aec3b553",
            count: 1,
        };

        let activeOtherPhotographer = {
            id: "6819f7e615c27804316eb4b1",
            product: productIdPhoto,
            selection: {},
        };
        let activeOtherVideographer = {
            id: "6819f82415c27808ee6eb4de",
            product: productIdVideo,
            selection: {},
        };

        const editedHiglightVideos = {
            1: [4, 6, 8],
            2: [8, 12, 16],
        };

        const editedPhotohighlight = {
            1: [300, 450, 600],
            2: [600, 900, 1200],
            3: [900, 1350, 1800],
        };


        let signatureBundleData = { amount: 525, id: signaturePriceId };
        let allPackages = {
            "Photos & Video": {
                product: "67eec56060ab2873b1dfdce5",
                class: "pv",
            },
            "Photos Only": {
                product: "67eec68160ab287b7ddfdd85",
                class: "p",
            },
            "Video Only": {
                product: "67eec6c44dc4834eccc4b7e1",
                class: "v",
            },
        };

        function isBetweenAugustAndOctoberAndSaturday(date) {
            const selectedDate = new Date(date);
            const month = selectedDate.getMonth();
            const day = selectedDate.getDay();
            let peakStart = parseInt('{{ custom_values.peak_season_month_start }}') - 1;
            let peakEnd = parseInt('{{ custom_values.peak_season_month_end }}') - 1;
            let peakDay = parseInt('{{ custom_values.peak_season_day }}');
            return month >= peakStart && month <= peakEnd && day === peakDay;
        }
        let weddingDate = localStorage.getItem('initial_venue_date') || "";
        if (weddingDate) {

        }
        let currency = "$";
        (() => {
            const activeCss = `
          .borderFull {
            cursor: pointer;
          }
          .border.active {
            border: 2px solid #116077;
          }
          #col-kw828gn9h3 {
            display: none;
          }
          .extra_session {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .extra_session .vertical.inner {
            display: none;
          }
          .card {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-radius: 10px;
            padding: 15px;
      
            align-items: center;
            justify-content: center;
          }
          .card .content {
            flex-grow: 1;
          }
          .card-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .card-description {
            font-size: 14px;
            color: #555;
          }
          .price-container {
            display: flex;
            column-gap: 10px;
            justify-content: center;
            align-items: center;
          }
          .price {
            font-size: 16px;
            font-weight: bold;
            border: 1px solid black;
            padding: 5px 10px;
            border-radius:5px;
          }
          .select-button,
          .added-button {
            color: black;
            border: 1px solid black;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .select-button:hover,
          .added-button:hover {
            transition: ease 0.5s;
          }
      
            button.trash-button {
          border: none;
          cursor: pointer;
          background: #ac3502;
          padding: 5px;
          border-radius: 5px;
      }
      .divider {
        width: 100%;
        height: 1px;  
        background-color: #ccc; 
        margin: auto; 
      }
        .total_price.mv.price_title {
          font-family:initial
      }


input.quantity_picker {
    width: 60px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    text-align: center;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input.quantity_picker:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  outline: none;
}
      
        `;
            if (!document.querySelector("style.activeCss")) {
                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.setAttribute("class", "activeCss");
                styleSheet.textContent = activeCss;
                document.head.appendChild(styleSheet);
            }
        })();
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

        let headers = {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                version: "2021-07-28",
                Authorization: "Bearer {{ custom_values.product_read_private_token }}",
            },
        };

        function mainAPIURL(productIdPhoto, price = "") {
            return `https://services.leadconnectorhq.com/products/${productIdPhoto}/price${price}?locationId=${locationId}`;
        }
        let activeService = localStorage.getItem("activeService") ?? "";
        function getPrices(productIdPhoto, productIdVideo) {
            return Promise.all([
                fetch(mainAPIURL(productIdPhoto), headers).then((res) => res.json()),

                fetch(mainAPIURL(productIdVideo), headers).then((res) => res.json()),
            ]);
        }
        for (let [service, price] of Object.entries(allPackages)) {
            fetch(mainAPIURL(price.product), headers)
                .then((res) => res.json())
                .then((x) => {
                    (x?.prices || []).forEach((p) => {
                        allPackages[service][p.name] = p;
                    });
                })
                .catch((p) => { });
        }

        fetch(
            mainAPIURL(activePhotographer.product, "/" + activePhotographer.id),
            headers
        )
            .then((res) => res.json())
            .then((x) => {
                if (x.amount) {
                    activePhotographer.amount = x.amount;
                }
            })
            .catch((p) => { });

        fetch(
            mainAPIURL(activeVideographer.product, "/" + activeVideographer.id),
            headers
        )
            .then((res) => res.json())
            .then((x) => {
                if (x.amount) {
                    activeVideographer.amount = x.amount;
                }
            })
            .catch((p) => { });


        fetch(
            mainAPIURL(activeOtherPhotographer.product, "/" + activeOtherPhotographer.id),
            headers
        )
            .then((res) => res.json())
            .then((x) => {
                if (x.amount) {
                    activeOtherPhotographer.amount = x.amount;
                }
            })
            .catch((p) => { });

        fetch(
            mainAPIURL(activeOtherVideographer.product, "/" + activeOtherVideographer.id),
            headers
        )
            .then((res) => res.json())
            .then((x) => {
                if (x.amount) {
                    activeOtherVideographer.amount = x.amount;
                }
            })
            .catch((p) => { });



        let isPeakSeason = isBetweenAugustAndOctoberAndSaturday(weddingDate);
        activeOtherPhotographer.min = isPeakSeason ? parseInt('{{ custom_values.min_hour_other_grapher_peak_season }}') : parseInt('{{ custom_values.min_hour_other_grapher }}');


        function getFinalExtras() {
            let selectedProducts = getExtrasProduct();
            if (selectedProducts.length > 0) {
                selectedProducts = [...selectedProducts];
            }
            let productIds = selectedProducts.map(t => t.id);
            return [...Object.values(selectedExtras)].filter(t => productIds.includes(t.id));
        }

        function updateCustomExtrasCount(extrasProduct = null) {
            const customExtrasButton = document.querySelector(".custom_extras ");

            if (customExtrasButton) {
                let buttonHeading = customExtrasButton.querySelector(
                    ".main-heading-group .main-heading-button"
                );
                let count = 0;
                try {
                    if (!extrasProduct) {
                        extrasProduct = getFinalExtras();
                    }
                    count = extrasProduct?.length || 0;
                } catch (error) { }
                buttonHeading.textContent = `Custom Extras (${count})`;
                if (count > 0) {
                    customExtrasButton.classList.add("active", "border");
                } else {
                    customExtrasButton.classList.remove("active", "border");
                }
            } else {
                console.error("Custom Extras button not found");
            }
        }

        let productPrices = {};
        let selectedExtras = {};
        let extrasSession = {};
        getPrices(productIdPhoto, productIdVideo).then(([photoData, videoData]) => {
            const transformData = (prices) =>
                prices.map((price) => ({
                    id: price._id || price.id,
                    name: price.name,
                    amount: `${price.amount}`,
                    isMulti: price.name.includes("Extra Hour"),
                    product: price.product,
                    description: price.description ?? "",
                }));

            const photoPrices = photoData?.prices
                ? transformData(photoData.prices)
                : [];
            const videoPrices = videoData?.prices
                ? transformData(videoData.prices)
                : [];

            signatureBundleFound = videoPrices.find(
                (t) => (t._id || t.id) == signaturePriceId
            );
            if (signatureBundleFound) {
                signatureBundleData = signatureBundleFound;
            }
            productPrices["photo"] = photoPrices;
            productPrices["video"] = videoPrices;
        });
        if (!localStorage.getItem("ExtrasSession")) {
            localStorage.setItem("ExtrasSession", JSON.stringify([]));
        }
        let signature = null;
        function formatNumber(number) {
            return new Intl.NumberFormat("en-US").format(
                number.replaceAll(currency, "")
            );
        }
        function changeExtraInLocal() {
            let allExtras = [...getFinalExtras()].map((extra) => ({
                ...extra,
            })); // Create a shallow copy of each object
            localStorage.setItem(
                "ExtrasSession",
                JSON.stringify(
                    allExtras.map((t) => {
                        delete t.amount;
                        return t;
                    })
                )
            );
            updateCustomExtrasCount(allExtras);
            updateTotalPrice();
        }

        function checkMinOtherQuantity(priceid, value = 1,index=0) {
            index= index ?? 0;
            let requiredValue = activeOtherPhotographer.min || 1;
            if ([activeOtherPhotographer.id, activeOtherVideographer.id].includes(priceid)) {
                if((activeOtherPhotographer.id==priceid && index <= activePhotographer.count) || (activeOtherVideographer.id==priceid && index <= activeVideographer.count)){
                    requiredValue = 1;
                }

                return value >= requiredValue ? value : requiredValue;
            }
            return value;
        }

        function getExtrasProduct() {

            let displayedData = [];
            try {
                let photoPrices = productPrices["photo"] || {};
                let videoPrices = productPrices["video"] || {};
                if (activeService === "Photos & Video") {
                    displayedData = [...photoPrices, ...videoPrices];
                } else if (activeService === "Photos Only") {
                    displayedData = photoPrices;
                } else if (activeService === "Video Only") {
                    displayedData = videoPrices;
                }
            } catch (error) {

            }
            return displayedData;
        }
        function showpopUpExtras() {
            waitElement("#hl_main_popup.show").then(() => {
                const extraSession = document.querySelector(".extra_session");



                function handleSelectButton(
                    productInfo,
                    selectButton,
                    addedButton,
                    trashIcon, selector
                ) {
                    let qty = 1;

                    let quantity = document.querySelector(
                        ".quantity_picker" + selector
                    );
                    let type = undefined;
                    if (quantity) {
                        qty = quantity.value;
                        type = quantity.getAttribute("data-type");
                    }

                    qty = checkMinOtherQuantity(productInfo.id, qty,productInfo.index);

                    selectedExtras[selector] = {
                        id: productInfo.id,
                        p: productInfo.p,
                        product: productInfo.product,
                        amount: productInfo.amount,
                        qty: qty,
                        type,
                    };
                    changeExtraInLocal();
                    selectButton.style.display = "none";
                    addedButton.style.display = "inline-block";
                    trashIcon.style.display = "inline-block";
                }

                function handleTrashButton(
                    productid,
                    selectButton,
                    addedButton,
                    trashIcon
                ) {
                    delete selectedExtras[productid];
                    changeExtraInLocal();
                    addedButton.style.display = "none";
                    trashIcon.style.display = "none";
                    selectButton.style.display = "inline-block";
                }

                let displayedData = getExtrasProduct();

                function createCard(data, selector) {
                    const card = document.createElement("div");
                    card.setAttribute("class", "card");
                    card.id = "extra_" + selector;

                    const content = document.createElement("div");
                    content.setAttribute("class", "content");

                    const title = document.createElement("h3");
                    title.setAttribute("class", "card-title");
                    let postfix = data.postfix ? data.postfix : "";
                    title.textContent = data.name;

                    const description = document.createElement("p");
                    description.setAttribute("class", "card-description");
                    description.textContent = data.description || "";

                    const priceContainer = document.createElement("div");
                    priceContainer.setAttribute("class", "price-container");

                    const price = document.createElement("div");
                    price.setAttribute("class", "price");
                    price.textContent = currency + formatNumber(data.amount || 0);

                    const selectButton = document.createElement("button");
                    selectButton.textContent = "Select";
                    selectButton.className = "select-button selectExtra_" + selector;

                    const addedButton = document.createElement("button");
                    addedButton.setAttribute("class", "added-button");
                    addedButton.textContent = "Added";
                    addedButton.disabled = true;
                    addedButton.style.display = "none";

                    const trashIcon = document.createElement("button");
                    trashIcon.setAttribute("class", "trash-button");
                    trashIcon.innerHTML = "🗑️";
                    trashIcon.style.display = "none";

                    selectButton.addEventListener("click", () =>
                        handleSelectButton(data, selectButton, addedButton, trashIcon, selector)
                    );

                    trashIcon.addEventListener("click", () =>
                        handleTrashButton(selector, selectButton, addedButton, trashIcon)
                    );
                    if (data.isMulti) {
                        const quantity = document.createElement("input");
                        let product = selectedExtras[selector] || null;
                        quantity.className = "quantity_picker quantity_picker" + selector;

                        quantity.value = product && product.qty ? product.qty : 1;
                        quantity.value = checkMinOtherQuantity(data.id, quantity.value,data.index);

                        let min = checkMinOtherQuantity(data.id, 1,data.index);
                        quantity.setAttribute("min", min);
                        quantity.setAttribute(
                            "data-type",
                            data.name.toLowerCase().includes("photo") ? "photo" : "video"
                        );
                        quantity.setAttribute("style", "width:50px");
                        quantity.setAttribute("type", "number");
                        quantity.oninput = function () {
                            let id = this.getAttribute("data-id");
                            let product = selectedExtras[selector] || null;
                            if (product) {
                                product.qty = this.value;
                                product.type = this.getAttribute("data-type");
                                selectedExtras[selector] = product;
                                changeExtraInLocal();
                            }
                        };
                        quantity.setAttribute("data-id", selector);
                        priceContainer.appendChild(quantity);
                    }
                    priceContainer.appendChild(price);
                    priceContainer.appendChild(selectButton);
                    priceContainer.appendChild(addedButton);
                    priceContainer.appendChild(trashIcon);

                    content.appendChild(title);
                    content.appendChild(description);
                    card.appendChild(content);
                    card.appendChild(priceContainer);

                    const divider = document.createElement("div");
                    divider.setAttribute("class", "divider");

                    return { card, divider };
                }

                function addCardWithDivider(data, container) {
                    const { card, divider } = createCard(data);
                    container.appendChild(card);
                    container.appendChild(divider);
                }

                if (extraSession) {
                    extraSession.innerHTML = "";
                    let titles = {
                        2: '2nd',
                        3: '3rd',
                        4: '4th'
                    };
                    let extraHoursData = {
                        photo:3,
                        video:2
                    };
                    displayedData.forEach((data) => {
                        if (data.id != signaturePriceId) {
                            let countPerson = 1;
                            let isOtherHour = false;
                            if (data.id == activeOtherPhotographer.id) {
                                countPerson = 3;//activePhotographer.count;
                                isOtherHour = true;
                            }
                            else if (data.id == activeOtherVideographer.id) {
                                countPerson = 2;//activeVideographer.count - ;
                                isOtherHour = true;
                            }
                            let initStarter = 1;
                            if (isOtherHour && countPerson == initStarter) {
                                countPerson = 0;
                            }
                            if (countPerson > initStarter) {
                                initStarter = 2;
                            }


                            for (let i = initStarter; i <= countPerson; i++) {
                                let obj = { ...data };
                                let selector = obj.id + "-" + i;
                                obj.index = i;
                                if (initStarter > 1) {

                                    obj.name = obj.name.replaceAll('Other', titles[i]);
                                    obj.p = titles[i];

                                }

                                const { card, divider } = createCard(obj, selector);
                                extraSession.appendChild(card);
                                extraSession.appendChild(divider);
                                let alreadySelected = selectedExtras[selector] || null;
                                if (alreadySelected) {
                                    waitElement(".selectExtra_" + selector).then((selectButton) => {
                                        setTimeout(
                                            (selectButton) => {
                                                selectButton.click();
                                            },
                                            50,
                                            selectButton
                                        );
                                    });
                                }
                            }


                        }
                    });
                } else {
                    console.error("Container with class 'extra_session' not found.");
                }
            });
        }
        let signatureNumber = 0;
        let subtotalNumber = 0;
        let extraTotal = 0;
        let totalPriceSelector = ".total_price";
        let localStorageKeys = {
            activePackage: "activeChosePackage",
            subtotalPrice: "SubtotalPricePackage",
            totalPrice: "TotalPricePackage",
        };
        function ucFirst(str) {
            if (!str) return str;
            return str[0].toUpperCase() + str.slice(1).toLowerCase();
        }
        let addSignatureExtraValue = null;
        localStorage.removeItem("ExtrasSession");

        function addSignaturePrice(addIt = false) {
            if (addIt) {
                signatureNumber = signatureBundleData.amount;
            } else {
                signatureNumber = 0;
            }

            updateTotalPrice();
        }

        let photoGpherAmount = 0;
        let videoGrapherAmount = 0;
        let packageGrapherAmount = {};
        function updateTotalPrice() {
            const totalPriceElement = document.querySelector(totalPriceSelector);

            let isChanged = false;
            let totalPhotographer = 0;
            if (activePhotographer.count > 1) {
                totalPhotographer = parseInt(
                    (activePhotographer.count - 1) * activePhotographer.amount
                );
                photoGpherAmount = totalPhotographer;
                localStorage.setItem(
                    "packageGrapherAmount",
                    JSON.stringify(
                        (packageGrapherAmount["photoGrapher"] = totalPhotographer)
                    )
                );
            }
            let totalVideoGrapher = 0;
            if (activeVideographer.count > 1) {
                totalVideoGrapher = parseInt(
                    (activeVideographer.count - 1) * activeVideographer.amount
                );
                videoGrapherAmount = totalVideoGrapher;
                localStorage.setItem(
                    "packageGrapherAmount",
                    JSON.stringify(
                        (packageGrapherAmount["videoGrapher"] = totalPhotographer)
                    )
                );
            }

            let allExtras = [...getFinalExtras()];
            let extras = allExtras.reduce((sum, extra) => {
                let price = (extra.amount || 0) * checkMinOtherQuantity(extra.id, (extra.qty || 1));
                if (extra.type) {
                    if (extra.type == "photo") {
                        if (activePhotographer.count > 0) {
                            // price *= activePhotographer.count;
                        }
                    } else if (extra.type == "video") {
                        if (activeVideographer.count > 0) {
                            // price *= activeVideographer.count;
                        }
                    }
                }
                return parseInt(sum) + parseInt(price);
            }, 0);

            let totalNumber =
                parseInt(subtotalNumber) +
                parseInt(signatureNumber) +
                parseInt(extras) +
                parseInt(totalVideoGrapher) +
                parseInt(totalPhotographer);

            totalNumber = isFinite(totalNumber) ? totalNumber : 0;

            // let totalAmount =
            //     parseInt(subtotalNumber) +
            //     parseInt(signatureNumber) +
            //     parseInt(extras)
            // // parseInt(totalVideoGrapher) +
            // // parseInt(totalPhotographer);

            if (totalPriceElement) {
                totalPriceElement.textContent = `${currency}${totalNumber.toLocaleString()}`;
            }

            // window.localStorage.setItem(
            //     localStorageKeys.totalPrice,
            //     totalNumber.toString()
            // );
        }

        let productItems = {};
        function mainScript() {

            if (isPeakSeason) {
                waitElement('.hidepeak').then(p => {
                    function removeHidePeak() {
                        document.querySelectorAll('.hidepeak').forEach(x => {
                            x.remove()
                        })
                    }
                    removeHidePeak();
                    setTimeout(removeHidePeak, 500)
                    setTimeout(removeHidePeak, 1500)
                    setTimeout(removeHidePeak, 2500)
                    setTimeout(removeHidePeak, 5500)
                    setTimeout(removeHidePeak, 5500)

                })
            }

            const pv_button = document.querySelector(".pv_service");
            const p_button = document.querySelector(".p_service");
            const v_button = document.querySelector(".v_service");

            const photoGrapherHeading = document.querySelector(".photographer_heading");
            const photoGrapher = document.querySelector(".photographer");
            const videoGrapherHeading = document.querySelector(".videographer_heading");
            const videoGrapher = document.querySelector(".videographers");

            const pv_section = document.querySelector(".pv_section");
            const p_section = document.querySelector(".p_section");
            const v_section = document.querySelector(".v_section");

            if (pv_button) {
                pv_button.classList.add("border", "active");
                showPVContent();
                toggleSections(pv_section, p_section, v_section);

                pv_button.click();
            }

            if (pv_button) {
                pv_button.classList.add("border", "active");
                setTimeout(() => {
                    pv_button.click();
                }, 0);
            }

            [pv_button, p_button, v_button].forEach((button) => {
                if (button) {
                    button.onclick = function () {
                        addSignaturePrice();
                        handleServiceButtonClick(button);
                    };
                }
            });

            function toggleSections(activeSection, ...inactiveSections) {
                activeSection.style.display = "block";
                activeSection.style.opacity = "1";

                try {
                    inactiveSections.forEach((section) => {
                        section.style.opacity = "0";
                        setTimeout(() => {
                            section.style.display = "none";
                        }, 300);
                    });
                } catch (error) { }
            }

            function toggleContent(showElements, hideElements) {
                try {
                    showElements.forEach((el) => {
                        if (el) el.style.display = "block";
                    });
                } catch (error) { }
                try {
                    hideElements.forEach((el) => {
                        if (el) el.style.display = "none";
                    });
                } catch (error) { }
            }

            function showPVContent() {
                toggleContent(
                    [photoGrapherHeading, photoGrapher, videoGrapherHeading, videoGrapher],
                    []
                );
            }

            function showPContent() {
                toggleContent(
                    [photoGrapherHeading, photoGrapher],
                    [videoGrapherHeading, videoGrapher]
                );
            }

            function showVContent() {
                toggleContent(
                    [videoGrapherHeading, videoGrapher],
                    [photoGrapherHeading, photoGrapher]
                );
            }

            function handleServiceButtonClick(button) {
                const selectionsSectionPhotoVideo = document.querySelector(".pv_section");
                const selectionsSectionPhoto = document.querySelector(".p_section");
                const selectionsSectionVideo = document.querySelector(".v_section");
                let action = isPeakSeason ? "emerald" : "pearl";
                const photoVideoPearl = document.querySelector(".pv_" + action);
                const photoPearl = document.querySelector(".p_" + action);
                const VideoPearl = document.querySelector(".v_" + action);
                let serviceTitle = document.querySelector(".service_title h1") ?? "";

                activeService =
                    button.querySelector(".main-heading-group .main-heading-button")
                        ?.textContent || "";

                [pv_button, p_button, v_button].forEach((btn) => {
                    if (btn) btn.classList.remove("border", "active");
                });



                button.classList.add("border", "active");
                signature = document.getElementById("col-kw828gn9h3");
                if (signature) {
                    if (
                        p_button.classList.contains("border") &&
                        p_button.classList.contains("active")
                    ) {
                        signature.style.display = "none";
                    } else {
                        signature.style.display = "flex";
                    }
                }

                if (button === pv_button) {
                    showPVContent();
                    toggleSections(pv_section, p_section, v_section);

                    waitElement(".pv_section").then((pv) => {
                        if (pv) {
                            handleSectionClick(selectionsSectionPhotoVideo, photoVideoPearl);
                        }
                    });
                }
                if (button === p_button) {
                    showPContent();
                    toggleSections(p_section, pv_section, v_section);
                    waitElement(".p_section").then((p) => {
                        if (p) {
                            handleSectionClick(selectionsSectionPhoto, photoPearl);
                        }
                    });
                }
                if (button === v_button) {
                    showVContent();
                    toggleSections(v_section, pv_section, p_section);
                    waitElement(".v_section").then((v) => {
                        if (v) {
                            handleSectionClick(selectionsSectionVideo, VideoPearl);
                        }
                    });
                }
                if (serviceTitle) {
                    onActiveServiceChange(activeService);
                    serviceTitle.textContent = activeService;
                } else {
                    console.error("serviceTitle is not defined or not found in the DOM.");
                }

                window.localStorage.setItem("activeService", activeService);
                changeExtraInLocal();
            }

            function handleGrapherClick(grapher) {
                const parentGroup = grapher.closest(".videographers, .photographer");
                if (parentGroup) {
                    const videoLocalActiveService =
                        window.localStorage.getItem("activeVideographer");
                    const photoLocalActiveService =
                        window.localStorage.getItem("activePhotographer");

                    parentGroup.querySelectorAll("button").forEach((btn) => {
                        btn.classList.remove("active", "border");

                        if (
                            videoLocalActiveService === null ||
                            videoLocalActiveService.trim() === ""
                        ) {
                            btn.classList.remove("active", "border");
                        }
                        if (
                            photoLocalActiveService === null ||
                            photoLocalActiveService.trim() === ""
                        ) {
                            btn.classList.remove("active", "border");
                        }
                    });

                    grapher.classList.add("active", "border");

                    const mainButton = grapher.querySelector(".main-heading-button");
                    const textActiveGrapher = mainButton ? mainButton.textContent : "";

                    if (parentGroup.classList.contains("videographers")) {
                        activeVideographer.count = textActiveGrapher;
                        activeVideographer.lastClick = grapher;

                        window.localStorage.setItem("activeVideographer", textActiveGrapher);
                    } else if (parentGroup.classList.contains("photographer")) {
                        activePhotographer.lastClick = grapher;
                        activePhotographer.count = textActiveGrapher;

                        window.localStorage.setItem("activePhotographer", textActiveGrapher);
                    }

                    updatePrices();

                    updateTotalPrice();

                    setTimeout(updateTotalPrice, 500);
                }
            }
            function clearSignaturePrice() {
                localStorage.removeItem("SignatureExtra");
                addSignaturePrice();
                mainSignatureExtraButton.classList.remove("active", "border");
            }
            function attachGrapherEvents(grapherButtons) {
                grapherButtons.forEach((button) => {
                    button.addEventListener("click", () => handleGrapherClick(button));
                });
            }

            const videoGrapherButtons = document.querySelectorAll(
                ".videographers button"
            );
            const photoGrapherButtons = document.querySelectorAll(
                ".photographer button"
            );

            attachGrapherEvents(videoGrapherButtons);
            attachGrapherEvents(photoGrapherButtons);
            function attachEventHandlers(selectors, handler) {
                document.querySelectorAll(selectors).forEach((button) => {
                    if (button) {
                        button.addEventListener("click", () => handler(button));
                    }
                });
            }

            function handleChosePackageButtonClick(button) {
                const allButtons = document.querySelectorAll(
                    ".pv_pearl, .pv_emerald, .pv_diamond, .p_pearl, .p_emerald, .p_diamond, .v_pearl, .v_emerald, .v_diamond"
                );
                allButtons.forEach((btn) => btn.classList.remove("border", "active"));

                button.classList.add("border", "active");

                const headingPackage = document.querySelector(
                    ".select_package h1 strong"
                );

                const textActiveChosePackage =
                    button.querySelector("h2")?.textContent || "";

                const pricepackagetextElement = button.querySelector(
                    ".package_price > div > h2"
                );

                const pricepackagetext = pricepackagetextElement
                    ? pricepackagetextElement.textContent
                    : "";



                const subtotal = (pricepackagetext.match(/\b\d+(?:\.\d+)?\b/) || [])[0] || "0";

                //subtotalNumber = parseFloat(subtotal.replace(',',''));


                if (headingPackage) {
                    headingPackage.textContent = textActiveChosePackage;
                }
                let activePackage = textActiveChosePackage.toUpperCase();
                window.localStorage.setItem("activeChosePackage", activePackage);
                // window.localStorage.setItem("TotalPricePackage", subtotal);
                let packagePrice = allPackages[activeService][activePackage] ?? {};
                subtotalNumber = packagePrice.amount;

                if (packagePrice.product) {
                    window.localStorage.setItem(
                        "packageId",
                        JSON.stringify({
                            product: packagePrice.product,
                            id: packagePrice._id || packagePrice.id,
                        })
                    );
                }
                updateTotalPrice();
            }

            let mainSignatureExtraButton = null;

            function resetLocalStorageOnServiceChange(newActiveService) {
                const regex = /<h1>(.*?)<\/h1>/;
                const match = newActiveService.match(regex);

                if (match) {
                    newActiveService = match[1];
                } else {
                    console.log("No match found");
                }
                const currentActiveService = window.localStorage.getItem("activeService");
                let photo = 1;

                let video = 1;
                function handleButtonClickLast(event) {
                    if (event.lastClick) {
                        event.lastClick.click();
                    }
                }
                let toClick = [];
                if (newActiveService == "Photos Only") {
                    clearSignaturePrice();
                    video = 0;
                    toClick.push(activePhotographer);
                } else if (newActiveService == "Video Only") {
                    toClick.push(activeVideographer);

                    photo = 0;
                } else {
                    toClick.push(activePhotographer);
                    toClick.push(activeVideographer);
                }
                if (currentActiveService !== newActiveService) {
                    window.localStorage.setItem("activeService", newActiveService);

                    // window.localStorage.setItem("TotalPricePackage", null);
                    activeVideographer.count = video;
                    activePhotographer.count = photo;
                    window.localStorage.setItem("activePhotographer", photo);
                    window.localStorage.setItem("activeVideographer", video);
                    changeExtraInLocal();
                    const keysToClear = ["activeChosePackage"];
                    keysToClear.forEach((key) => {
                        window.localStorage.setItem(key, "");
                    });
                }

                toClick.forEach((x) => {
                    handleButtonClickLast(x);
                });
            }

            function onActiveServiceChange(newActiveService) {
                resetLocalStorageOnServiceChange(newActiveService);
            }

            attachEventHandlers(
                ".pv_pearl, .pv_emerald, .pv_diamond",
                handleChosePackageButtonClick
            );
            attachEventHandlers(
                ".p_pearl, .p_emerald, .p_diamond",
                handleChosePackageButtonClick
            );
            attachEventHandlers(
                ".v_pearl, .v_emerald, .v_diamond",
                handleChosePackageButtonClick
            );

            waitElement(".add_signature_extras").then((SignatureExtra) => {
                mainSignatureExtraButton = SignatureExtra;
                const addExtra = document.querySelector(".add_extras_later");
                const customExtra = document.querySelector(".custom_extras");

                const addSignatureExtraButton = document.querySelector(
                    ".add_signature_extras .main-heading-group .main-heading-button"
                );

                if (addSignatureExtraButton) {
                    addSignatureExtraValue = addSignatureExtraButton.textContent
                        .trim()
                        .split(" ");
                    addSignatureExtraValue = addSignatureExtraValue[
                        addSignatureExtraValue.length - 1
                    ].replace("$", "");
                }

                const ariaLabel =
                    SignatureExtra.getAttribute("aria-label") || SignatureExtra.textContent;
                const signatureValue = ariaLabel.match(/\$[0-9,]+/)[0];
                addSignatureExtraValue = parseFloat(
                    signatureValue.replace(/[^0-9.]/g, "")
                );

                customExtra.onclick = showpopUpExtras;
                clearSignaturePrice();
                SignatureExtra.onclick = function (e) {
                    if (SignatureExtra.classList.contains("active")) {
                        clearSignaturePrice();
                    } else {
                        SignatureExtra.classList.add("active", "border");
                        addExtra.classList.remove("active", "border");
                        localStorage.setItem(
                            "SignatureExtra",
                            JSON.stringify({
                                id: signatureBundleData.id,
                                product: signatureBundleData.product,
                            })
                        );
                        addSignaturePrice(true);
                    }
                };
                addExtra.onclick = function (e) {
                    if (addExtra.classList.contains("active")) {
                        addExtra.classList.remove("active", "border");
                    } else {
                        addExtra.classList.add("active", "border");
                        SignatureExtra.classList.remove("active", "border");
                        localStorage.removeItem("SignatureExtra");
                    }
                    addSignaturePrice();
                };
            });

            let totalGrapherPrice = photoGpherAmount + videoGrapherAmount;


            function PhotoVideoPackages() {
                function setupButtonHandlers(
                    buttons,
                    storageKey,
                    label,
                    packageClass,
                    label2,
                    highlightVideoClass
                ) {
                    if (buttons.length > 0) {
                        function videosectionsHanlde(section, grapher, activeValue) {
                            let photographer = grapher.closest(".photographer");
                            let videographer = grapher.closest(".videographers");
                            let activeValuePhoto = localStorage.getItem("activePhotographer");
                            let activeValueVideo = localStorage.getItem("activeVideographer");
                            let label2ToUsePhoto = activeValuePhoto === "1" ? "photographer" : "photographers";
                            let label2ToUseVideo = activeValueVideo === "1" ? "videographer" : "videographers";

                            if (section && activeValue) {
                                const paragraphElsPhoto = section.querySelectorAll(
                                    `.PhotographeronPackage > div > p`
                                );
                                const paragraphElsvideo = section.querySelectorAll(
                                    `.videographeronPackage > div > p`
                                );

                                paragraphElsPhoto.forEach((paragraph) => {
                                    paragraph.textContent = `${activeValuePhoto} ${label2ToUsePhoto}`;
                                });
                                paragraphElsvideo.forEach((paragraph) => {
                                    paragraph.textContent = `${activeValueVideo} ${label2ToUseVideo}`;
                                });

                                const higllightVideos = section.querySelectorAll(
                                    `.${highlightVideoClass} > div > p`
                                );

                                const editedPhotos = section.querySelectorAll(
                                    `.${highlightVideoClass} > div > p`
                                );

                                if (photographer) {
                                    editedPhotos.forEach((photo, index) => {
                                        index = isPeakSeason ? index + 1 : index;
                                        const photoText = photo.textContent?.trim() || "";
                                        const defaults = editedPhotohighlight[activeValue] || [];

                                        const defaultPhotoCount = defaults[index] || 0;

                                        const howManyPhoto =
                                            typeof photoText === "string" && photoText.includes("+")
                                                ? parseInt(photoText.split("+")[0], 10)
                                                : defaultPhotoCount;

                                        let contentPlace = `${defaultPhotoCount}+ ${label2}`;

                                        photo.textContent = contentPlace;
                                    });
                                }

                                if (videographer) {
                                    higllightVideos.forEach((video, index) => {
                                        const videoText = video.textContent?.trim() || "";
                                        const defaults = editedHiglightVideos[activeValue] || [];
                                        index = isPeakSeason ? index + 1 : index;
                                        const defaultVideoCount = defaults[index] || 0;

                                        const howManyVideo =
                                            typeof videoText === "string" && videoText.includes("+")
                                                ? parseInt(videoText.split("+")[0], 10)
                                                : defaultVideoCount;

                                        let contentPlace = `${defaultVideoCount}+ ${label2}`;

                                        video.textContent = contentPlace;
                                    });
                                }
                            }
                        }

                        buttons.forEach((button) => {
                            button.addEventListener("click", function (e) {
                                let targetElement = e.target;

                                const activeValue = localStorage.getItem(storageKey);

                                waitElement(".pv_section").then((pvSection) => {
                                    videosectionsHanlde(pvSection, targetElement, activeValue);

                                });
                                waitElement(".v_section").then((vSection) => {
                                    videosectionsHanlde(vSection, targetElement, activeValue);
                                    //if (vSection && activeValue) {
                                    // const paragraphEls = vSection.querySelectorAll(
                                    //   `.${packageClass} > div > p`
                                    //  );

                                    //   paragraphEls.forEach((paragraph) => {
                                    //    paragraph.textContent = `${activeValue} ${label}`;
                                    // });
                                    // }
                                });
                                waitElement(".p_section").then((pSection) => {
                                    videosectionsHanlde(pSection, targetElement, activeValue);
                                    //if (pSection && activeValue) {
                                    // const paragraphEls = pSection.querySelectorAll(
                                    //    `.${packageClass} > div > p`
                                    //   );

                                    //  paragraphEls.forEach((paragraph) => {
                                    //  paragraph.textContent = `${activeValue} ${label}`;
                                    // });
                                    // }
                                });
                            });
                        });
                    }
                }
                // Set up both types of buttons
                const photographerButtons = document.querySelectorAll(
                    ".photographer button"
                );
                const videographerButtons = document.querySelectorAll(
                    ".videographers button"
                );

                setupButtonHandlers(
                    photographerButtons,
                    "activePhotographer",
                    "Photographer",
                    "PhotographeronPackage",
                    "fully edited photos",
                    "editedPhotos"
                );
                setupButtonHandlers(
                    videographerButtons,
                    "activeVideographer",
                    "Videographer",
                    "videographeronPackage",
                    "minute highlight video",
                    "highlightVideo"
                );
            }
            waitElement(".main_container_package").then((packages) => {
                PhotoVideoPackages();
            });


            function updatePrices(selector = '.package_price') {
                let prices = [...Object.values(allPackages)];

                prices.forEach(obj => {

                    let package = { ...obj };
                    let className = package.class;
                    delete package.class;
                    delete package.product;

                    for (let [k, v] of Object.entries(package)) {
                        let priceField = document.querySelector('.' + className + "_" + k.toLowerCase() + "_price" + selector);

                        if (priceField) {
                            const pkPriceElement = priceField.querySelector("div > h2");

                            if (pkPriceElement) {

                                let amount = v.amount ?? 0;
                                let originalPrice = v.compareAtPrice ?? 0;
                                let totalAmount = 0;
                                if (activePhotographer.count > 1) {
                                    totalAmount = (activePhotographer.count - 1) * activePhotographer.amount;
                                    amount += totalAmount;
                                    originalPrice = originalPrice > 0 ? originalPrice + totalAmount : originalPrice;
                                }
                                if (activeVideographer.count > 1) {
                                    totalAmount = (activeVideographer.count - 1) * activePhotographer.amount;
                                    amount += totalAmount;
                                    originalPrice = originalPrice > 0 ? originalPrice + totalAmount : originalPrice;
                                }
                                let discountedHtml = originalPrice > 0 ? `<strong> </strong><em><s><sup>${currency}${originalPrice.toLocaleString()}</sup></s></em>` : ``;
                                pkPriceElement.innerHTML = `${currency}${amount.toLocaleString()}${discountedHtml}`;
                            }
                        }
                    }


                });



            }






            function handleSubmission({
                totalPriceSelector,
                extraSignatureButtonSelector,
                packageButtonsSelector,
                headingPackageSelector,
                localStorageKeys,
            }) {
                waitElement(packageButtonsSelector).then((t) => {
                    document.querySelectorAll(packageButtonsSelector).forEach((button) => {
                        button.onclick = () => {
                            const allButtons = document.querySelectorAll(
                                packageButtonsSelector
                            );
                            allButtons.forEach((btn) =>
                                btn.classList.remove("border", "active")
                            );

                            button.classList.add("border", "active");

                            const headingPackage = document.querySelector(
                                headingPackageSelector
                            );
                            const textActivePackage =
                                button.querySelector("h2")?.textContent || "";

                            if (headingPackage) {
                                headingPackage.textContent = textActivePackage;
                            }

                            const pricePackageTextElement = button.querySelector(
                                ".package_price > div > h2"
                            );
                            const pricePackageText = pricePackageTextElement
                                ? pricePackageTextElement.textContent
                                : "";
                            const subtotal = (pricePackageText.match(/\b\d+(?:\.\d+)?\b/) || [])[0] || "0";
                            //subtotalNumber = parseFloat(subtotal)

                            // window.localStorage.setItem(
                            //     localStorageKeys.activePackage,
                            //     ucFirst(textActivePackage)
                            // );
                            /*window.localStorage.setItem(
                                                localStorageKeys.subtotalPrice,
                                                subtotalNumber.toString()
                                            );*/

                            // updateTotalPrice();
                        };
                    });
                });

                return {
                    updateExtraTotal(total) {
                        extraTotal = total;
                        updateTotalPrice();
                    },
                };
            }

            const submissionHandler = handleSubmission({
                totalPriceSelector,
                extraSignatureButtonSelector: "#button-tQaWEjaceI_btn",
                packageButtonsSelector:
                    ".pv_pearl, .pv_emerald, .pv_diamond, .p_pearl, .p_emerald, .p_diamond, .v_pearl, .v_emerald, .v_diamond",
                headingPackageSelector: ".select_package h1 strong",
                localStorageKeys,
            });

            function autoClick() {
                const firstPhotographer = document.querySelector(
                    ".photographer .inner"
                )?.firstElementChild;
                const firstVideographer = document.querySelector(
                    ".videographers .inner"
                )?.firstElementChild;

                if (firstPhotographer || firstVideographer) {
                    handleButtonClick(firstPhotographer, "div > div > div > button");
                    handleButtonClick(firstVideographer, "div > div > div > button");
                }
            }

            function handleButtonClick(element, selector) {
                if (element) {
                    const button = element.querySelector(selector);
                    if (button) {
                        button.classList.add("border", "active");
                        requestAnimationFrame(() => button.click());
                    }
                }
            }

            function handleSectionClick(section, pearlElement, delay = 0) {
                if (section && pearlElement) {
                    pearlElement.classList.add("border", "active");
                    setTimeout(() => {
                        requestAnimationFrame(() => pearlElement.click());
                    }, delay);
                }
            }

            autoClick();

            setTimeout(() => {
                autoClick();
            }, 500);
        }

        document.addEventListener("hydrationDone", function (e) {
            setTimeout(mainScript, 1500);
        });
        mainScript();
    })();
