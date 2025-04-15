
//Roy Alessi Google sheet code
let mainAuthUrl = "https://services.leadconnectorhq.com/";
let versionHeader = '2021-04-15';
let appDataMainValueIndex = 1;
let appDataMainClientIndex = 0;
let appDataSheet = getActiveSheet("AppData");
let config = getRows(appDataSheet);
let lifSheetName = 'Paid';
let installmentSheet = 'UpcomingPayments';

function getConfigKey(index) {
  try {
    return config[index][appDataMainValueIndex];
  } catch (err) {
    return "";
  }
}

let calendarId = getConfigKey(0);
let locationId = getConfigKey(1);
let privateIntegrationToken = getConfigKey(2);
let locationName = getConfigKey(3);
let locationPhone = getConfigKey(4);
let locationPostalCode = getConfigKey(5);


console.log("Calendar ID:", calendarId);
console.log("Location ID:", locationId);
console.log("Private Integration Token:", privateIntegrationToken);

function getActiveSheet(name) {
  try {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  } catch (err) {
    console.error("Error getting active sheet:", err);
  }
  return null;
}

function getRows(sheet) {
  return sheet.getDataRange().getValues();
}

function doGet(e) {
  try {
    const params = e ? e.parameter || {} : {};

    return sendResponse("Service is running. Available actions: test");
  } catch (error) {
    console.error("Error in doGet:", error);
    return errorResponse("Internal server error: " + error.message);
  }
}

function sendResponse(message, status = "success") {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: status,
      message: message
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message) {
  return sendResponse(message, "error");
}

function doPost(e) {
  try {


    try {
      addLogs([e.postData.contents]);
      data = e.postData ? JSON.parse(e.postData.contents) : {};
    } catch (parseError) {
      data = e.parameter || {};
    }
    msg = handleData(data);
    return sendResponse(msg);
  } catch (error) {
    console.error(error);
    return errorResponse(error.message);
  }
}

