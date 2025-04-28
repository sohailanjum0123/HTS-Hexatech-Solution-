
    function mainScript() {
        const mapapiKey = "{{ custom_values.gmap_api_key }}";
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
        (() => {
            var script = document.createElement("script");
            script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            script.async = true;
            document.head.appendChild(script);
            script.onload = function () {
                console.log("jQuery has been loaded successfully!");
                datepickerInit();
            };
        })();
        let searchcontainer = ".search-container";
        let dateContainer = ".date-container";
        let infocontainer = ".info-container";
        let venuePicker = ".venue_address";
        let venue_date = "venue_date";
        let venue_info = "venue_info";

        waitElement(searchcontainer).then((x) => { });
        waitElement(venuePicker).then((x) => {
            document.querySelectorAll(".appendfield").forEach((t) => {
                let key = t.getAttribute("data-key");
                let field = document.querySelector(`[data-q="${key}"]`);
                if (field) {
                    t.appendChild(field);
                }
            });

            setTimeout(function () {
                document.querySelectorAll(infocontainer + " input").forEach((x) => {
                    x.classList.add("infofield");
                });
            }, 500);

            x.onclick = function () {
                hideDropdowns();
                hideIt(this, true);
                showToggle(searchcontainer);
                document.querySelector(searchcontainer + " input").focus();
            };
        });

        waitElement("." + venue_date).then((x) => {
            x.onclick = function () {
                hideDropdowns();
                toggleDropdownPicker(dateContainer, true);
                $(dateContainer + " input").datepicker("show");
            };
        });
        waitElement(".date_checker").then((x) => {
            document.querySelectorAll(".date_checker").forEach((p) => {
                p.onclick = function () {
                    let form = document.querySelector(".wedding_init_form  button");
                    if (form) {
                        form.click();
                    }
                    setTimeout(() => {
                        let errors = [...document.querySelectorAll("#error-container")].map(
                            (t) => t.innerText
                        );
                        if (errors.length > 0) {
                            errors = errors.join("<br/>");
                            Swal.fire({
                                title: "Oops!",
                                html:
                                    '<strong>Error:</strong> Something went wrong. <br> Please check the fields and try again. <br><br> <span style="color:red;">Note: Following fields are required!</span><br/>' +
                                    errors,
                                confirmButtonText: "Try Again",
                            });
                        }
                    }, 500);
                };
            });
        });
        function showToggle(selector) {
            setTimeout(() => {
                toggleDropdownPicker(selector, true);
            }, 500);
        }
        waitElement("." + venue_info).then((x) => {
            x.onclick = function () {
                hideDropdowns();
                showToggle(infocontainer);
            };
        });


        function hideDropdowns() {
            $(".dropdown.visible").removeClass("visible");
            $(".venue_info_data").removeClass("hide");
            var combinedText = $(".infofield")
                .map(function () {
                    return $(this).val().trim();
                })
                .get()
                .filter((t) => t);
            if (combinedText.length > 0) {
                combinedText = combinedText.join(", ");
            } else {
                combinedText = "Your info...";
            }

            $(".venue_info").text(combinedText);
        }
        function validateEmail(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        }

        function formatDateYYY(dateText) {
            const date = new Date(dateText);
            const year = date.getFullYear().toString(); // Get last 2 digits of the year
            const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month in 2 digits
            const day = ('0' + date.getDate()).slice(-2); // Get day in 2 digits
            return `${year}-${month}-${day}`;
        }
        function datepickerInit() {
            $(document).click(function (event) {
                if (!$(event.target).closest(".dropdown").length) {
                    hideDropdowns();
                }
            });

            $("body").on("blur", ".infofield1", function () {
                let key = $(this).attr("name");
                let value = $(this).val().trim();

                let field = document.querySelector(`[data-q="${key}"]`);
                if (field) {
                    field.value = value;
                    field.dispatchEvent(new Event("input"));
                    field.dispatchEvent(new Event("keyup"));
                    field.dispatchEvent(new Event("keyup"));
                }
                console.log(key, value);

                setFormData(key, value);
            });
            var script = document.createElement("script");
            script.src = "https://code.jquery.com/ui/1.14.1/jquery-ui.js";
            script.async = true;
            document.head.appendChild(script);
            script.onload = function () {
                $(`[data-q="wedding_date"]`).datepicker({
                    minDate: +30,
                    maxDate: "+3Y",
                    onSelect: function (dateText) {
                        $(`.${venue_date}`).text(formatDate(dateText));
                        setValue('[data-q="wedding_date"]', dateText);
                        localStorage.setItem('initial_venue_date', formatDateYYY(dateText));
                        $('[data-q="wedding_date"]').trigger("input");
                        setFormData("wedding_date", dateText);
                    },
                });
            };
        }
        function setFormData(key, value) {
            formData[key] = value;

            localStorage.setItem("formData", JSON.stringify(formData));
        }
        function formatDate(date) {
            if (typeof date == "string") {
                date = new Date(date);
            }
            const options = { year: "numeric", month: "short", day: "numeric" };
            let day = date.getDate();

            let suffix = "th";
            if (day === 1 || day === 21 || day === 31) {
                suffix = "st";
            } else if (day === 2 || day === 22) {
                suffix = "nd";
            } else if (day === 3 || day === 23) {
                suffix = "rd";
            }

            const formattedDate = date.toLocaleDateString("en-US", options);

            return formattedDate.replace(day, `${day}${suffix}`);
        }

        function hideIt(selector, status = false) {
            let elem = selector;
            if (typeof selector == "string") {
                elem = document.querySelector(selector);
            }
            elem = elem.classList;
            if (status) {
                elem.add("hide");
            } else {
                elem.remove("hide");
            }
        }
        function toggleDropdown(show) {
            const dropdown = document.getElementById("dropdown");
            if (show) {
                dropdown.classList.add("visible");
            } else {
                hideIt(venuePicker, false);

                hideIt(searchcontainer, true);
                dropdown.classList.remove("visible");
            }
        }

        function toggleDropdownPicker(picker, show) {
            const dropdown = document.querySelector(picker);
            if (show) {
                dropdown.classList.add("visible");
            } else {
                dropdown.classList.remove("visible");
            }
        }

        function selectAddress(address) {
            const input = document.querySelector(".search-input");
            input.value = address;
        }

        let formData = {};


        var componentForm = {
            street_number: "short_name",
            route: "long_name",
            locality: "long_name",
            administrative_area_level_1: "short_name",
            country: "short_name",
            postal_code: "short_name",
        };
        let placeLatLng = null;
        let mapscript = document.createElement("script");
        mapscript.src = `https://maps.googleapis.com/maps/api/js?key=${mapapiKey}&libraries=places`;

        function pacSelectFirst(input) {
            let _addEventListener = input.addEventListener
                ? input.addEventListener
                : input.attachEvent;

            function addEventListenerWrapper(type, listener) {
                if (type == "keydown") {
                    var orig_listener = listener;
                    listener = function (event) {
                        var suggestion_selected =
                            document.querySelectorAll(".pac-item-selected").length > 0;
                        if (event.which == 13 && !suggestion_selected) {
                            let simulated_downarrow = $.Event("keydown", {
                                keyCode: 40,
                                which: 40,
                            });
                            orig_listener.apply(input, [simulated_downarrow]);
                        }

                        orig_listener.apply(input, [event]);
                    };
                }

                _addEventListener.apply(input, [type, listener]);
            }

            input.addEventListener = addEventListenerWrapper;
            input.attachEvent = addEventListenerWrapper;
            return input;
        }
        var e = document.createEvent("HTMLEvents");

        function setValue(sel, value) {
            if (typeof sel == "string") {
                sel = document.querySelector(sel);
            }
            if (sel) {
                sel.value = value;
                e.initEvent("input", true, true);
                sel.dispatchEvent(e);
            }
        }
        mapscript.onload = function () {
            function handlePlace(place, addressField) {
                var street = "";
                var address = document.querySelector('input[data-q="address"]');
                var city = document.querySelector('input[data-q="city"]');
                var state = document.querySelector('input[data-q="state"]');
                var country = document.querySelector('input[data-q="country"]');
                var postalCode = document.querySelector('input[data-q="postal_code"]');

                setValue(address, "");
                setValue(city, "");
                setValue(state, "");
                setValue(postalCode, "");
                setValue(country, "");
                let location = place.geometry.location;
                let latlng = {
                    lat: location.lat(),
                    lng: location.lng(),
                };


                let isStatematches = false;
                place.address_components.forEach((addressComp) => {
                    var addressType = addressComp.types[0];

                    //check geomtry lat long for finding distance
                    var val = addressComp[componentForm[addressType]] || "";
                    if (addressType == "street_number") {
                        street = val;
                    } else if (addressType == "route") {
                        street += " " + val;
                    } else if (addressType == "locality") {
                        setFormData("city", val);
                        setValue(city, val);
                    } else if (addressType == "administrative_area_level_1") {
                        if (['fl', 'florida'].includes(val.toLowerCase())) {
                            isStatematches = true;
                        }
                        setFormData("state", val);
                        setValue(state, val);
                    } else if (addressType == "postal_code") {
                        setFormData("postal_code", val);
                        setValue(postalCode, val);
                    } else if (addressType == "country") {
                        setFormData("country", val);
                        setValue(country, val);
                    }
                });

                if (!isStatematches) {
                    localStorage.removeItem("locationLatLng");
                    localStorage.removeItem("selectedVenue");
                    setValue(address, "");
                    setValue(city, "");
                    setValue(state, "");
                    setValue(postalCode, "");
                    addressField.value = '';
                    Swal.fire({

                        html:
                            'Sorry, we\'re currently only working in Florida',
                        confirmButtonText: "OK",
                    });
                    return;
                }
                let adr = place.formatted_address ?? street;
                localStorage.setItem("locationLatLng", JSON.stringify(latlng));
                localStorage.setItem("selectedVenue", adr);
                console.log('Place details:', place);
                console.log('Place name:', place.name);
                setFormData("street", street);

                setValue(address, street);

                document.querySelector(venuePicker).innerHTML =
                    adr;

                hideIt(searchcontainer, true);
                hideIt(venuePicker, false);

                setTimeout(function () {
                    document.querySelectorAll(".pac-container").forEach(x => {
                        x.style.display = "none";
                    })
                }, 1000);
            }



            function initmapField(name, type = 'address') {
                let addressField = document.querySelector('input[name="' + name + '"]');
                if (addressField) {
                    addressField = pacSelectFirst(addressField);
                    const autocompleteService = new google.maps.places.AutocompleteService();
                    let autocomplete = new google.maps.places.Autocomplete(addressField, {
                        componentRestrictions: {
                            country: ["us"],
                        },
                        fields: ["address_components", "formatted_address", "geometry"],
                        types: [type],/*address*/
                    });
                    const sessionToken = new google.maps.places.AutocompleteSessionToken();
                    autocomplete.addListener("place_changed", function () {
                        let place = autocomplete.getPlace();
                        handlePlace(place, addressField);
                    });

                    autocompleteService.sessionToken = sessionToken;
                }

            }
            initmapField('addressAuto');
            initmapField('establishmentAuto', 'establishment');

            $('body').off('change', '[name=autoAddressPicker]');
            $('body').on('change', '[name=autoAddressPicker]', function (e) {
                $('.addressSearch').hide();
                $('.venueSearch').hide();
                $(`.${this.value}Search`).show();
            });
            $('[name=autoAddressPicker]:checked').trigger('change');
        };


        document.head.append(mapscript);
    }

    document.addEventListener("hydrationDone", function (e) {
        setTimeout(mainScript, 1500);
    });
