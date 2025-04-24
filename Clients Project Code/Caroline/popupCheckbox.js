(() => {
  function waitElement(selector) {
    return new Promise((resolve, reject) => {
      if (!selector) {
        reject(new Error("Selector is not provided."));
        return;
      }

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

      try {
        observer.observe(document.body, { subtree: true, childList: true });
      } catch (error) {
        reject(new Error(`Error observing DOM: ${error.message}`));
      }
    });
  }

  function productsPlans() {
    waitElement(".product-description").then(() => {
      const checkbox = document.getElementById(
        "checkbox-cone-step-order-9SD3rAvBMk-6806865643f6b80d3b3103d6"
      );
      if (checkbox) {
        checkbox.checked = false;

        checkbox.dispatchEvent(new Event("change"));
      } else {
        console.warn("Checkbox not found with the given ID.");
      }
    });
    setTimeout(() => {
      const planMap = {
        lightAnnualyPlan: "6807f1150eb216011128be67",
        lightMonthlyPlan: "6806865643f6b80d3b3103d6",
        monthlyPremiumPlan: "6806866a2f19705746bd0f10",
        annualPremiumPlan: "6807f12d0eb21666ec28be68",
      };

      const chosenPlan = localStorage.getItem("selectedPlan");
      if (chosenPlan && planMap[chosenPlan]) {
        const planElement = document.getElementById(planMap[chosenPlan]);
        if (planElement) {
          applyDisplayStyles(planElement, ["grid", "block", "flex"]);
        } else {
          console.warn(`Element with ID '${planMap[chosenPlan]}' not found.`);
        }
      } else {
        console.warn(
          "No valid plan selected or plan does not exist in the map."
        );
      }
    }, 1000);
  }

  function applyDisplayStyles(element, styles) {
    let styleApplied = false;

    for (const style of styles) {
      try {
        element.style.display = style;
        if (getComputedStyle(element).display === style) {
          styleApplied = true;
          console.log(`Style applied successfully: ${style}`);
          break;
        }
      } catch (error) {
        console.warn(`Failed to apply style '${style}':`, error);
      }
    }

    if (!styleApplied) {
      console.error(
        `Failed to apply any of the styles: ${styles.join(", ")} to element.`,
        element
      );
    }
  }
  function selectedButtonPlaninLS() {
    const selectButtonsPlan = document.querySelectorAll("button");
    if (!selectButtonsPlan.length) {
      console.warn("No buttons found to attach event listeners.");
      return;
    }

    selectButtonsPlan.forEach((selectedButton) => {
      selectedButton.addEventListener("click", (e) => {
        const targetElement = e.target;

        const selectors = [
          "lightAnnualyPlan",
          "lightMonthlyPlan",
          "monthlyPremiumPlan",
          "annualPremiumPlan",
        ];

        const parentEle = selectors.find((selector) =>
          targetElement.closest(`.${selector}`)
        );

        if (parentEle) {
          localStorage.setItem("selectedPlan", parentEle);
          console.log(`Parent Selector: ${parentEle}`);
        } else {
          console.warn("No matching parent found for the button click.");
        }
      });
    });
  }
  waitElement(".PlansCards")
    .then((cards) => {
      console.log("PlansCards element found:", cards);
      selectedButtonPlaninLS();
    })
    .catch((error) => {
      console.error("Error waiting for PlansCards:", error);
    });

  const buttonClickHandler = document.querySelectorAll(".PlansCards button");
  buttonClickHandler.forEach((buttonclick) => {
    buttonclick.addEventListener("click", (e) => {
      waitElement(".show div#hl_main_popup")
        .then((popup) => {
          console.log("Popup element found:", popup);
          productsPlans();
        })
        .catch((error) => {
          console.error("Error waiting for Popup:", error);
        });
    });
  });
  // Call the function to mount the payment element
})();