function testData() {
  let data = { "Contact: Proposal Link ": "", "Wedding Date": "2025-05-09", "Bride's Name": "", "Groom's Name": "", "Where are you closest to?": "", "Multi Line 2fay": "", "Installment Paid": "", "Wedding Venue": "303 Berryfest Place, Plant City FL 33563", "Last Invoice ID": "67f416a6c485d2430aad9479", "Where is your wedding or event?": "", "What are your underlying goals from a photographer or videographer?": "", "Have you ever worked with a photographer or videographer before?": "", "I’m looking for a photographer or videographer for my…": "", "How would you describe yourself?": "", "Choose Your Location": "", "What is your goal budget for a wedding photography and videography package?": "", "How would you like to pay?": "Payment Plan", "Before your special day, what are your expectations for the planning process?": "", "How many instalments would you like to pay in?": "4", "Are there any extras you have in mind? ": "", "Spouse's Name": "e", "Are you having an unplugged wedding ceremony?": "", "Initial Venue Date": "2025-05-09", "How much involvement would you like to have in the creative vision and process?": "", "Have you had the chance to check out our portfolio or Instagram?": "", "Initial Payment": "4525", "How soon after your wedding do you expect the finished photos?": "", "User Data Detail": "", "Where Is Your Wedding Or Event?": "", "Due Amount": "1131.0", "Payment Discounts": "0", "Total Distance Miles": "Miles (0): $0", "Product Items": "{\"subtotal\":4525,\"milesPrice\":0,\"miles\":0,\"discounts\":0,\"total\":4525,\"dueAmount\":\"1131.0\",\"items\":[{\"title\":\"PEARL Package | Photos & Video\",\"description\":\"\",\"price\":2500,\"quantity\":1,\"totalPrice\":2500},{\"id\":\"67c8cf9f42a34d7e520b08df\",\"title\":\"Day-after Session\",\"price\":500,\"quantity\":1,\"totalPrice\":500},{\"id\":\"67c8cf9f42a34dffc20b08dd\",\"title\":\"Bridal Shower\",\"price\":500,\"quantity\":1,\"totalPrice\":500},{\"id\":\"67c8cf9f42a34d5d850b08db\",\"description\":\"Testing\",\"title\":\"Maternity Session\",\"price\":500,\"quantity\":1,\"totalPrice\":500},{\"id\":\"67eea57bfd99c1ae1c5b956c\",\"description\":\"Includes drone footage, 60-second teaser video, audio of vows and speech, and raw video footage.\",\"title\":\"Signature Extras\",\"price\":525,\"quantity\":1,\"totalPrice\":525}]}", "No of Photographer": 1, "No of VideoGrapher": 1, "Wedding Package": "PEARL", "Wedding Service": "Photos & Video", "Nearest Base Location": "Tampa", "Stripe Customer ID": "", "contact_id": "hN4pD3V5Rbg59Y3veGaa", "first_name": "test", "full_name": "test", "email": "test@test.com", "phone": "+927867867867", "tags": "", "address1": "303 Berryfest Place", "city": "Plant City", "state": "FL", "country": "US", "timezone": "Asia/Karachi", "date_created": "2025-04-07T17:30:43.734Z", "postal_code": "33563", "contact_source": "initial wedding form", "full_address": "303 Berryfest Place, Plant City FL 33563", "contact_type": "lead", "location": { "name": "Cherished Memories Studio", "address": "", "city": "", "state": "FL", "country": "US", "fullAddress": "FL ", "id": "YxsRH9X4UhvisCDtoa6x" }, "workflow": { "id": "e497b541-bb4a-48ad-b314-765a96add50b", "name": "Cherished wedding testing" }, "payment": { "transaction_id": "67f4181b8db15e123c9819cd", "source": "form", "payment_status": "succeeded", "global_product_ids": [], "global_product_price_ids": [], "line_items": [], "sub_total_amount": 1131, "discount_amount": 0, "tax_amount": 0, "total_amount": 1131, "method": "gateway", "gateway": "stripe", "card": { "brand": "visa", "last4": "4242" }, "currency_symbol": "$", "currency_code": "USD", "created_at": "2025-04-07T18:23:24.129Z", "created_on": "April 7, 2025", "customer": { "id": "hN4pD3V5Rbg59Y3veGaa", "first_name": "test", "name": "test", "email": "test@test.com", "phone": "+927867867867", "address": "303 Berryfest Place", "city": "Plant City", "state": "FL", "country": "US", "postal_code": "33563" }, "coupon_code": "", "form": { "id": "WqmIIwJ8oCgy2cIkqj7f", "name": "Payment Form" } }, "triggerData": {}, "contact": { "attributionSource": { "sessionSource": "Direct traffic", "url": "https://app.gohighlevel.com/v2/preview/YNCZDkbwm8bUS5OyWEiP?notrack=true", "utmSource": null, "utmMedium": null, "utmContent": null, "utmTerm": null, "utmKeyword": null, "utmMatchtype": null, "referrer": null, "gclid": null, "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36", "ip": "154.80.59.60", "gaClientId": "GA1.2.1594875760.1743680627", "medium": "form", "mediumId": "05hIpYQDRBFtuck6vM7k", "adName": null, "adGroupId": null, "adId": null, "gbraid": null, "wbraid": null }, "lastAttributionSource": { "sessionSource": "Direct traffic", "url": "https://app.gohighlevel.com/v2/preview/Go0xDgeBp9VhcX7kL5T8?notrack=true", "utmSource": null, "utmMedium": null, "utmContent": null, "utmTerm": null, "utmKeyword": null, "utmMatchtype": null, "referrer": null, "gclid": null, "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36", "ip": "154.80.59.60", "gaClientId": "GA1.2.1594875760.1743680627", "medium": "form", "mediumId": "WqmIIwJ8oCgy2cIkqj7f", "adName": null, "adGroupId": null, "adId": null, "gbraid": null, "wbraid": null } }, "attributionSource": {}, "customData": { "type": "appointment", "contact_timezone": "PKT" } };
  let msg = handleData(data);
  console.log(msg);
}

