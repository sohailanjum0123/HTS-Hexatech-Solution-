function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(getNavItems())
  ).setMimeType(ContentService.MimeType.JSON);
}

function getNavItems() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Nav");

  // Fetch all rows
  const data = sheet.getDataRange().getValues();

  // Extract the header row and the data rows
  const headers = data[0];
  const rows = data.slice(1);

  // Build the JSON structure
  const items = [];
  const itemMap = {}; // Map to keep track of parents and their children

  rows.forEach((row) => {
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });

    // Process the row
    let {
      uniqueParentId,
      Title: title,
      image: img = "",
      isParent,
      id,
      mainAppender,
      redirectURL: url = "",
      parent: parent = isParent == 1 || isParent == "1",
    } = rowData;

    const newItem = {
      title,
      id,
      img,
      url,
      parent,
      childs: [],
    };

    // If it has a mainAppender (child), add to parent's child array
    if (mainAppender) {
      if (!itemMap[mainAppender]) {
        itemMap[mainAppender] = { childs: [] };
      }
      itemMap[mainAppender].childs.push(newItem);
    } else if (parent) {
      // If it's a parent and has no mainAppender, add it to the root array
      items.push(newItem);
    }

    // Map this item for later child assignments
    if (!itemMap[uniqueParentId]) {
      itemMap[uniqueParentId] = newItem;
    } else {
      Object.assign(itemMap[uniqueParentId], newItem);
    }
  });
  // Logger.log(JSON.stringify(items));
  return items;
}
