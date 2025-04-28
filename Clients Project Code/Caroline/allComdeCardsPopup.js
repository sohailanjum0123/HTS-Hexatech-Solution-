
document.addEventListener("hydrationDone", () => {
  setTimeout(() => {
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

const lightAnnualyPlan = document.querySelector(".lightAnnualyPlan");
const lightMonthlyPlan = document.querySelector(".lightMonthlyPlan");

const annualPremiumPlan = document.querySelector(".annualPremiumPlan");
const monthlyPremiumPlan = document.querySelector(".monthlyPremiumPlan");

const annualyPremiume = document.querySelector(".annualyPremiume");
const monthlyPremiume = document.querySelector(".monthlyPremiume");

const annualLight = document.querySelector(".annualLight");
const monthlyLight = document.querySelector(".monthlyLight");

const createToggleContainer = (toggleCallback) => {
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "toggle-container";

  const yearlyLabel = document.createElement("span");
  yearlyLabel.className = "toggle-label yearly";
  yearlyLabel.textContent = "Yearly";
  toggleContainer.appendChild(yearlyLabel);

  const monthlyLabel = document.createElement("span");
  monthlyLabel.className = "toggle-label monthly";
  monthlyLabel.textContent = "Monthly";
  toggleContainer.appendChild(monthlyLabel);

  const toggleCircle = document.createElement("div");
  toggleCircle.className = "toggle-circle";
  toggleContainer.appendChild(toggleCircle);

  yearlyLabel.addEventListener("click", () => {
    toggleCallback(true); 
  });

  monthlyLabel.addEventListener("click", () => {
    toggleCallback(false); 
  });

  return toggleContainer;
};

let isPremiumAnnually = true;
const togglePremiumPlans = (isAnnually) => {
  isPremiumAnnually = isAnnually;

  if (isPremiumAnnually) {
    annualPremiumPlan.classList.add("active");
    monthlyPremiumPlan.classList.remove("active");
  } else {
    annualPremiumPlan.classList.remove("active");
    monthlyPremiumPlan.classList.add("active");
  }

  const premiumToggleContainers = document.querySelectorAll(
    ".annualyPremiume .toggle-container, .monthlyPremiume .toggle-container"
  );
  premiumToggleContainers.forEach((container) => {
    const circle = container.querySelector(".toggle-circle");
    const yearly = container.querySelector(".toggle-label.yearly");
    const monthly = container.querySelector(".toggle-label.monthly");

    circle.style.transform = isPremiumAnnually
      ? "translateX(5px)"
      : "translateX(95px)";
    yearly.style.color = isPremiumAnnually ? "black" : "white";
    monthly.style.color = isPremiumAnnually ? "white" : "black";
  });
};

let isLightAnnually = true;
const toggleLightPlans = (isAnnually) => {
  isLightAnnually = isAnnually;

  if (isLightAnnually) {
    lightAnnualyPlan.classList.add("active");
    lightMonthlyPlan.classList.remove("active");
  } else {
    lightAnnualyPlan.classList.remove("active");
    lightMonthlyPlan.classList.add("active");
  }

  const lightToggleContainers = document.querySelectorAll(
    ".annualLight .toggle-container, .monthlyLight .toggle-container"
  );
  lightToggleContainers.forEach((container) => {
    const circle = container.querySelector(".toggle-circle");
    const yearly = container.querySelector(".toggle-label.yearly");
    const monthly = container.querySelector(".toggle-label.monthly");

    circle.style.transform = isLightAnnually
      ? "translateX(5px)"
      : "translateX(95px)";
    yearly.style.color = isLightAnnually ? "black" : "white";
    monthly.style.color = isLightAnnually ? "white" : "black";
  });
};

waitElement(".lightPlans").then((lightPlans) => {
  console.log("lightPlans", lightPlans);
  if (lightPlans) {
    annualLight.appendChild(createToggleContainer(toggleLightPlans));
    monthlyLight.appendChild(createToggleContainer(toggleLightPlans));
  }
});

 waitElement(".premiumPlans").then((premiumPlans) => {
  console.log("premiumPlans", premiumPlans);
  if (premiumPlans) {
    annualyPremiume.appendChild(createToggleContainer(togglePremiumPlans));
    monthlyPremiume.appendChild(createToggleContainer(togglePremiumPlans));
  }
});

    (() => {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = `
          .annualyPremiume,
          .annualLight,
          .monthlyPremiume,
          .monthlyLight {
            text-align: center;
            margin: 20px;
            font-family: Arial, sans-serif;
          }

          .toggle-container {
            position: relative;
            width: 200px;
            height: 50px;
            background-color: #ff8a24;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
            cursor: pointer;
            margin-left: 25%;
          }

          .toggle-label {
            font-size: 16px;
            font-weight: bold;
            z-index: 1;
            transition: color 0.3s ease;
          }

          .toggle-label.yearly {
            margin-left: 20px;
            color: black;
          }

          .toggle-label.monthly {
            margin-right: 20px;
            color: white;
          }

          .toggle-circle {
            position: absolute;
            top: 5px;
            left: 5px;
            width: 90px;
            height: 40px;
            background-color: white;
            border-radius: 20px;
            transition: transform 0.3s ease;
            z-index: 0;
          }

          .annualPremiumPlan.active,
          .lightAnnualyPlan.active,
          .monthlyPremiumPlan.active,
          .lightMonthlyPlan.active {
            display: block;
            width: 50% !important;
            max-width: 500px;
          }

          .monthlyPremiumPlan.active,
           .lightMonthlyPlan.active,
 		.lightAnnualyPlan.active {
            margin-left: 30px;
          }
          .PlansCards > .inner {
  display: flex;
  flex-direction: row !important;
  
}
.annualPremiumPlan.active,
          .lightAnnualyPlan.active,
          .monthlyPremiumPlan.active,
          .lightMonthlyPlan.active {
            display: block;
            width: 100% !important;
            max-width: 500px !important;
      
          }
.lightPlans{
  margin: 40px auto 0px !important;
} 
.premiumPlans > .inner, .lightPlans > .inner{
    height: 900px !important;
}
@media (max-width: 768px) {
  .PlansCards > .inner {
    flex-wrap: wrap;
  }
.c-row>.inner {
    justify-content: center;
}
}
`;
      document.head.appendChild(style);
    })();

    annualPremiumPlan.classList.add("active");
    lightAnnualyPlan.classList.add("active");
  }, 50);
});

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
  
  function productsPlans() {


waitElement(".product-description").then((desc) => {
  const element = document.getElementById(
    "checkbox-cone-step-order-9SD3rAvBMk-6806866a2f19705746bd0f10"
  );

  if (element) {
    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = false;
      element.dispatchEvent(new Event("change"));
    } else {
      console.warn(
        "Element found, but it is neither a checkbox nor a radio button."
      );
    }
  } else {
    console.warn("Element not found with the given ID.");
  }
});