function handleData(data) {
  let customData = data.customData || {};
  let type = customData['type'] || null;
  if (!type) {
    return 'Type is required';
  }
  if (type == 'booking') {
    return insertBookingEntry(data);
  } else if (type == 'appointment') {
    return handleAppointment(data);

  } else if (type == 'nextcharge') {
    return handleNextCharge(data);
  } else if (type == 'createInvoice') {
    return createInvoice(data);
  }
  return 'request received';
}

function parseNumber(number, float = false) {
  number = number.toString().replace(',', '');
  if (float) {
    number = parseFloat(parseFloat(number).toFixed(2));
  } else {
    number = parseInt(parseInt(number).toFixed(0));
  }
  return isFinite(number) ? number : 0;
}
function formatDate(date) {
  // Create a new Date object
  var dateObj = new Date(date);
  
  // Format the date using the en-GB locale (day, month, year)
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dateObj);

  // Log the formatted date to the console
   
}
function createInvoice(data) {

  let full_name = data.full_name;
  let discount = 0;
  discount = (data['Payments Discount'] || "").trim();
  if (discount == '') {
    discount = 0;
  }
  let currency = "USD";
  let invoiceDetail = getItems(data);
  let invoiceItems = [];/*[
      {
        "taxes": [],
        "_id": "c6tZZU0rJBf30ZXx9Gli",
        "productId": "c6tZZU0rJBf30ZXx9Gli",
        "priceId": "c6tZZU0rJBf30ZXx9Gli",
        "currency": "USD",
        "name": "Macbook Pro",
        "qty": 1,
        "amount": 999
      }
    ]*/
  (invoiceDetail?.items || []).forEach(x => {
    invoiceItems.push({
      // "taxes": [],
      "currency": currency,
      description: (x.description || "").trim(),
      "name": x.title,
      "qty": x.quantity,
      "amount": parseNumber(x.price, true),
    })
  });
  let miles = invoiceDetail.miles || 0;
  let milesPrice = invoiceDetail.milesPrice || 0;
  if (miles > 0 && milesPrice > 0) {
    invoiceItems.push({
      "currency": currency,
      "name": "Extra Miles Charge",
      description: `Distance - ${miles} Miles`,
      "qty": 1,
      "amount": parseNumber(milesPrice, true)
    });
  }

  let total = data['Initial Payment'] || 0;
  total = parseNumber(invoiceDetail?.total ?? total, true);
  discount = parseNumber(invoiceDetail?.discounts ?? discount, true);
  let contactDetail = {
    "id": data.contact_id,
    "name": full_name
  };
  let phone = (data.phone ?? "").trim();
  if (phone != "") {
    contactDetail['phoneNo'] = phone;
  }
  let email = (data.email ?? "").trim();
  if (email != "") {
    contactDetail['email'] = email;
  }
  let loc = data.location;
  let dueDate = data[weddingDateKey];

  let currentDate = new Date();
  let dueDateParsed = new Date(dueDate);
  dueDateParsed.setDate(dueDateParsed.getDate() - 7);
  if (dueDateParsed < currentDate) {
    dueDateParsed = dueDate;
  } else {
    try {
      dueDateParsed = dueDateParsed.toISOString().split('T')[0] ?? dueDate;
    } catch (err) {
      dueDateParsed = dueDate;
    }
  }
  let invoiceData = {
    altId: locationId,
    altType: 'location',
    name: full_name,
    title: full_name,
    currency: currency,
    "businessDetails": {
      "name": locationName,
      "phoneNo": locationPhone,
      "address": {
        addressLine1: "Wedding Date : "+ formatDate(dueDate),
        city: "",
        state: "",
        postalCode: "",
        countryCode: "",
      }
    },
    "contactDetails": contactDetail,
    "issueDate": getCurrentDate(true),
    "dueDate": dueDateParsed,
    "discount": {
      "type": "fixed",
      "value": discount,
    },
    "items": invoiceItems,
    total,
    // "amountDue": parseInt(total),
    // "automaticTaxesEnabled": true,
    // "automaticTaxesCalculated": true,
  };
  let dueAmount = invoiceDetail.dueAmount ?? total;
  let { installments, currentInstallment, planType } = getInstallments(data);
  Logger.log([installments, currentInstallment, planType]);
  if (installments > 1) {
    let schedules = [];
    //dueAmount = parseInt(parseNumber(total / installments, true)).toFixed(2);

    // for (let i = 1; i <= installments; i++) {
    //     schedules.push({ value: dueAmount, dueDate: '2025-04-09' })
    // }
    // let paymentSchedule = {
    //     type: 'fixed',
    //     schedules: schedules,
    // };
    //invoiceData['paymentSchedule'] = paymentSchedule;

    // console.log(invoiceData);//
  }



  // return;


  crmApiCall('invoices/', privateIntegrationToken, 'POST', invoiceData, true).then(x => {

    let created = x._id || x.id || null;
    if (created) {
      crmApiCall('contacts/' + data.contact_id, privateIntegrationToken, "PUT", {
        customFields: [{
          value: created,
          key: "last_invoice_id"
        }]
      }, true).then(x => {
        Logger.log(x);
      });
      let mode = 'cash';
      let isCard = data?.payment?.card ?? null;
      if (isCard && isCard.brand) {
        mode = 'card';
      }
      dueAmount = data?.payment?.total_amount ?? dueAmount;
      recordManualPayment(created, dueAmount, mode, isCard)

    }

  }).catch(p => {

  });
}

