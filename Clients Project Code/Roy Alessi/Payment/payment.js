

    (() => {
        let jqueryLoaded = false;

        let privateToken = '{{ custom_values.product_read_private_token }}';
        let discountsvalue = getFinateValue(parseFloat('{{ custom_values.normal_day_discount }}'), 2); /*Pay in full discount*/
        let weekdaysDiscount = getFinateValue(parseFloat('{{ custom_values.week_day_discount }}'), 20); /* Weekdays discount if date not available */
        let invoiceItems = [];
        let locationId = '{{location.id}}';
        let invObject = {};
        let currency = "$";
        let payinFull = "Pay In Full";
        let paymentPlanDes = "";
        let discount = 0;
        let discountAmount = 0;
        let finalAmount = 0;
        let totalAfterDisc = 0;
        let totalAddToTotal = 0;
        let dueAmount = 0;
        let headers = {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                version: "2021-07-28",
                Authorization:
                    "Bearer " + privateToken,
            }
        };

        function pluralize(count, singular, plural = singular + 's') {
            return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
        }

        function getFinateValue(value, def = 0) {
            return isFinite(value) ? value : def;
        }
        let invoiceSelectedItems = {};
        let SubtotalPricePackage = 0;
        let signatureExtras = getLocalStorageValue("SignatureExtra") ?? '{}';
        signatureExtras = JSON.parse(signatureExtras);

        let activePhotographer = {
            id: "67f6d366846c480b88c3b555",
            product: "67f6d366846c4820aec3b553",
        }
        let activeVideographer = {
            id: "67f6d366846c481f0dc3b557",
            product: "67f6d366846c4820aec3b553",
        }
        let activeService = getLocalStorageValue("activeService");
        let selectedPackage =
            ucFirst(getLocalStorageValue("activeChosePackage")) +
            " Package | " +
            activeService;

        let packageId =
            JSON.parse(getLocalStorageValue("packageId") ?? "{}");

        function formatNumberWithCommas(number, fraction = 2, locale = "en-US") {
            //number = number.toFixed(0);
            return currency + '' + (new Intl.NumberFormat(locale, {
                minimumFractionDigits: fraction,
                maximumFractionDigits: fraction
            }).format(number));
        }
        function replaceContract(para) {
            para = para.replaceAll('[name]', (userData?.full_name || userData?.name || ""))
            para = para.replaceAll('[venue]', userData?.full_address || "");
            para = para.replaceAll('[email]', userData?.email || "");
            para = para.replaceAll('[phone]', userData?.phone || "");
            return para;
        }
        const somethingExtras = getLocalStorageValue("ExtrasSession") ?? "[]";

        const extrasData = JSON.parse(somethingExtras);

        let countVideographer = parseInt(
            getLocalStorageValue("activeVideographer")
        );
        let countPhotoGrapher = parseInt(
            getLocalStorageValue("activePhotographer")
        );

        if (activeService == 'Photos Only') {
            countVideographer = 0;
        }
        if (activeService == 'Video Only') {
            countPhotoGrapher = 0;
        }

        const nearestLocation =
            JSON.parse(getLocalStorageValue("nearestLocation")) || {};
        let isWeekDay = false;
        let weddingDate = getLocalStorageValue("initial_venue_date");
        formattedWeddingDate = USADate(weddingDate);

        /*  const eventDateObj = new Date(weddingDate);
          const selectedDateObj = new Date();
  
          // Calculate the difference in days between selected date and event date
          const timeDiff = eventDateObj - selectedDateObj;
          const daysDiff = timeDiff / (1000 * 3600 * 24);  // Convert milliseconds to days
  
  
          if (daysDiff < 30 || weddingDate == '') {
              console.log('The selected date must be at least 30 days from today.');
              return;
          }*/

        function setRadioValue(selector, value) {
            let defSelected = $(selector + `[value="${value}"]`);
            defSelected.trigger("click");
        }


        let totalAllowedPayments = 4;




        function executeTriggers() {
            try {
                waitElement(howtoInstallPayKey).then((x) => {
                    hidePaymentPlans(false);
                    if (discountsvalue > 0) {
                        let label = $(howtoPayKey + `[value="${payinFull}"]`).siblings();
                        if (!isWeekDay) {
                            label.html(
                                `<span>${payinFull}</span><span class="discount">${discountsvalue}% off</span>`
                            );
                            label.css("position", "relative");
                        }
                    }

                    setRadioValue(howtoPayKey, 'Payment Plan');
                    setRadioValue(howtoInstallPayKey, 2);
                    $(howtoInstallPayKey).each(function () {
                        if (parseInt($(this).val()) > totalAllowedPayments) {
                            $(this).parent().hide();
                        }
                    });
                });
                $("body").off("change", howtoPayKey);
                $("body").on("change", howtoPayKey, function (e) {
                    hidePaymentPlans(this.value != payinFull);

                    calculateInvoice();
                });
                $("body").off("change", howtoInstallPayKey);
                $("body").on("change", howtoInstallPayKey, function (e) {
                    calculateInvoice();
                });
            } catch (error) {
                setTimeout(executeTriggers, 500);
            }
        }
        (() => {
            var script = document.createElement("script");
            script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            script.async = true;
            document.head.appendChild(script);
            script.onload = function () {
                console.log("jQuery has been loaded successfully!");
                jqueryLoaded = true;
                executeTriggers();

            };
        })();


        let paymentInputSelector = null;

        function updateInvoiceAmount(amount = -1) {

            amount = amount > 0 ? amount : dueAmount;
            function setInvoiceAmount(x, amount) {
                x.setAttribute('readonly', 'readonly');
                if (amount > 0 && x.value != amount) {

                    x.value = amount;
                    console.log(amount, x.value);
                    x.dispatchEvent(new Event("change"));
                    x.dispatchEvent(new Event("input"));
                }
            }

            if (!paymentInputSelector) {
                waitElement(
                    "#payment-donation .suggestion-off.payment-input-container input"
                ).then((x) => {
                    paymentInputSelector = x;
                    setInvoiceAmount(x, amount);
                });
            } else {
                setInvoiceAmount(paymentInputSelector, amount);
            }
        }

        let checkForLatestAmount = setInterval(updateInvoiceAmount, 300);


        function getCurrentValue(selector) {
            return $(selector + ":checked").val();
        }

        function ucFirst(str) {
            if (!str) return str;
            return str[0].toUpperCase() + str.slice(1);
        }
        function calculateDiscountedPrice(totalPrice, discountPercentage) {
            return (discountPercentage / 100) * totalPrice;
        }
        const totalAmount = parseFloat(getLocalStorageValue("TotalPricePackage"));
        const discountsEvent = parseFloat(getLocalStorageValue("discountsEvent"));
        const userData = JSON.parse(getLocalStorageValue("_ud") ?? "{}");

        let customerId = userData["customer_id"] ?? "1798";
        let howtoPayKey = '[data-q="how_would_you_like_to_pay"]';
        let howtoInstallPayKey =
            '[data-q="how_many_instalments_would_you_like_to_pay_in"]';
        try {
            const date = new Date(weddingDate);
            const dayOfWeek = date.getDay();
            isWeekDay = dayOfWeek >= 1 && dayOfWeek <= 4;
            if (!isWeekDay) {
                weekdaysDiscount = 0;
            }
        } catch (error) { }

        function mainAPIURL(productId, priceId) {
            return `https://services.leadconnectorhq.com/products/${productId}/price/${priceId}?locationId=${locationId}`;
        }

        function hidePaymentPlans(isShow = false) {
            let heading = $("#el_WqmIIwJ8oCgy2cIkqj7f_header_16");
            let fields = $('[id*="el_WqmIIwJ8oCgy2cIkqj7f_78tvLIWOUDemATQlKmTv"]');
            if (isShow) {
                heading.show();
                fields.show();
            } else {
                heading.hide();
                fields.hide();
            }
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

        function debounce(func, wait) {
            let timeout;

            return function () {
                const context = this;
                const args = arguments;

                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            };
        }

        function USADate(date) {
            if (typeof date == 'string') {
                date = new Date(date);
            }

            return date ? date.toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            ) : "";
        }

        function parseNumber(number, float = false) {
            number = number.toString().replace(',', '');
            if (float) {
                number = parseFloat(parseFloat(number).toFixed(2));
            } else {
                number = parseInt(parseInt(number).toFixed(0));
            }
            return isFinite(number) ? number : 0;
        }


        function getInstallmentDates(userSelectedEndDateStr, numberOfInstallments) {

            function dateOnly(dt) {
                return dt.toISOString().split("T")[0];
            }
            const startDate = new Date(); // Today's date
            const userSelectedEndDate = new Date(userSelectedEndDateStr);

            if (numberOfInstallments === 1) {
                // Return an array with today's date formatted as YYYY-MM-DD
                return [dateOnly(startDate)];
            }

            // Adjust end date to be 7 days before user-selected date
            const adjustedEndDate = new Date(userSelectedEndDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() - 7);

            const result = [];
            const totalTime = adjustedEndDate.getTime() - startDate.getTime();
            const interval = totalTime / (numberOfInstallments - 1);

            for (let i = 0; i < numberOfInstallments; i++) {
                const installmentDate = new Date(startDate.getTime() + i * interval);
                // Format as YYYY-MM-DD
                result.push(dateOnly(installmentDate));
            }

            return result;
        }

        function calculateInvoice() {

            waitElement(".totalContainer .totals .subtotal").then(subTotalDiv => {
                const paymentsPlansElement = document.querySelector(
                    ".booking-info .PaymentPlans"
                );
                const paymentPlanorFullElement = document.querySelector(
                    ".booking-info .paymentPlanorFull"
                );

                let installments =
                    getCurrentValue(howtoPayKey) === payinFull
                        ? 1
                        : getCurrentValue(howtoInstallPayKey);
                let allExtras = [...Object.values(invoiceSelectedItems)];

                let totalAddToTotal = allExtras.reduce((sum, extra) => {
                    const price = extra.dup ? 0 : extra.totalPrice || (extra.price || 0) * (extra.qty || 1);
                    return parseNumber(sum, true) + parseNumber(price, true);
                }, 0);
                console.log({ totalAddToTotal })
                    ; invObject["subtotal"] = totalAddToTotal;
                if (subTotalDiv) {
                    subTotalDiv.innerText = formatNumberWithCommas(parseNumber(totalAddToTotal, true));
                }

                if (isNaN(totalAddToTotal)) {
                    totalAddToTotal = 0;
                }
                invObject["milesPrice"] = milesPrice;
                invObject["miles"] = miles;
                totalAddToTotal = totalAddToTotal + milesPrice;
                discountAmount = 0;
                if (installments === 1) {
                    if (weekdaysDiscount > 0) {
                        discountAmount = calculateDiscountedPrice(
                            totalAddToTotal,
                            weekdaysDiscount
                        );
                        finalAmount = totalAddToTotal - discountAmount;
                    } else {
                        discountAmount = calculateDiscountedPrice(totalAddToTotal, discountsvalue);
                    }
                } else {
                    discount = 0;
                    if (weekdaysDiscount > 0) {
                        discountAmount = calculateDiscountedPrice(
                            totalAddToTotal,
                            weekdaysDiscount
                        );
                    }
                }
                setFieldValue("payment_discounts", discountAmount);
                invObject["discounts"] = discountAmount;

                finalAmount = parseNumber(totalAddToTotal - discountAmount, true);

                waitElement('.discountsTag').then(x => {

                    if (discountAmount > 0) {
                        x.classList.remove('hide');
                    } else {
                        x.classList.add('hide');
                    }
                })

                totalSection();
                setFieldValue("initial_payment", finalAmount);
                totalAfterDisc = finalAmount;
                invObject["total"] = totalAddToTotal;

                paymentPlanDes = installments == 1 ? payinFull : "Installment Plan";

                if (paymentsPlansElement) {
                    paymentsPlansElement.textContent = paymentPlanDes;
                }

                if (paymentPlanorFullElement) {
                    paymentPlanorFullElement.innerHTML = "";

                    const headingHTML = `
                    <p><span>Due Date:</span></p>
                    `;
                    paymentPlanorFullElement.innerHTML = headingHTML;
                    let initial_venue_date = getLocalStorageValue("initial_venue_date")


                    const currentDate = new Date();
                    const options = {
                        timeZone: "America/Chicago",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    };
                    const formatter = new Intl.DateTimeFormat("en-US", options);
                    const formattedDate = formatter.format(currentDate);

                    const firstInstallmentDate = new Date(formattedDate);
                    dueAmount = finalAmount;
                    if (installments > 1) {
                        const installmentAmount = parseNumber(finalAmount / installments, true);
                        dueAmount = parseNumber(installmentAmount, true);
                    }
                    const installmentDates = getInstallmentDates(initial_venue_date, installments);
                    for (let i = 1; i <= installments; i++) {
                        const formattedInstallmentDate = USADate(installmentDates[i - 1]);
                        const installmentHTML = `
                            <p><span class="payment">${formatNumberWithCommas(dueAmount)}</span> on ${formattedInstallmentDate}</p>
                            `;
                        paymentPlanorFullElement.innerHTML += installmentHTML;
                    }

                    waitElement('.btn-dark.button-element p').then(x => {
                        x.innerText = `Pay ${formatNumberWithCommas(dueAmount)}`
                    });

                    invObject["dueAmount"] = dueAmount;
                    invObject['instDueDates'] = installments > 1 ? installmentDates.reduce((acc, date, index) => {
                        acc[index + 1] = date;
                        return acc;
                    }, {}) : {};
                    console.log("hfgsdhgf");
                    console.log({ invObject });
                    // console.log(invoiceItems);
                    let finalInvoiceObject = {
                        ...invObject,
                        items: [...Object.values(invoiceSelectedItems)],
                    };
                    console.log(finalInvoiceObject);
                    let f = JSON.stringify(finalInvoiceObject);
                    setFieldValue("product_items", `${f}`);
                    waitElement(".totals").then((t) => {
                        function updateDueAmount() {
                            const dueElement = document.querySelector(
                                ".totalContainer .totals .due-now .DuesNow"
                            );
                            setTimeout(() => {
                                if (dueElement) {
                                    console.log("Updated dueAmount:", dueAmount);
                                    dueElement.textContent = formatNumberWithCommas(dueAmount);
                                }
                            }, 1000);
                        }
                        updateDueAmount();
                    });

                    setFieldValue("due_amount", dueAmount);
                } else {
                    console.warn(
                        "Element with selector '.booking-info .paymentPlanorFull' not found."
                    );
                }
                function totalSection() {
                    setTimeout(() => {
                        const finalElement = document.querySelector(
                            ".totals .total .finalTotal"
                        );
                        setFieldValue("initial_payment", finalAmount);
                        const finalDiscount = document.querySelector(
                            ".booking-info .totalContainer .totals .finalDiscount"
                        );

                        if (finalElement || finalDiscount) {
                            finalElement.textContent = `${formatNumberWithCommas(finalAmount)}`;
                            finalDiscount.textContent = `${formatNumberWithCommas(
                                discountAmount
                            )}`;
                        }
                    }, 1000);
                }
                updateInvoiceAmount(dueAmount);
            })
        }

        calculateInvoice = debounce(calculateInvoice, 500);

        function mainhandler() {



            waitElement("#payment-donation .payment-suggestion-tag-container").then(
                (x) => {
                    x.click();
                }
            );

            if (!jqueryLoaded) {

            } else {
                executeTriggers();
            }


            setFieldValue("nearest_base_location", nearestLocation.loc || "");


            setFieldValue("no_of_photographer", countPhotoGrapher);
            setFieldValue("no_of_videographer", countVideographer);






            const readContract = document.querySelector(".read_contract");

            if (readContract) {
                readContract.onclick = function () {
                    waitElement("div#hl_main_popup.popup-body").then(() => {
                        const contractAgree = document.querySelector(".contract_agree");

                        const termsAndConditions = document.querySelector(
                            '[data-q="terms_and_conditions"]'
                        );

                        document.querySelectorAll(".contract_name p").forEach(contractDeal => {
                            contractDeal.innerText = replaceContract(contractDeal.innerText);
                        })

                        document.querySelectorAll(".contractwedding_date p").forEach(contractDeal => {
                            contractDeal.innerText = contractDeal.innerText.replaceAll('[wedding_date]', formattedWeddingDate);
                        })



                        const date = new Date();
                        const options = {
                            weekday: 'short', // Abbreviated weekday
                            month: 'short',   // Abbreviated month
                            day: 'numeric',   // Day as number
                            year: 'numeric'   // Full year
                        };
                        const formattedDate = date.toLocaleDateString('en-US', options);

                        document.querySelectorAll(".contractissue_date p").forEach(contractDeal => {
                            contractDeal.innerText = contractDeal.innerText.replaceAll('[contractissue_date]', formattedDate);
                        })





                        if (!contractAgree) {
                            return;
                        }

                        if (!termsAndConditions) {
                            return;
                        }



                        contractAgree.addEventListener("click", function () {
                            if (termsAndConditions) {
                                termsAndConditions.checked = true;
                            }

                            $('.closeLPModal').trigger('click');

                        });
                    });
                };
            }
            function appendElementsToTarget(sourceElement, targetSelector) {
                const targetElement = document.querySelector(targetSelector);

                if (targetElement && sourceElement instanceof HTMLElement) {
                    targetElement.appendChild(sourceElement);
                } else {
                    console.error("Source or target element is invalid.", {
                        sourceElement,
                        targetSelector,
                        targetElement,
                    });
                }
            }

            function setTermsAndConditionAndButton() {
                const termsAndConditions = document.querySelector(
                    '[data-q="terms_and_conditions"]'
                );
                let paymentButton = document.querySelector(
                    ".Payment_left_form button.btn.btn-dark.button-element"
                );
                if (paymentButton) {
                    paymentButton = paymentButton.closest(
                        ".col-12.menu-field-wrap.form-field-wrapper"
                    );
                }

                if (!termsAndConditions || !paymentButton) {
                    console.error(
                        "Either terms_and_conditions or paymentButton elements were not found."
                    );
                    return;
                }

                const parentElement1 = termsAndConditions.closest(
                    ".col-12.menu-field-wrap.form-field-wrapper"
                );
                const parentElement2 = paymentButton.closest(
                    ".col-12.menu-field-wrap.form-field-wrapper"
                );
                //parentElement2.style.width = "100%";

                if (!parentElement1 && parentElement2) {
                    console.error(
                        "No parent with the specified class was found for terms_and_conditions."
                    );
                    return;
                }


                waitElement("div.terms_conditions").then((target) => {
                    appendElementsToTarget(parentElement1, "div.terms_conditions");
                });

                setTimeout(() => {
                    waitElement("div.total_pay_now").then((target) => {
                        appendElementsToTarget(parentElement2, "div.total_pay_now");
                    });
                }, 500);
            }

            waitElement('.ghl-payment-element').then(p => {
                setTermsAndConditionAndButton();
            })








            if (packageId.id && packageId.product) {

                let noofextras = ``;
                let extraAmount = 0;
                fetch(
                    mainAPIURL(activePhotographer.product, activePhotographer.id),
                    headers
                ).then((res) => res.json())
                    .then(x => {
                        if (x.amount) {
                            if (countPhotoGrapher > 1) {
                                extraAmount += (countPhotoGrapher - 1) * x.amount;
                                noofextras += `${pluralize(countPhotoGrapher, 'Photographer')}`
                            }
                        }
                        fetch(
                            mainAPIURL(activeVideographer.product, activeVideographer.id),
                            headers
                        ).then((res) => res.json()).then(x => {
                            if (x.amount) {
                                if (countVideographer > 1) {
                                    extraAmount += (countVideographer - 1) * x.amount;
                                    if (noofextras != '') {
                                        noofextras += " | ";
                                    }
                                    noofextras += `${pluralize(countVideographer, 'Videographer')}`;
                                }
                                fetch(
                                    mainAPIURL(packageId.product, packageId.id),
                                    headers
                                ).then((res) => res.json()).then(price => {

                                    if (price.product) {
                                        SubtotalPricePackage = (price.amount || 0) + extraAmount;

                                        invoiceSelectedItems[packageId.id] = {
                                            title: selectedPackage,
                                            description: noofextras,
                                            price: SubtotalPricePackage,
                                            quantity: 1,
                                            totalPrice: parseNumber(SubtotalPricePackage),
                                        };


                                        let productPrice = formatNumberWithCommas(parseNumber(SubtotalPricePackage, true), 0)
                                        if (noofextras != '') {
                                            noofextras = `<br/><small>${noofextras}</small>`;
                                        }
                                        packageItemInfo = `<tr>
                            <td>${selectedPackage}${noofextras}</td>
                            <td>1</td>
                            <td class="packagePrice">${productPrice}</td>
                            <td class="addtoTotal packagePrice">${productPrice}</td>
                        </tr>`;

                                        setPaymentDetails();
                                    }

                                })
                            }
                        }).catch(t => {

                        })
                    })
                    .catch(x => {

                    })


            }

            let packageItemInfo = "";






            function setPaymentDetails() {
                waitElement(".payment_details").then((detail) => {
                    const myKeyValuePair = {
                        initial_venue_date: "initial_venue_date",
                        payment_discounts: "discountsEvent",
                        due_amount: "dueAmount",
                        initial_payment: "-",
                        user_data_detail: "-",
                        wedding_package: "activeChosePackage",
                        wedding_service: "activeService",
                        product_items: "product_items",
                    };

                    for (let [key, localStorageKey] of Object.entries(myKeyValuePair)) {
                        setFieldValue(key, getLocalStorageValue(localStorageKey));
                    }

                    milePriceCount(); // Call the function to update miles and milesPrice

                    // After milesPrice is calculated, build the custom HTML with the values
                    const fullName = userData.full_name;
                    const email = userData.email;
                    const fullAddress = userData.full_address;
                    const paymentPlanDes = discount > 0 ? payinFull : "Installment Plan"; // Assuming you have the logic to calculate this

                    const verticalInner = detail.querySelector(".vertical.inner");

                    let milesPriceTag = '';
                    if (miles > 0 && milesPrice > 0) {
                        milesPriceTag = ` <p><span>Travel Fee</span> <span class="miles">$${milesPrice}</span></p>`

                    }


                    const customHtml = `
        <div class="booking-info">
            <h1 class="header">Booking Info</h1>
          <div class="section">
            <div class="left weddingDate">
              <p><span>Wedding Date</span><br>${formattedWeddingDate}</p>
            </div>
            <div class="right">
              <p><span>Venue</span></p>
              <p>${fullAddress}</p>
            </div>
          </div>
          <div class="section">
            <div class="left paymentPlanorFull">
              <p><span>Due Date:</span><br><span class="payment"></p>
            </div>
            <div class="right">
              <p><span>Billed To:</span><br>${fullName}<br>${email}</p>
            </div>
          </div>
          <div class="section">
            <div class="left">
              <p><span>Invoice No.:</span><br>INV-${customerId}</p>
            </div>
            <div class="right">
              <p><span>Payment Plan:</span><br><span class="PaymentPlans">${paymentPlanDes}</span></p>
            </div>
          </div>
          <hr style="border: 1px solid #ccc; margin: 20px 0;">
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price Per</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody class="items_details">
              ${packageItemInfo}
              
            </tbody>
          </table>
          <hr style="border: 1px solid #ccc; margin: 20px 0;">
          <div class="totalContainer">
          <div class="totalLeft">
      
          </div>
              <div class="totals">
                
      
             <p><span>Subtotal:</span> <span class="subtotal"></span></p>
             ${milesPriceTag}
             <p class="discountsTag"><span class="discountF"><span>Discounts:</span><span class="discountType">Pay in full</span> </span><span class="finalDiscount">${discountAmount}</span></p>
             <p class="total"><span>Total:</span> <span class="finalTotal">${totalAfterDisc}</span></p>
             <p class="due-now"><span>Due Now:</span> <span class="DuesNow">${formatNumberWithCommas(dueAmount)}</span></p>
             </div>
           </div>
        </div>
        `;

                    if (isWeekDay) {
                        waitElement('.discountType').then(x => {
                            x.innerText = 'Weekday';
                        })
                    }

                    let already = document.querySelector('.booking-info');
                    if (!already) {
                        const container = document.createElement("div");
                        container.innerHTML = customHtml;

                        verticalInner.appendChild(container);

                        waitElement("tbody.items_details")
                            .then((appendTDExtras) => {
                                if (extrasData && Array.isArray(extrasData)) {
                                    let uniqueData = {};

                                    if (signatureExtras.id && signatureExtras.product) {
                                        extrasData.unshift(signatureExtras);
                                    }

                                    extrasData.forEach((extra, i) => {
                                        let prefix = extra.p ?? "";
                                        let selector = extra.id + prefix;
                                        let isNotAlready = uniqueData[selector] || null;

                                        if (!isNotAlready) {
                                            const tr = document.createElement("tr");
                                            tr.dataset.id = selector;
                                            fetch(
                                                mainAPIURL(extra.product, extra.id),
                                                headers
                                            ).then((res) => res.json()).then(price => {


                                                if (price.product) {
                                                    uniqueData[selector] = 1;
                                                    let title = price.name || price.title;
                                                    let titlelower = title.toLowerCase();

                                                    // let isExtraPhoto = titlelower.includes('extra') && titlelower.includes('photographer');
                                                    // let isExtraVideo = titlelower.includes('extra') && titlelower.includes('videographer');
                                                    let qty = parseInt(extra.qty || 1);
                                                    if (titlelower.includes('extra') && (titlelower.includes('photographer') || titlelower.includes('videographer'))) {
                                                        title += `(${pluralize(qty, 'Hour')})`;

                                                        // if (prefix!='') {
                                                        //     title += " " + extra.p.trim();
                                                        // }
                                                        //qty += countPhotoGrapher;
                                                    }

                                                    const titleTD = document.createElement("td");
                                                    if (prefix != '') {
                                                        title = title.replaceAll('Other', prefix);
                                                    }
                                                    titleTD.innerHTML = `${title}<br>
                                <small>${price.description || ""}</small>`;
                                                    tr.appendChild(titleTD);

                                                    const quantityTD = document.createElement("td");
                                                    quantityTD.textContent = qty;
                                                    tr.appendChild(quantityTD);
                                                    let subtotal = price.amount || price.price;
                                                    const priceTD = document.createElement("td");
                                                    priceTD.textContent = `${formatNumberWithCommas(subtotal, 0)}`;
                                                    tr.appendChild(priceTD);
                                                    let total = subtotal * qty;
                                                    // if (isExtraPhoto) {
                                                    //     total *= countPhotoGrapher;
                                                    // }
                                                    // if (isExtraVideo) {
                                                    //     total *= countVideographer;
                                                    // }
                                                    const totalTD = document.createElement("td");
                                                    totalTD.classList.add("addtoTotal");
                                                    totalTD.textContent = `${formatNumberWithCommas(total, 0)}`;
                                                    tr.appendChild(totalTD);

                                                    invoiceSelectedItems[selector] = {
                                                        id: extra.id,
                                                        description: price.description,
                                                        title: title,
                                                        price: subtotal,
                                                        quantity: qty,
                                                        totalPrice: total,
                                                        selector
                                                    };
                                                    console.log(invoiceSelectedItems);

                                                }
                                                if (i == extrasData.length - 1) {
                                                    calculateInvoice();
                                                }
                                            })
                                            appendTDExtras.appendChild(tr);

                                            if (i == extrasData.length - 1) {
                                                const rows1 = Array.from(appendTDExtras.querySelectorAll("tr"));
                                                const sortedRows1 = rows1.sort((a, b) => {
                                                    const aId = a.dataset.id || '';
                                                    const bId = b.dataset.id || '';
                                                    return aId.localeCompare(bId);
                                                });
                                                sortedRows1.forEach(row => appendTDExtras.appendChild(row));
                                            }

                                        }


                                    });



                                    setTimeout(calculateInvoice, 500);
                                } else {
                                    console.error("Invalid or missing SelectedExtra data.");
                                }




                            })
                            .catch((err) => {
                                console.error("Error waiting for .items_details:", err);
                            });
                    }

                });
            }




            let subTotal = null;

            waitElement(`[for*="terms_and_conditions"]`).then((x) => {
                x.innerText = replaceContract(x.innerText);
                x.onclick = function () {
                    let dom = document.querySelector('[id*="terms_and_conditions"][type="checkbox"]');
                    dom.checked = !dom.checked;
                    dom.dispatchEvent(new Event('change'));
                };
            });
        }
        document.addEventListener("hydrationDone", function (e) {
            setTimeout(mainhandler, 1500);
        });
        mainhandler();

        function getLocalStorageValue(key) {
            const value = localStorage.getItem(key);

            if (value === null) {
                return null;
            }
            return value;
        }

        function formatDateToCustomFormat(dateString) {
            const dateObj = new Date(dateString);

            if (isNaN(dateObj)) {
                console.error("Invalid date provided");
                return null;
            }

            return new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }).format(dateObj);
        }

        let miles = 0;
        let milesPrice = 0;

        function milePriceCount() {
            const totalgrapher = countPhotoGrapher + countVideographer;
            weddingDate = formatDateToCustomFormat(weddingDate);
            milesPrice = 0; // Reset milesPrice
            try {
                miles = nearestLocation.miles; // Update global miles variable
                let travelFee = parseFloat('{{ custom_values.travel_fee_miles }}');
                travelFee = isFinite(travelFee) ? travelFee : 0;
                let freeMiles = parseInt('{{ custom_values.travel_free_miles }}');
                freeMiles = isFinite(freeMiles) ? freeMiles : 30;
                if (miles > freeMiles) {
                    milesPrice = (miles - freeMiles) * totalgrapher * travelFee; // Calculate milesPrice based on distance
                }
            } catch (error) {
                console.log("Miles Error", error)
            }
            setFieldValue("total_distance_miles", `Miles (${miles}): ${formatNumberWithCommas(milesPrice)}`);
        }
        function setFieldValue(key, val = "") {
            waitElement(`input[data-q="${key}"],textarea[data-q="${key}"]`).then(
                (input) => {
                    const row = input.closest(".menu-field-wrap");
                    if (row) {
                        row.style.display = "none";
                    }
                    input.type = "hidden";
                    input.value = val;
                    input.dispatchEvent(new Event("input"));
                }
            );
        }
        waitElement(`#error-container`).then(x => {

            if (x) {
                x.style.marginTop = "-30px";
                x.style.position = "absolute"
            }
        });
    })();