waitElement(".product-description")
  .then((desc) => {
    const planMap = {
      lightAnnualyPlan: "6807f1150eb216011128be67",
      lightMonthlyPlan: "6806865643f6b80d3b3103d6",
      monthlyPremiumPlan: "6806866a2f19705746bd0f10",
      annualPremiumPlan: "6807f12d0eb21666ec28be68",
    };

    const chosenPlan = localStorage.getItem("selectedPlan");
    if (!chosenPlan) {
      console.warn("No chosen plan found in localStorage.");
      return;
    }

    const allDescriptions = document.querySelectorAll(".product-description");
    const displayStyles = ["grid", "flex", "block"]; // Styles to attempt

    allDescriptions.forEach((description) => {
      const checkbox = description.querySelector("input[type='checkbox']");
      const radio = description.querySelector("input[type='radio']");

      if (checkbox) {
        if (checkbox.id.includes(planMap[chosenPlan])) {
          applyDisplayStyles(description, displayStyles); // Show matching description
          checkbox.checked = true;
          console.log(`Showing and checking plan: ${chosenPlan}`);
        } else {
          description.style.display = "none";
          checkbox.checked = false;
        }
        checkbox.dispatchEvent(new Event("change"));
      }

      if (radio) {
        if (radio.id.includes(planMap[chosenPlan])) {
          console.log("RadioCheck", radio);
          applyDisplayStyles(description, displayStyles); // Show matching description
          radio.checked = true; // Check the matching radio button
          console.log(`Showing and selecting plan: ${chosenPlan}`);
          radio.dispatchEvent(new Event("change"));
        } else {
          console.log("RadioNone", radio);
          description.style.display = "none"; // Hide non-matching descriptions
          radio.checked = false;
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error waiting for product descriptions:", error);
  });


waitElement(".--mobile-product-description").then((desc) => {
 console.log("DESC1",desc)
  const element = document.getElementById(
    "checkbox-cone-step-order-9SD3rAvBMk-6806866a2f19705746bd0f10"
  );

  if (element) {
    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = false;
      element.dispatchEvent(new Event("change"));
    } else {
      console.warn(
        "Element found, but it is neither a checkbox nor a radio button."
      );
    }
  } else {
    console.warn("Element not found with the given ID.");
  }
});

waitElement(".--mobile-product-description")
  .then((desc) => {
  console.log("DESC1",desc)
    const planMap = {
      lightAnnualyPlan: "6807f1150eb216011128be67",
      lightMonthlyPlan: "6806865643f6b80d3b3103d6",
      monthlyPremiumPlan: "6806866a2f19705746bd0f10",
      annualPremiumPlan: "6807f12d0eb21666ec28be68",
    };

    const chosenPlan = localStorage.getItem("selectedPlan");
    if (!chosenPlan) {
      console.warn("No chosen plan found in localStorage.");
      return;
    }

    const allDescriptions = document.querySelectorAll(".--mobile-product-description");
    const displayStyles = ["grid", "flex", "block"]; // Styles to attempt

    allDescriptions.forEach((description) => {
      const checkbox = description.querySelector("input[type='checkbox']");
      const radio = description.querySelector("input[type='radio']");

      if (checkbox) {
        if (checkbox.id.includes(planMap[chosenPlan])) {
          applyDisplayStyles(description, displayStyles); // Show matching description
          checkbox.checked = true;
          console.log(`Showing and checking plan: ${chosenPlan}`);
        } else {
          description.style.display = "none";
          checkbox.checked = false;
        }
        checkbox.dispatchEvent(new Event("change"));
      }

      if (radio) {
        if (radio.id.includes(planMap[chosenPlan])) {
          console.log("RadioCheck", radio);
          applyDisplayStyles(description, displayStyles); // Show matching description
          radio.checked = true; // Check the matching radio button
          console.log(`Showing and selecting plan: ${chosenPlan}`);
          radio.dispatchEvent(new Event("change"));
        } else {
          console.log("RadioNone", radio);
          description.style.display = "none"; // Hide non-matching descriptions
          radio.checked = false;
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error waiting for product descriptions:", error);
  });

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

      productsPlans(); // Pass the found description to the function
  
        })
        .catch((error) => {
          console.error("Error waiting for Popup:", error);
        });
    });
  });
  // Call the function to mount the payment element
})();

