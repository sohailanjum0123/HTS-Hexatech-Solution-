/*
<style>
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
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 15px;
        background: #f9f9f9;
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
        margin-bottom: 5px;
    }

    .select-button:hover {
        background-color: #116077;
    }

    .select-button,
    .added-button {
        background-color: white;
        color: black;
        border: 2px solid #1160773d;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .select-button:hover,
    .added-button:hover {
        background-color: #116077;
        color: white;
        transition: ease 0.5s;
    }

    .added-button {
        background-color: #116077;
        color: white;
    }

    .added-button:hover {
        background-color: #116077;
    }

    .hide {
        display: none !important;
    }
</style>*/


    function initMap() {

    }


    (() => {
        let calendarId = "{{ custom_values.booking_calendar_id }}";
        let weddingDatekey = "initial_venue_date";
        let baseLocations = {
            "Orlando": {
                "zip": "32839",
                "address": "1320 40th St, Orlando, FL 32839",
                "lat": 28.4889021,
                "lng": -81.4114142
            },
            "Naples": {
                "zip": "34120",
                "address": "590 Golden Gate Blvd W, Naples, FL 34120",
                "lat": 26.3369801,
                "lng": -81.5815776
            },
            "Miami": {
                "zip": "33131",
                "address": "168 SE 1st St STE 501, Miami, FL 33131",
                "lat": 26.3369801,
                "lng": -81.5815776
            },
            "West Palm Beach": {
                "zip": "33407",
                "address": "5070 Marion Place, West Palm Beach, FL 33407",
                "lat": 26.3369801,
                "lng": -81.5815776
            },
            "Tallahassee": {
                "zip": "32301",
                "address": "2132 Atchena Nene, Tallahassee, FL 32301",
                "lat": 30.4305062,
                "lng": -84.25421949999999
            },
            "Jacksonville": {
                "zip": "32218",
                "address": "11472 Daytona Court, Jacksonville, FL 32218",
                "lat": 30.4686832,
                "lng": -81.6692532
            },
            "Tampa": {
                "zip": "33602",
                "address": "902 W Columbus Dr, Tampa, FL 33602",
                "lat": 27.9552692,
                "lng": -82.4563199
            }
        }
        let selectedVenue = localStorage.getItem('selectedVenue') || "";
        let currentLatLng = localStorage.getItem("locationLatLng") ?? "{}";
        currentLatLng = JSON.parse(currentLatLng);
        function calculateDistanceMiles() {

            
            if (currentLatLng.lat && currentLatLng.lng) {
                let nearestPosition = { miles: 0, loc: "" };
                (async () => {
                    for (let [k, v] of Object.entries(baseLocations)) {
                        let distance = await findDistance(v, { address: selectedVenue });
                        console.log(distance);
                        if (nearestPosition.loc == "" || parseFloat(distance) < parseFloat(nearestPosition.miles)) {
                            nearestPosition.loc = k;
                            nearestPosition.miles = distance;
                        }
                        console.log({ nearestPosition });
                    }
                    localStorage.setItem("nearestLocation", JSON.stringify(nearestPosition));
                })();

            }
        }
        (() => {
            var script = document.createElement("script");
            script.src = "https://maps.googleapis.com/maps/api/js?key={{ custom_values.gmap_api_key }}&libraries=places&callback=initMap";
            script.async = true;
            document.head.appendChild(script);
            script.onload = function () {

                calculateDistanceMiles()
            };
        })();
        (() => {
            var script = document.createElement("script");
            script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            script.async = true;
            document.head.appendChild(script);
            script.onload = function () {
                console.log("jQuery has been loaded successfully!");
                executeTriggers();
            };
        })();


        function addPaddingToParentWithHideClass() {
            const hideElements = document.querySelectorAll('.hide');

            if (hideElements) {
                hideElements.forEach(hideElem => {
                    const parent = hideElem.closest('.date1, .date2, .date3');
                    if (parent) {
                        parent.style.paddingTop = '70px';
                    }
                });
            }

        }

        var discountsEvent = 0;

        function discountEventSetup() {
            const discountElemtfound = document.querySelectorAll(".date1.active, .date2.active, .date3.active");

            discountElemtfound.forEach((foundhide) => {
                const hideElem = foundhide.querySelector('.hide');
                if (hideElem) {
                    discountsEvent = 0;
                } else {
                    discountsEvent = 0.2;
                }
                localStorage.setItem('discountsEvent', discountsEvent);
            });
        }

        function findDistance(orig, dest) {

            return new Promise((res, rej) => {
                function getLocation(re) {
                    return parseFloat(re).toFixed(5)
                }
                const distanceMatrixService = new google.maps.DistanceMatrixService();
                const origin = orig.address;//new google.maps.LatLng(getLocation(orig.lat), getLocation(orig.lng));
                const destination = dest.address;// google.maps.LatLng(getLocation(dest.lat), getLocation(dest.lng));

                // Call the DistanceMatrixService to get the distance and duration
                distanceMatrixService.getDistanceMatrix(
                    {
                        origins: [origin],
                        destinations: [destination],
                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (response, status) => {
                        console.log(response, status);
                        if (status === 'OK') {
                            let elem = response.rows[0].elements[0];
                            try {
                                const distance = elem.distance.text;
                                const distanceInMeters = response.rows[0].elements[0].distance.value; // Distance in meters
                                const distanceInMiles = (distanceInMeters / 1609.34).toFixed(2); // Convert meters to miles (1 mile = 1609.34 meters)

                                const duration = elem.duration.text;
                                console.log(distance, duration, distanceInMiles);
                                res(distanceInMiles);
                            } catch (error) {
                                rej(error);
                            }

                        } else {
                            console.error('Error:', status);
                        }
                    }
                );
            })


        }


        let currentCustomer = localStorage.getItem("_ud") ?? "{}";
        currentCustomer = JSON.parse(currentCustomer);
        /* let baseLocations = {
             Orlando: {
                 zip: "32839",
                 lat: "51.847864200000004",
                 lng: "9.051388324876534",
             },
             Naples: {
                 zip: "34120",
                 lat: "41.011444850000004",
                 lng: "28.971255312987296",
             },
             Tallahassee: {
                 zip: "32301",
                 lat: "15.656311233333334",
                 lng: "-85.99260813333333",
             },
             Jacksonville: {
                 zip: "32218",
                 lat: "30.46844200107991",
                 lng: "-81.64994234298057",
             },
             Tampa: {
                 zip: "33602",
                 lat: "52.022857200000004",
                 lng: "8.533584902232988",
             },
         };*/



        let currentDate = localStorage.getItem(weddingDatekey) || currentCustomer[weddingDatekey] || "";
        console.log(currentDate);
        function executeTriggers() {
            $(".date-1.c-column").addClass("border active");
            $("body").off("click", '[class*="date"].c-column')
            $("body").on("click", '[class*="date"].c-column', function (t) {
                $('[class*="date"].c-column').removeClass("border active");
                $(this).addClass("border active");
                let date = $(this).data("date");
                setSelectedDate(date);
            });
            $(".current_date p").each(function () {
                var content = $(this).html();
                var newContent = content.replace("[date]", formatDate(currentDate));
                $(this).html(newContent);
            });
            
        }
        document.addEventListener("hydrationDone", function (e) {
            setTimeout(executeTriggers, 1000);
            setTimeout(executeTriggers, 2000);
            setTimeout(checkAvailability, 1000);
            
        });
        function showBlock(clas) {
            $(clas).show();
            $(clas).removeClass("hide");
        }
        async function fetchAvailability(currentDate) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const todayDate = new Date();

            let startDate = new Date(currentDate);
            // const thirtyDaysLater = new Date();
            // thirtyDaysLater.setDate(todayDate.getDate() + 30);
            // if (isNaN(startDate) || startDate < thirtyDaysLater) {
            //     startDate = thirtyDaysLater;
            // }
            const endDate = new Date(currentDate);
            endDate.setDate(startDate.getDate() + 30);
            console.log({startDate:startDate.toLocaleDateString(),endDate:endDate.toLocaleDateString()})

            const startDateTimestamp = startDate.getTime();
            const endDateTimestamp = endDate.getTime();
            try {
                const response = await fetch(
                    `https://backend.leadconnectorhq.com/appengine/appointment/free-slots?calendar_id=${calendarId}&startDate=${startDateTimestamp}&endDate=${endDateTimestamp}&timezone=${userTimezone}&sendSeatsPerSlot=false`
                );
                const data = await response.json();

                return data;
            } catch (error) {
                console.error("Error fetching availability:", error);
                return {};
            }
        }
        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        let availability = {};
        function checkAvailability() {
            (async () => {
                availability = await fetchAvailability(currentDate);

                if (Object.keys(availability).length == 0) {
                } else {
                    $(".checking_availability").hide();
                    let isAavailable = availability[currentDate] ?? null;
                    if (isAavailable) {
                        showBlock(".available");
                        setSelectedDate(currentDate);
                    } else {
                        let availableDates = getAvailableDates(Object.keys(availability));

                        console.log(availableDates);
                        availableDates.first3Dates.forEach((date, index) => {
                            let cIndex = index + 1;
                            let discountElem = $(`.datediscount${cIndex}`);
                            let column = `.date${cIndex}.c-column`;
                            $(column).attr("data-date", date);
                            let dateColumnDay = $(`${column} .day strong`);
                            let dateColumnDate = $(`${column} .date p`);

                            if (availableDates.weekdays.includes(date)) {
                                $(discountElem).removeClass("hide");
                            } else {
                                $(discountElem).addClass("hide");
                            }
                            setTimeout(() => {
                                addPaddingToParentWithHideClass();
                            }, 50)

                            const date1 = new Date(date);
                            const dayOfWeek = date1.getDay();

                            const dayName = dayNames[dayOfWeek];
                            dateColumnDay.text(dayName);
                            dateColumnDate.text(formatDate(date));
                            if (index == 0) {
                                setSelectedDate(date);
                            }
                        });
                        showBlock(".unavailable");
                    }
                }
            })();
        }

        
        function setSelectedDate(date) {
            $(".selectedDate  .main-heading-button").html(
                "reserve " + formatDate(date)
            );
            discountEventSetup();
            localStorage.setItem(weddingDatekey, date);
            localStorage.setItem(weddingDatekey + "full", availability[date].slots[0]);
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

        function getAvailableDates(dates) {

            let weekdays = [];
            let weekends = [];

            const validDates = dates.filter((date) => !isNaN(Date.parse(date)));

            const first3Dates = validDates.slice(0, 3);


            first3Dates.forEach((dateStr) => {
                const date = new Date(dateStr);
                const dayOfWeek = date.getDay();

                if (dayOfWeek >= 1 && dayOfWeek <= 4) {
                    weekdays.push(dateStr);
                } else if ((dayOfWeek >= 5 && dayOfWeek <= 6) || dayOfWeek == 0) {
                    weekends.push(dateStr);
                }
            });

            return {
                first3Dates,
                weekdays,
                weekends,
            };
        }

        
    })()
