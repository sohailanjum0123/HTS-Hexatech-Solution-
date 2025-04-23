
  document.addEventListener("hydrationDone", () => {
    setTimeout(() => {
      console.log("Hydration complete, initializing plans...");

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

        toggleContainer.addEventListener("click", toggleCallback);

        return toggleContainer;
      };

      let isPremiumAnnually = true;
      const togglePremiumPlans = () => {
        isPremiumAnnually = !isPremiumAnnually;

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
      const toggleLightPlans = () => {
        isLightAnnually = !isLightAnnually;

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

          .annualPremiumPlan,
          .lightAnnualyPlan,
          .monthlyPremiumPlan,
          .lightMonthlyPlan {
            display: none;
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
  flex-direction: row !important
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
 .lightAnnualyPlan.active, .lightMonthlyPlan.active {
    height: 780px !important;
}


        `;
        document.head.appendChild(style);
      })();

      annualPremiumPlan.classList.add("active");
      lightAnnualyPlan.classList.add("active");
    }, 300);
  });