function recordManualPayment(invoiceId, amount = 0, mode = 'card', info = {}) {
  let payload = {
    amount: parseFloat(amount),
    altId: locationId,
    altType: 'location',
    mode: mode,
  };

  if (info && info.brand) {
    payload['card'] = info
  }

  crmApiCall(`invoices/${invoiceId}/record-payment`, privateIntegrationToken, "POST", payload, true).then(x => {
    Logger.log(x);
  });
}
let weddingDateKey = 'Wedding Date';
function handleAppointment(data) {
  let customData = data.customData || {};
  let timezone = (customData['contact_timezone'] ?? "").trim();
  let title = (customData['title'] ?? "").trim();

  if (!timezone || timezone == '') {
    return 'timezone is required';
  }

  let timezones = {
    "-12": "Etc/GMT+12",
    "SST": "Pacific/Midway",
    "HST": "Pacific/Honolulu",
    "AKDT": "America/Juneau",
    "AKDT": "US/Alaska",
    "MST": "America/Dawson",
    "PDT": "America/Los_Angeles",
    "MST": "America/Phoenix",
    "PDT": "America/Tijuana",
    "MST": "US/Arizona",
    "CST": "America/Bahia_Banderas",
    "CST": "America/Belize",
    "MDT": "America/Boise",
    "CST": "America/Chihuahua",
    "MDT": "America/Denver",
    "MDT": "America/Edmonton",
    "CST": "America/Guatemala",
    "CST": "America/Managua",
    "CST": "America/Mexico_City",
    "CST": "America/Regina",
    "CST": "Canada/Saskatchewan",
    "MDT": "US/Mountain",
    "-05": "America/Bogota",
    "EST": "America/Cancun",
    "CDT": "America/Chicago",
    "CDT": "US/Central",
    "-04": "America/Asuncion",
    "-04": "America/Caracas",
    "EDT": "America/Detroit",
    "EDT": "America/Indiana/Indianapolis",
    "EDT": "America/Louisville",
    "-04": "America/Manaus",
    "EDT": "America/New_York",
    "-04": "America/Santiago",
    "AST": "America/Santo_Domingo",
    "EDT": "America/Toronto",
    "EDT": "US/East-Indiana",
    "EDT": "US/Eastern",
    "-03": "America/Argentina/Buenos_Aires",
    "ADT": "America/Glace_Bay",
    "-03": "America/Montevideo",
    "-03": "America/Sao_Paulo",
    "ADT": "Canada/Atlantic",
    "NDT": "America/St_Johns",
    "NDT": "Canada/Newfoundland",
    "-02": "America/Noronha",
    "-02": "Etc/GMT+2",
    "-01": "America/Godthab",
    "-01": "Atlantic/Cape_Verde",
    "+00": "Atlantic/Azores",
    "UTC": "UTC",
    "CET": "Africa/Algiers",
    "+01": "Africa/Casablanca",
    "WAT": "Africa/Lagos",
    "WEST": "Atlantic/Canary",
    "BST": "Europe/London",
    "EET": "Africa/Cairo",
    "CAT": "Africa/Harare",
    "CEST": "Europe/Amsterdam",
    "CEST": "Europe/Belgrade",
    "CEST": "Europe/Brussels",
    "CEST": "Europe/Madrid",
    "CEST": "Europe/Oslo",
    "CEST": "Europe/Sarajevo",
    "EAT": "Africa/Nairobi",
    "+03": "Asia/Amman",
    "+03": "Asia/Baghdad",
    "IDT": "Asia/Jerusalem",
    "+03": "Asia/Kuwait",
    "+03": "Asia/Qatar",
    "EEST": "Europe/Athens",
    "EEST": "Europe/Bucharest",
    "EEST": "Europe/Helsinki",
    "MSK": "Europe/Moscow",
    "+0330": "Asia/Tehran",
    "+04": "Asia/Baku",
    "+04": "Asia/Dubai",
    "+0430": "Asia/Kabul",
    "PKT": "Asia/Karachi",
    "+05": "Asia/Yekaterinburg",
    "+05": "Asia/Karachi",
    "IST": "Asia/Calcutta",
    "+0530": "Asia/Colombo",
    "IST": "Asia/Kolkata",
    "+0545": "Asia/Kathmandu",
    "+06": "Asia/Almaty",
    "+06": "Asia/Dhaka",
    "+0630": "Asia/Rangoon",
    "+07": "Asia/Bangkok",
    "+07": "Asia/Krasnoyarsk",
    "+08": "Asia/Irkutsk",
    "+08": "Asia/Kuala_Lumpur",
    "CST": "Asia/Shanghai",
    "CST": "Asia/Taipei",
    "AWST": "Australia/Perth",
    "+09": "Asia/Seoul",
    "JST": "Asia/Tokyo",
    "+09": "Asia/Yakutsk",
    "ACST": "Australia/Adelaide",
    "ACST": "Australia/Darwin",
    "+10": "Asia/Vladivostok",
    "AEST": "Australia/Brisbane",
    "AEST": "Australia/Canberra",
    "AEST": "Australia/Hobart",
    "AEST": "Australia/Sydney",
    "ChST": "Pacific/Guam",
    "+11": "Asia/Magadan",
    "NZST": "Pacific/Auckland",
    "+12": "Pacific/Fiji",
    "+13": "Pacific/Tongatapu"
  };

  timezone = timezones[timezone] || '';
  if (timezone == '') {
    return 'timezone is required';
  }


  if (!title || title == '') {
    title = (data.full_name ?? "") + " - " + (data.full_address ?? "");
  }
  let startDate = data[weddingDateKey] || "";
  if (!startDate || startDate == '') {
    return 'wedding date is required';
  }
  return handleAppintmentSlots(data, startDate, timezone, title);
}

