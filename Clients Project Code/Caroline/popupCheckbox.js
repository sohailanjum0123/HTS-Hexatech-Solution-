(() => {
    function waitElement(selector) {
      return new Promise((resolve, reject) => {
        let elm = document.querySelector(selector);
        if (elm) {
          resolve(elm);
          return;
        }
        const observer = new MutationObserver(() => {
          let elm = document.querySelector(selector);
          if (elm) {
            observer.disconnect();
            resolve(elm);
          }
        });
        observer.observe(document, { subtree: true, childList: true });
      });
    }
    function showPopup() {
        const productDetails = document.querySelectorAll(
          ".product-detail .product-description div.item-description strong"
        );
        let ChosePlan = localStorage.getItem("selectedPlan");
        if (ChosePlan == "lightAnnualyPlan") {
          console.log("lightAnnualyPlan");
        }
        if (ChosePlan == "lightMonthlyPlan") {
          console.log("lightMonthlyPlan");
        }
        if (ChosePlan == "monthlyPremiumPlan") {
          console.log("monthlyPremiumPlan");
        }
        if (ChosePlan == "annualPremiumPlan") {
          console.log("annualPremiumPlan");
        }
        if (productDetails.length > 0) {
          productDetails.forEach((detail) => {
            detail = detail.closest('.product-description');
              if(detail){
                  detail.style.display = "none"
              }
          });
        } else {
          console.log("No matching elements found.");
        }
    }
  
    waitElement(".show").then(() => {
      showPopup();
    });
  
    function selectedButtonPlaninLS() {
      const selectbuttonsPlan = document.querySelectorAll("button");
      selectbuttonsPlan.forEach((selectedButton) => {
        if (selectedButton) {
          selectedButton.addEventListener("click", (e) => {
            let targetElement = e.target;
  
            const selectors = [
              "lightAnnualyPlan",
              "lightMonthlyPlan",
              "monthlyPremiumPlan",
              "annualPremiumPlan",
            ];
            let parentEle = selectors.find((selector) =>
              targetElement.closest(`.${selector}`)
            );
  
            if (parentEle) {
              localStorage.setItem("selectedPlan", parentEle);
              console.log(`Parent Selector: ${parentEle}`);
            } else {
              console.log("No matching parent found");
            }
          });
        }
      });
    }
    selectedButtonPlaninLS();
  })();