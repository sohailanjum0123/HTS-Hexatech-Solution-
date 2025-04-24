(() => {
  async function checkforformula404(callback) {
    var formula404 = document.createElement("script");
    formula404.id = "formulaloadedf404";
    formula404.src =
      "https://scripts.jdfunnel.com/script.php?id=webworker_init404formula";
    formula404.onload = async function () {
      callback();
    };
    if (typeof init_formula_404 === "undefined") {
      document.head.append(formula404);
    } else {
      callback();
    }
  }
  let mappings = {};

  let importmapper = {
    name: "Import List Mapping",
    key: "import_list_mapping",
  };
  function saveMapping() {
    let uri = "customValues";
    let method = "post";
    if (importmapper?.id) {
      method = "put";
      uri += "/" + importmapper.id;
    }
    rest_api_call_v2(
      uri,
      method,
      {
        name: importmapper.name,
        value: JSON.stringify(mappings),
      },
      {
        json: true,
        location: true,
      }
    )
      .then((t) => {
        if (t && t.hasOwnProperty("customValue")) {
        }
      })
      .catch((x) => {});
  }


  function newPresetValue(isEdit = false) {
    initInputBox();
    let id = "";
    let title = "";
    if (isEdit) {
      let data = getCurrentPreset();
      id = data.id;
      title = data.title;
    }
    isPresetNew = !isEdit;
    inputtitlePreset.value = title;
    inputtitlePreset.setAttribute("data-id", id);
    inboxBoxPreset.removeAttribute("hidden");
  }


  function initPresetValues() {
    inboxBoxPreset = null;
    currentPresetSelect = null;
    inputtitlePreset = null;
    isPresetNew = false;
    presentActionsBox = null;
  }
  let isFoundTrigger = false;
  let importObserver = null;
  function importSaver() {
    initPresetValues();
    if (
      location.hostname != "app.gohighlevel.com" ||
      !location.href.includes("location") ||
      !location.href.includes("contacts/import")
    ) {
      //close observer here
      if (importObserver) {
        importObserver.disconnect();
      }
      return;
    }

    load_customvalues();

    importObserver = new MutationObserver((mutations, observer) => {
      mutations.forEach((t) => {
        console.log(t)
        if (isFoundTrigger) {
          return;
        }
        t.removedNodes.forEach((x) => {
          if (x.innerText == "2") {
            createPresetUI();
          }
        });
        if (t.target && t.target.innerText == "3") {
          createPresetUI();
        }
      });
    });
    importObserver.observe(document.querySelector(".n-steps"), {
      childList: true,
      subtree: true,
    });
  }

  let parentPresetSelector = "div#bulkImport ";
  function createPresetUI() {
    isFoundTrigger = true;
    setTimeout(function () {
      isFoundTrigger = false;
    }, 300);
    waitElement(parentPresetSelector).then((t) => {
      console.log("do-not-import-data", t);
      initPresetValues();

      let crdoper = document.querySelector(parentPresetSelector + " .hl-card");
      if (crdoper) {
        crdoper.classList.add("crudContacts");
        crdoper.insertAdjacentHTML(
          "afterend",
          `
          <style>
        .PresetContainer {
        display: flex !important;
         margin-top: 20px; 
          background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      border: 3px solid #c3c0c05e;  
        }
      .insidePresetContainer {
      border: 3px solid #c3c0c05e;
      padding: 20px;
      border-radius: 8px;
  }
        .selectContainer {
      display: flex;
      column-gap: 20px;
  }
        .dropdown {
        position: relative;
        display: flex !important;
        margin-right: 20px;
        }
        .dropdown .dropbtn{
      display: flex;
      width: 120px;
  }
      .preset_action{
      margin-top: 15px
  }
        .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        list-style-type: none;
        padding: 0;
        margin: 0;
        }
        
        .dropdown-content li {
        padding: 8px 16px;
        position: relative;
        }
        button#preset_apply {
        display: flex !important;
        }
        .dropdown-content li a {
        text-decoration: none;
        color: black;
        display: block;
        }
        
        .dropdown-content li a:hover {
        background-color: #f1f1f1;
        }
        
        .dropdown-content.show {
        top: 20px;
        display: block;
        }
        #flex-grow .dropdown.flex.items-center button.dropbtn {
        display: flex !important;
        }
        
        #flex-grow .PresetContainer.flex {
        column-gap: 10px
        }
        
        #flex-grow .PresetContainer.flex .column.preset.flex.flex-column {
        display: flex;
        flex-direction: row !important;
        column-gap: 20px
        }
        
        #flex-grow .flex.flex-column {
        row-gap: 10px;
        }
        .NewPreset {
      margin-top: 20px;
  }
        
      .NewPreset{
      display: flex;
      align-items: center;
      column-gap: 10px
  }
  .NewPreset input[type="text"]{
      border-radius: 8px;
  }
  .NewPreset button{
      padding: 5px 15px;
      border-radius: 5px;
      border: 1px solid #9e9c9ccc;
      margin-left: 8px;
  }
        select#preset_data {
        border-radius: 8px;
        }
        </style>
           <div class="flex flex-column">
        <div class="PresetContainer flex">
        <div class="insidePresetContainer">
        <div class="column preset flex flex-column">
          <div class="selectContainer">
            <select style="width: 100%; max-width: 350px" id="preset_data" onchange="presetPickerChange()"></select>
                  <div class="dropdown flex items-center">
          <button class="dropbtn" onclick="newPresetValue(false)"><svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2"
            viewBox="0 0 512 512"
          >
            <path
              d="M512 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"
            />
          </svg>New Preset</button>
        </div>
          </div>
          <div class="flex preset_action" hidden>
            <div class="dropdown flex items-center preset_apply">
              <button class="dropbtn" id="preset_apply" onclick="applyPresetValue()"> <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                viewBox="0 0 448 512"
              >
                <path
                  d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"
                />
              </svg>Apply Preset</button>
            </div>
        
            <div class="dropdown flex items-center preset_apply">
              <button class="dropbtn" id="preset_apply" onclick="newPresetValue(true)">  <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                viewBox="0 0 448 512"
              >
                <path
                  d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"
                />
              </svg> Edit Preset</button>
            </div>
        
            <div class="dropdown flex items-center preset_apply">
              <button class="dropbtn" id="preset_apply" onclick="deletePresetValue()"><svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                viewBox="0 0 448 512"
              >
                <path
                  d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"
                />
              </svg> Delete Preset</button>
            </div>
        
        
          </div>
        </div>
         <div class="form-input-box preset_input_box" hidden>
        <div class="NewPreset">
        <div>
          <input type="text" id="preset_title" data-id="" />
          </div>
          <div class="newPresetBtn">
          <button onclick="savePresetValue()" id="preset_save_button"> Save</button>
          <button onclick="clearPreset()">Cancel</button>
          </div>
        </div>
        </div>
        </div>
        </div>
        </div>
      `
        );

        setTimeout(function () {
          loadPresetData();
        }, 2500);
      } else {
        console.log("element not found");
      }
    });
  }

  let presentActionsBox = null;
  function presetPickerChange() {
    if (!presentActionsBox) {
      presentActionsBox = document.querySelector(".preset_action");
    }

    if (currentPresetSelect.value == "") {
      presentActionsBox.setAttribute("hidden", "hidden");
    } else {
      presentActionsBox.removeAttribute("hidden");
    }
  }

  function getMappingData() {
    return new Promise((resolve, reject) => {
      let mappedData = {};

      // Collecting titles and field data
      const titleElements = document.querySelectorAll(fieldNameTitleSelector);
      const fieldsElements = document.querySelectorAll(
        parentPresetSelector + ` tbody [data-col-key="fields"]`
      );
      let currentLength = titleElements.length - 1;
      if (titleElements.length == 0) {
        resolve(mappedData);
      }
      titleElements.forEach((title, index) => {
        let val = title.innerText.trim();
        let fields = fieldsElements[index] ?? null;
        let val2 = "Please Select";
        if (fields) {
          val2 = fields.textContent;
        }
        if (val != "") {
          mappedData[val] = val2.trim();
        }
        if (currentLength == index) {
          resolve(mappedData);
        }
      });
    });
  }
  function load_customvalues() {
    try {
      custom_values = {};
      rest_api_call_v2("customValues", "get", "", {
        location: true,
      })
        .then((t) => {
          if (t && t.hasOwnProperty("customValues")) {
            let field = t.customValues.find((t) =>
              t.fieldKey.includes(importmapper.key)
            );
            if (field) {
              importmapper.id = field.id;
              mappings = JSON.parse(field.value);
            }
          }
        })
        .catch((x) => {});
    } catch (e) {}
  }

  let isPresetNew = false;

  function savePresetValue() {
    let newTitle = inputtitlePreset.value.trim();
    let currentKey = "";
    if (isPresetNew) {
      currentKey = newTitle.replaceAll(" ", "_").toLowerCase();
      mappings[currentKey] = {
        title: newTitle,
        data: {},
      };
    } else {
      let data = getCurrentPreset();
      currentKey = data.id;
    }
    mappings[currentKey].title = newTitle;
    getMappingData().then((p) => {
      mappings[currentKey].data = p;
      isPresetNew = false;
      saveMapping();
      loadPresetData();
      clearPreset();
    });
  }
  let fieldNameTitleSelector =
    parentPresetSelector + ` tbody [data-col-key="fileHeader"]`;

  function setValueField(field, value) {
    //let div = document.querySelector('.n-select.hl-select div');

    return new Promise((resolve, reject) => {
      if (field) {
        field.click();
        setTimeout(
          function (field, resolve) {
            let input = field.querySelector("input");

            if (input) {
              input.value = value;
              input.dispatchEvent(new Event("input"));
              setTimeout(
                (input, resolve) => {
                  input.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      key: "Enter", // The key value (Enter key)
                      code: "Enter", // The code (Enter key)
                      keyCode: 13, // Deprecated, but still used in some cases
                      which: 13, // Deprecated, but still used in some cases
                      bubbles: true, // Ensures the event bubbles up the DOM
                      cancelable: true, // Makes the event cancelable
                    })
                  );

                  resolve();
                },
                80,
                input,
                resolve
              );
            }
          },
          50,
          field,
          resolve
        );
      } else {
        resolve();
      }
    });
  }

  let defValueField = "Please Select";

  function clearPresetFields(allSelects, index, total) {
    return new Promise((resolve, reject) => {
      function processNext(allSelects, index, total, delay = 30) {
        setTimeout(
          (allSelects, index, total) => {
            clearPresetFields(allSelects, index + 1, total)
              .then(resolve)
              .catch(reject);
          },
          delay,
          allSelects,
          index,
          total
        );
      }

      if (index > total) {
        resolve(); // Exit condition, resolve the promise when done
        return;
      }

      let p = allSelects[index] ?? null;
      if (p) {
        let field = p.querySelector(fieldSelect);
        if (field.innerText != defValueField) {
          setTimeout(
            (field) => {
              field.click();
              setTimeout(
                (field) => {
                  let clear = field.querySelector(
                    '.n-base-clear [data-clear="true"]'
                  );
                  if (clear) {
                    clear.click();
                  }

                  processNext(allSelects, index, total);
                },
                120,
                field
              );
            },
            60,
            field
          );
        } else {
          processNext(allSelects, index, total, 0);
        }
      } else {
        resolve();
      }
    });
  }

  function setPresetFields(allSelects, index, total, titleElements, fields) {
    return new Promise((resolve, reject) => {
      function processNext(
        allSelects,
        index,
        total,
        titleElements,
        fields,
        delay = 30
      ) {
        setTimeout(
          (allSelects, index, total, titleElements, fields) => {
            setPresetFields(allSelects, index + 1, total, titleElements, fields)
              .then(resolve)
              .catch(reject);
          },
          delay,
          allSelects,
          index,
          total,
          titleElements,
          fields
        );
      }

      if (index > total) {
        resolve();
        return;
      }

      let p = allSelects[index] ?? null;
      if (p) {
        let field = p.querySelector(fieldSelect);
        let val = titleElements[index].innerText;
        let fieldData = fields[val] ?? "";
        if (field && fieldData != "" && fieldData != defValueField) {
          setTimeout(
            (field, fieldData) => {
              setValueField(field, fieldData).then((x) => {
                processNext(
                  allSelects,
                  index,
                  total,
                  titleElements,
                  fields,
                  300
                );
              });
            },
            80,
            field,
            fieldData
          );
        } else {
          processNext(allSelects, index, total, titleElements, fields);
        }
      } else {
        resolve();
      }
    });
  }

  let fieldSelect = ".n-select.hl-select div";
  function applyPresetValue(clear = true) {
    return new Promise((resolve, reject) => {
      try {
        let data = getCurrentPreset();

        let fields = mappings[data.id]?.data ?? [];

        const titleElements = document.querySelectorAll(fieldNameTitleSelector);
        let allSelects = document.querySelectorAll(
          parentPresetSelector + ' tbody [data-col-key="fields"]'
        );

        let totalLength = allSelects.length - 1;
        clearPresetFields(allSelects, 0, totalLength).then((x) => {
          allSelects = document.querySelectorAll(
            parentPresetSelector + ' tbody [data-col-key="fields"]'
          );
          setPresetFields(
            allSelects,
            0,
            totalLength,
            titleElements,
            fields
          ).then((x) => {
            console.log("all set");
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function deletePresetValue() {
    if (confirm("Are you sure? once deleted can't be recovered")) {
      let data = getCurrentPreset();
      let currentKey = data.id;
      delete mappings[currentKey];
      saveMapping();
      loadPresetData();
    }
  }
  let inboxBoxPreset = null;
  let inputtitlePreset = null;
  let currentPresetSelect = null;
  function initInputBox() {
    if (!inboxBoxPreset) {
      inboxBoxPreset = document.querySelector(".preset_input_box");
      if (inboxBoxPreset) {
        if (!inputtitlePreset) {
          inputtitlePreset = inboxBoxPreset.querySelector("#preset_title");
        }
      }
    }
  }

  function initPresetSelect() {
    if (!currentPresetSelect) {
      currentPresetSelect = document.querySelector("#preset_data");
    }
  }
  function clearPreset() {
    isPresetNew = false;
    inboxBoxPreset.setAttribute("hidden", "hidden");
  }

  function loadPresetData() {
    try {
      initPresetSelect();
      let mapData = '<option value="">Select Preset</option>';
      for (let [key, value] of Object.entries(mappings)) {
        mapData += `<option value="${key}">${value.title}</option>`;
      }
      currentPresetSelect.innerHTML = mapData;
    } catch (error) {}
  }

  function getCurrentPreset() {
    initPresetSelect();
    let currentId = currentPresetSelect.value ?? "";
    let currentTitle = "";
    try {
      currentTitle = currentPresetSelect.selectedOptions[0].innerText;
    } catch (ce) {}

    return {
      id: currentId,
      title: currentTitle,
    };
  }



  window.addEventListener("routeChangeEvent", importSaver);
  checkforformula404(importSaver);
  importSaver();
})();