function handleAppintmentSlots(data, selectedDate, timezone, title = '', tries = 1) {
  let slot = getFreeSlot(selectedDate, timezone);
  let contact_id = data.contact_id;
  if (!slot) {
    let msg = 'All Slots Booked';
    createNote(contact_id, msg, selectedDate);
    return msg;
  } else {
    let appointmentData = {
      title,
      start_time: slot,
      contact_id
    };
    // Logger.log(appointmentData);
    createAppointmentInGHL(appointmentData).then(x => {
      console.log(x);
    }).catch(p => {
      // Logger.log(p);
      if (tries < 2) {
        return handleAppintmentSlots(data, selectedDate, timezone, title, tries + 1);
      } else {
        createNote(contact_id, x.message ?? "Booking Not Available", selectedDate);
        return 'Failed to create booking - ' + selectedDate;
      }

    });
    return 'trying to create booking - in case failed - note will be added';
  }
}
function getFreeSlot(selectedDate, timezone) {

  let startDate = new Date(selectedDate + "T00:00");
  let endDate = new Date(selectedDate + "T23:00");
  endDate.setDate(endDate.getDate() + 3);
  let response = makeApiCall(`https://backend.leadconnectorhq.com/appengine/appointment/free-slots?calendar_id=${calendarId}&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}&timezone=${timezone}&sendSeatsPerSlot=false`);
  response = JSON.parse(response);
  // console.log(response);
  let currentSlot = response[selectedDate] || {};
  if (currentSlot.slots && Array.isArray(currentSlot.slots)) {
    return currentSlot.slots[0];
  }
  return null;
  console.log(response);
}
function handleNextCharge(data) {

  let currentInstallment = data['Installment Paid'] || null;
  if (!currentInstallment || currentInstallment == '') {
    return 'Installment no is required';
  }
  let sheet = getActiveSheet(installmentSheet);
  let rows = getRows(sheet);
  let findIndex = -1;
  let record = rows.find((t, index) => {
    findIndex = index;
    return t[1].toString() == data.contact_id && t[7].toString() == currentInstallment;
  })
  if (record && findIndex > -1) {
    console.log(record);
    let time = getCurrentDate();
    record[0] = time;
    record[10] = time;
    let sheetlif = getActiveSheet(lifSheetName);
    sheetlif.appendRow(record);
    sheet.deleteRow(findIndex + 1);
    let customData = data.customData || {};
    let invoiceId = data['Last Invoice ID'] || customData['invoice_id'] || "";
    let amount = customData['amount'] || 0;
    if (invoiceId != '' && amount > 0) {
      recordManualPayment(invoiceId, amount);
    }

    //before insert update column Due Date and Due Amount of current record and update on the next side 
    // Paid Date and Paid Amount
    //insert to second sheet LIF
    //delete current record from sheet Installments
    return 'installment mark as paid';
  } else {
    return 'No installment found';
  }
  // find 
}

