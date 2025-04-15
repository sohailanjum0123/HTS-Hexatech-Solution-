function waitElement(selector) {
  return new Promise(function (resolve) {
    var elm = document.querySelector(selector);
    if (elm) {
      resolve(elm);
      return;
    }
    new MutationObserver(function (observer, mutation) {
      elm = document.querySelector(selector);
      if (elm) {
        mutation.disconnect();
        resolve(elm);
      }
    }).observe(document, { subtree: true, childList: true });
  });
}

function setFieldValue(selector, value, event = "input", secondvalue = true) {
  let field = null;
  if (typeof selector == "string") {
    field = document.querySelector(`[data-q="${selector}"]`);
  } else {
    field = selector;
  }
  if (field) {
    let updator = "value";
    if (["checkbox", "radio"].includes(field.type)) {
      field = document.querySelector(
        `[data-q="${selector}"][value="${value}"]`
      );
      event = "change";
      updator = "checked";
      value = secondvalue;
    }
    if (!field) {
      return;
    }
    field[updator] = value;
    field.dispatchEvent(new Event(event));

    if (field.type == "tel") {
      setTimeout(
        (field) => {
          field.dispatchEvent(new Event("keyup"));
        },
        600,
        field
      );
    }
  }
}






function setFieldValue(selector, value, event = "input") {
  let field = null;
  if (typeof selector == "string") {
    field = document.querySelector(selector);
  } else {
    field = selector;
  }
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event(event));
  }
}


// From Local Storage set the values

let keysFiller = {
  startDate: "startdate",
  endDate: "end_date",
  selectedProperty: "property_address",
};

for (let [k, v] of Object.entries(keysFiller)) {
  let value = localStorage.getItem(k) || "";
  if (value != "") {
    waitElement(`[data-q="${v}"]`).then((p) => {
      setFieldValue(p, value);
    });
  }
}




