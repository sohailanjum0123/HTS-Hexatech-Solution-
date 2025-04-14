jQuery(document).ready(function ($) {
    var vin = findVin();
    var stock = findStock();

    if (vin !== "not_found") {
        getModelDataFromGlo3D(vin, stock);
    } else {
        getModelDataFromGlo3DStock(stock, null);
    }

    function findVin() {
        const vinElement = document.querySelector(".vin-container");
        if (vinElement) {
            const vin = vinElement.textContent.trim();
            console.log("vin:", vin);
            return vin || "not_found";
        } else {
            console.log("No vin data found on this page!");
            return "not_found";
        }
    }

    function findStock() {
        const stockElement = document.querySelector(".stock-container");
        if (stockElement) {
            const stock = stockElement.textContent.split(": ")[1]?.trim();
            console.log("stock:", stock);
            return stock || "not_found";
        } else {
            console.log("No stock data found on this page!");
            return "not_found";
        }
    }

    // The rest of your code remains unchanged
    function replaceDefaultImage(shortId) {
        let glo3dIFrame = document.createElement("iframe");
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", "glo3d-iframe-wrapper");
        glo3dIFrame.setAttribute(
            "src",
            `https://glo3d.net/iFrame/${shortId}?fitinteriortoexterior=true`
        );
        glo3dIFrame.setAttribute("frameborder", "0");
        glo3dIFrame.setAttribute("scrolling", "no");
        glo3dIFrame.setAttribute("allowfullscreen", "true");
        glo3dIFrame.setAttribute("loading", "lazy");
        glo3dIFrame.setAttribute("width", "100%");
        glo3dIFrame.setAttribute("height", "100%");
        glo3dIFrame.classList.add("glo3d-iframe-height");
        glo3dIFrame.setAttribute("id", "glo3d-iframe-content");
        wrapper.appendChild(glo3dIFrame);
        $(".gallery-top").replaceWith(wrapper);
        $(".swiper-button-prev").remove();
        $(".swiper-button-next").remove();
        $(".gallery-thumbs").remove();
        document.head.insertAdjacentHTML(
            "beforeend",
            `
            <style>
            @media all {
                .glo3d-iframe-height {
                    height: 850px;
                }
            }
            @media all and (min-width:321px) and (max-width: 480px) {
                .glo3d-iframe-height {
                    height: 350px;
                }
            }
            @media all and (min-width:0px) and (max-width: 320px) {
                .glo3d-iframe-height {
                    height: 250px;
                }
            }
            </style>
        `
        );
    }

    function getModelDataFromGlo3D(vin_number, stock) {
        console.log(36, vin_number);
        var data = {
            vin_number: vin_number,
            stock: stock,
            height: "400",
            url: window.location.href || "",
            hash: "L3QMxE5P9bbbb04DmYw9u3jPYMr2"
        };
        $.ajax({
            type: "POST",
            url: "https://us-central1-glo3d-c338b.cloudfunctions.net/vin",
            data: data,
            dataType: "json",
            error: function (request, status, error) {
                console.error(`Glo3d model not found!`);
                getModelDataFromGlo3DStock(stock, vin_number);
            },
        }).done(function (result) {
            console.log("Glo3d Result", result);
            if (!result.short_id || result.privacy === "private") {
                console.log(`glo3d model is private or not valid short_id`);
            }
            replaceDefaultImage(result.short_id);
        });
    }

    function getModelDataFromGlo3DStock(stock_number, vin) {
        console.log(36, stock_number);
        var data = {
            stock_number: stock_number,
            vin: vin,
            height: "400",
            url: window.location.href || "",
            hash: "L3QMxE5P9bbbb04DmYw9u3jPYMr2"
        };
        $.ajax({
            type: "POST",
            url: "https://us-central1-glo3d-c338b.cloudfunctions.net/stockNumber",
            data: data,
            dataType: "json",
            error: function (request, status, error) {
                console.error(`Glo3d model not found - stock!`);
            },
        }).done(function (result) {
            console.log("Glo3d Result", result);
            if (!result.short_id || result.privacy === "private") {
                console.log(`glo3d model with is private or not valid short_id`);
            }
            replaceDefaultImage(result.short_id);
        });
    }
});