function handleRequest(selected_dates, calendar_id, contact_id, title = "") {
  let allDates = selected_dates.split(',').map(t => t.trim());

  allDates.forEach(startTime => {
    var appointmentData = {
      "calendar_id": calendar_id,
      "start_time": startTime,
      "contact_id": contact_id,
      title: title
    };
    createAppointmentInGHL(appointmentData);
  });
}

function createAppointmentInGHL(appointmentData, tries = 0) {

  var payload = JSON.stringify({
    "calendarId": calendarId,
    "locationId": locationId,
    "startTime": appointmentData.start_time,
    "contactId": appointmentData.contact_id,
    title: appointmentData.title,
  });
  return new Promise((res, rej) => {
    crmApiCall("calendars/events/appointments", privateIntegrationToken, "POST", payload, true).then(x => {
      if (!x.id) {
        rej(x);
      } else {
        res(x);
      }
    });
  })

}

function createNote(contact_id, message, date = '') {
  var note = "Wedding Booking Creation Failed\n\nDetail Below\nSelected Date: " + date;
  note += "\nReason: " + message;
  // Logger.log(note);
  addNoteToGHLContact(contact_id, note);
}

function addNoteToGHLContact(contact_id, note) {
  var payload = JSON.stringify({
    "body": note
  });

  crmApiCall('contacts/' + contact_id + '/notes', privateIntegrationToken, "POST", payload, true).then(x => {
    Logger.log("Note added to contact:", x);
  });
}

function makeApiCall(uri, method = 'get', payload = '', json = false, headers = {}) {

  let options = apiCallSetup(method, payload, json, headers);
  let data = doApiCall(uri, options);
  return data;
}

function crmApiCall(uri, token, method = "get", payload = "", json = false) {
  return new Promise((resolve, reject) => {
    var fullUrl = mainAuthUrl + uri;
    let headers = {
      Authorization: "Bearer " + token,
      Version: versionHeader
    };
    let data = makeApiCall(fullUrl, method, payload, json, headers);
    addLogs(['crmApiCall', data]);

    data = JSON.parse(data);
    if ((data?.message ?? '') == 'Invalid Private Integration token') {
      reject('Token Expire');
    }
    resolve(data);
  });
}

function doApiCall(fullUrl, options) {
  var url = UrlFetchApp.fetch(fullUrl, options);
  return url.getContentText();
}

function apiCallSetup(method, payload = '', json = false, headers = {}) {
  var options = {
    method: method,
    headers: headers,
    muteHttpExceptions: true,
    followRedirects: false,
  };

  if (json) {
    if (typeof payload == 'object') {
      payload = JSON.stringify(payload);
    }
    options["payload"] = payload;
    options["contentType"] = "application/json";
  } else {
    if (method.toLowerCase() != "get") {
      options["payload"] = payload;
    }
  }
  return options;
}

function addLogs(logdata) {
  try {
    //let sheet = getActiveSheet('Logs');
    // sheet.appendRow([getCurrentDate(), ...logdata])
  } catch (error) {

  }
}

function getCurrentDate(onlyDate = false) {
  let date = new Date();
  if (onlyDate) {
    return date.toISOString().split('T')[0];
  }
  return date.toLocaleString();
}
function getInstallments(data) {
  let currentInstallment = 1;
  let planType = data['How would you like to pay?'] || '';
  let installments = data['How many instalments would you like to pay in?'] || 1;
  if (planType == 'Pay In Full') {
    currentInstallment = 1;
    installments = 1;
  }
  return { installments, currentInstallment, planType };
}
function insertBookingEntry(data) {
  try {
    let sheet = getActiveSheet(lifSheetName);
    let { installments, currentInstallment, planType } = getInstallments(data);

    let currentTime = getCurrentDate();
    let totalAmount = data['Initial Payment'] || '';
    let initialRecords = [currentTime,
      data.contact_id || '',
      data.full_name || '',
      data[weddingDateKey] || '',
      data['Wedding Venue'] || '',
      totalAmount,
      planType];

    let discountPayment = data['Payment Discounts'];


    let totalItems = [data['No of Photographer'] || '',
    data['No of VideoGrapher'] || ''];

    let items = getItems(data, true);
    items.forEach(t => {
      totalItems.push(t.title + "|" + t.price);
    })

    let otherParts = [data['Nearest Base Location'] || '',
    data['Total Distance Miles'] || '',
      discountPayment];
    let row = [
      ...initialRecords,
      currentInstallment,
      installments,
      data['Due Amount'] || '',
      currentTime, ...otherParts,
      ...totalItems,
    ];

    if (installments > 1) {
      let installmentSheetr = getActiveSheet(installmentSheet);
      for (let i = 2; i <= installments; i++) {
        let installmentRow = [
          ...initialRecords,
          i,
          installments,
          data['Due Amount'] || '',
          "",
          ...otherParts,
          ...totalItems,
        ]
        installmentSheetr.appendRow(installmentRow);
      }
    }

    // Append the new row
    sheet.appendRow(row);
    return 'record inserted';
  } catch (err) {
    console.error('Error saving webhook data:', err);
    return err;

  }
}
function getItems(data, onlyItem = false) {
  try {
    let items = data['Product Items'] || "{}";

    items = JSON.parse(items);
    if (onlyItem) {
      return items?.items || [];
    }
    return items;
  } catch (err) {

  }
  if (onlyItem) {
    return [];
  }
  return {};
}


