let parameters = null;
let mainauthurl = "https://services.leadconnectorhq.com/";
let QBmainauthurl = "https://appcenter.intuit.com/connect/oauth2";
let appDatamainValueIndex = 1;
let appDatamainClientIndex = 1;
let versionHeader = '2021-04-15';
let tokenapi = "";
let locationtimezone = "";
let refreshParam = "refresh_token";
let accessParam = "access_token";
let mainTokenSheetName = "Tokens";
let QBmainTokenSheetName = "QBTokens";
let locationIdcon = '';
let payloadKey = 'payloads';
let companyIdIndex = 0;
let locationIdIndex = 1;
let accessTokenIndex = 2;
let refreshTokenIndex = 3;
let userTypeIndex = 4;
let timeZoneIndex = 6;
function getActiveSheet(name) {
  try {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  } catch (err) { }
  return null;
}

function getParams(e) {
  return e.parameters;
}

function getRows(sheet) {
  return sheet.getDataRange().getValues();
}

function isUnd(all_params, key, retv = "string") {
  let parm = "";
  try {
    parm = all_params[key] ?? '';
    if (Array.isArray(parm)) {
      parm = parm[0] ?? '';
    }
    if (typeof parm == "object") {
      parm = parm[0] ?? parm;
    }
  } catch (e) { }

  return parm;
}

function appendDate(row) {
  row.push(new Date().toLocaleString());
  return row;
}

function appendRow(sheet, row, skipdt = false) {
  if (!skipdt) {
    row = appendDate(row);
  }

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function updateRow(sheet, rowIndex, newData, skipdt = false) {

  if (!skipdt) {
    newData = appendDate(newData);
  }
  var range = sheet.getRange(rowIndex, 1, 1, newData.length);
  range.setValues([newData]);
}

function getToken(locationId, type = accessParam, userType = userTypes.company) {
  return new Promise((resolve, reject) => {
    sheet = getActiveSheet(mainTokenSheetName);
    rows = getRows(sheet);

    if (locationId == 'all') {
      resolve(rows);

    }
    let token = "";
    let findIndex = userType == userTypes.company ? companyIdIndex : locationIdIndex;
    Logger.log(findIndex)
    let filteredRows = rows.find((t, index) => {
      return t[findIndex] == locationId;
    });
    if (filteredRows) {
      locationtimezone = filteredRows[timeZoneIndex] || "";
      let tokenIndex = type == accessParam ? accessTokenIndex : refreshTokenIndex;
      token = filteredRows[tokenIndex];

    }
    resolve(token);
  });
}

function updateLocationTokens() {
  getToken("all").then(rows => {
    rows.forEach((t, index) => {
      if (index > 0) {
        let findIndex = t[userTypeIndex] == userTypes.company ? companyIdIndex : locationIdIndex;
        updateLocationToken(t[findIndex]);
      }


    });
  });

}


function updateLocationToken(locationId) {
  getToken(locationId, refreshParam).then(token => {
    if (token != "") {
      oauthToken(token, refreshParam);
    }
  });
}

function getLocationToken(practice_id, tokenType) {
  return new Promise((resolve, reject) => {
    getToken(practice_id, tokenType)
      .then(token => {
        // Verify the token structure
        if (!token || token.length < 4) { // Adjust the number based on your token structure
          reject('Invalid or incomplete token data');
          return;
        }

        let accessToken = token[2] ?? '';
        let timezone = token[3] ?? '';
        let calendarId = token[9] ?? ''; // Adjust index according to the actual token array structure

        // Ensure all required fields are present
        if (!accessToken || !timezone || !calendarId) {
          reject('Missing required token information (accessToken, timezone, or calendarId)');
          return;
        }

        // Resolve with the token if all checks pass
        resolve({
          accessToken,
          timezone,
          calendarId,
        });
      })
      .catch(error => {
        Logger.log('Error fetching token: ' + error);
        reject(error);
      });
  });
}



function contactFinder(data, locationId, accessToken) {
  return new Promise((resolve, reject) => {
    let email = data.email ?? '';
    Logger.log(email)
    agencyApiCall(`contacts/?query=${email}&locationId=${locationId}`, accessToken).then(x => {
      Logger.log(x);
      if (x?.contacts) {
        let contactId = '';
        if (Array.isArray(x.contacts) && x.contacts.length > 0) {
          contactId = x.contacts[0].id;
          resolve(contactId);
        } else {
          let contactData = {
            "firstName": "Rosan",
            "lastName": "Deo",
            "name": data.name,
            "email": email,
            "locationId": locationId,
          }
          agencyApiCall(`contacts/?query=${email}&locationId=${locationId}`, accessToken, 'POST', contactData, true).then(x => {
            Logger.log(x);
            if (x?.contact) {
              contactId = x.contact.id;
              resolve(contactId);
            } else {
              reject('');
            }
          })
        }
      }

    })


  });
}

function appointmentCreater(data) {
  getLocationToken(data.practice_id, 8).then(token => {

    saveLogs = true;
    let accessToken = token[2] ?? '';
    let locationId = 'HuVkfWx59Pv4mUMgGRTp';

    let userId = token[3] ?? '';
    let calendarId = token[9] ?? '';

    if (locationId == '' || calendarId == '' || accessToken == '') {
      return;
    }
    let timezone = token[3] ?? '';
    let email = data.data.patient.email1 ?? '' ?? '';
    let name1 = data.data.patient.first + ' ' + data.data.patient.last ?? '';
    // 2024-03-15 18:10

    function timeZoneChecker(datetime, timezone) {
      datetime = datetime.trim();
      if (datetime != '') {
        if (!datetime.includes('T')) {
          datetime = datetime.replace(' ', 'T');
        }
        if (!datetime.includes('+') && !datetime.includes('-')) {
          datetime = datetime + timezone.replace("'", '');
        }
      }

      return datetime;
    }
    let method = 'POST';
    let appoSheet = getActiveSheet('Appo');
    let appointIndex = -1;
    let appointId = '';
    let type = data.event_type ?? '';
    let cerboAppointId = data.data.id;

    let calendarURL = 'calendars/events/appointments';
    let isDeleteHook = type == 'schedule.removed';
    if (type == 'schedule.modified' || isDeleteHook) {
      let rows = getRows(appoSheet);
      let appointment = rows.filter((t, index) => {
        appointIndex = index;//for later updating exact row index
        return t[2].toString() == cerboAppointId.toString();
      });


      if (appointment.length > 0) {
        appointment = appointment[0];
        appointId = (appointment[3] ?? '').trim();
        if (appointId != '') {
          method = 'PUT';
          if (isDeleteHook) {
            calendarURL = calendarURL.replace('/appointments', '');
            method = 'DELETE';
          }
          calendarURL += '/' + appointId;
        } else {
          if (isDeleteHook) {
            return;
          }
        }
      }
      // Logger.log(calendarURL);
    }
    let startTime = timeZoneChecker((data.data.start ?? ''), timezone);
    let endTime = timeZoneChecker((data.data.end ?? ''), timezone);
    Logger.log([startTime, endTime])
    if (startTime != '') {
      contactFinder(data, locationId, accessToken).then(contactId => {
        Logger.log(contactId)
        let isJSON = true;
        let appointData = {
          "calendarId": calendarId,
          "locationId": locationId,
          "contactId": contactId,
          "startTime": startTime,
          "endTime": endTime,
          "title": data.data.title + " - " + name1,
        };
        if (isDeleteHook) {
          appointData = '';
          isJSON = false;
        }
        agencyApiCall(calendarURL, accessToken, method, appointData, isJSON).then(t => {
          Logger.log(t);
          if (t.id) {
            let data = [contactId, email, cerboAppointId, t.id];
            if (appointIndex > 0) {
              updateRow(appoSheet, appointIndex + 1, data);
            } else {
              appendRow(appoSheet, data);
            }
          }
        })
      })
    }


  });
}



function QBgetFullUrl() {
  let sheet = getActiveSheet("QBAppData");
  let rows = getRows(sheet);
  let uri = "";
  try {
    uri = rows[5][appDatamainValueIndex];
  } catch (err) { }


  return `${QBmainauthurl}?client_id=${rows[appDatamainClientIndex][appDatamainValueIndex]}&redirect_uri=${encodeURIComponent(uri)}&response_type=code&state=2&scope=${encodeURIComponent(rows[3][appDatamainValueIndex])}`;

}

function getFullUrl() {
  let sheet = getActiveSheet("AppData");
  let rows = getRows(sheet);
  let uri = "";
  try {
    uri = rows[5][appDatamainValueIndex];
  } catch (err) { }

  let isWhitelabel = false;

  let mainDomain = !isWhitelabel ? 'gohighlevel' : 'leadconnectorhq';
  return `https://marketplace.${mainDomain}.com/oauth/chooselocation?response_type=code&redirect_uri=${uri}&client_id=${rows[appDatamainClientIndex][appDatamainValueIndex]}&scope=${rows[3][appDatamainValueIndex]}`;
}


let userTypes = {
  location: 'Location',
  company: 'Company'
}

function oauthToken(code, type = "authorization_code") {
  return new Promise((resolve, reject) => {
    var fullUrl = mainauthurl + "oauth/token";
    let sheet = getActiveSheet("AppData");
    if (!sheet) {
      return reject('');
    }
    let rows = getRows(sheet);


    let keytype = type == refreshParam ? refreshParam : "code";
    let payload = {
      grant_type: type,
      client_id: rows[appDatamainClientIndex][appDatamainValueIndex],
      client_secret: rows[2][appDatamainValueIndex]
    };
    payload[keytype] = code;
    var options = {
      method: "POST",
      followRedirects: false,
      muteHttpExceptions: true,
      payload: payload
    };
    let data = doApiCall(fullUrl, options);
    data = JSON.parse(data);
    addLogs(["GHLData", data])
    let token = "";
    if (data && data?.access_token) {
      locationIdcon = data.locationId ?? '';
      sheet = getActiveSheet(mainTokenSheetName);
      rows = getRows(sheet);
      let findIndex = -1;

      let userType = data.userType ?? userTypes.location;

      let row = [];
      if (userType == userTypes.location) {
        findIndex = rows.findIndex((t, index) => {
          return t[locationIdIndex] == locationIdcon;
        });
        makeApiCall('locations/' + locationIdcon, data.access_token).then(x => {
          row = [
            data.companyId,
            locationIdcon,
            data.access_token,
            data.refresh_token,
            data?.userType,
            x?.location?.name,
            x?.location?.timezone
          ];
          locationtimezone = x?.location?.timezone;
          if (findIndex > -1) {
            updateRow(sheet, findIndex + 1, row);
          } else {
            appendRow(sheet, row);
          }
        })
      } else {
        findIndex = rows.findIndex((t, index) => {
          return t[companyIdIndex] == data.companyId;
        });

        makeApiCall('companies/' + data.companyId, data.access_token).then(x => {
          locationtimezone = x?.company?.timezone;
          row = [
            data.companyId,
            '',
            data.access_token,
            data.refresh_token,
            data?.userType,
            x?.company?.name,
            x?.company?.timezone
          ];

          if (findIndex > -1) {
            updateRow(sheet, findIndex + 1, row);
          } else {
            appendRow(sheet, row);
          }
        })
      }



      token = data.access_token;

    }
    if (token != "") {
      resolve(token);
    }
    reject(data);
  });
}
function buildQuery(data) {
  return Object.keys(data)
    .map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    })
    .join('&');
}

function getQuickBooksRealmId(code, type="authorization_code") {
  return new Promise((resolve, reject) => {
    const fullUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    const sheet = getActiveSheet("QBAppData");
    if (!sheet) return reject('Sheet not found');

    const rows = getRows(sheet);
    const clientId = rows[appDatamainClientIndex][appDatamainValueIndex];
    const clientSecret = rows[2][appDatamainValueIndex];
    const redirectUri = rows[5][appDatamainValueIndex];

 let keytype = type == refreshParam ? refreshParam : "code";
    const payload = {
      grant_type: type,
      redirect_uri: redirectUri
    };
    payload[keytype] = code;
    const headers = {
      'Authorization': 'Basic ' + Utilities.base64Encode(clientId + ':' + clientSecret),
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const options = {
      method: 'post',
      payload: buildQuery(payload),
      headers: headers,
      followRedirects: false,
      muteHttpExceptions: true
    };

    const data = doApiCall(fullUrl, options);
    const parsedData = JSON.parse(data);

    addLogs(["QBData", data])

    if (parsedData && parsedData.access_token) {
      const tokenSheet = getActiveSheet(QBmainTokenSheetName);
      const tokenRows = getRows(tokenSheet);

      const row = [
        parsedData.expires_in,
        parsedData.id_token || "",
        parsedData.access_token,
        parsedData.refresh_token,
        new Date().toISOString()
      ];

      const findIndex = -1; 
      if (findIndex > -1) {
        updateRow(tokenSheet, findIndex + 1, row);
      } else {
        appendRow(tokenSheet, row);
      }

      resolve(parsedData.access_token);
    } else {
      reject(parsedData || 'Failed to retrieve token');
    }
  });
}

function refreshAccessToken() {
  const tokenSheet = getActiveSheet(QBmainTokenSheetName);
  if (!tokenSheet) throw new Error("Token sheet not found");

  const rows = getRows(tokenSheet);
  const refreshToken = rows[0][3]; // Assuming refresh_token is in column D
  const clientId = rows[appDatamainClientIndex][appDatamainValueIndex];
  const clientSecret = rows[2][appDatamainValueIndex];
  const fullUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };

  const headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(clientId + ':' + clientSecret),
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const options = {
    method: 'post',
    payload: buildQuery(payload),
    headers: headers,
    followRedirects: false,
    muteHttpExceptions: true
  };

  const data = doApiCall(fullUrl, options);
  const parsedData = JSON.parse(data);

  if (parsedData && parsedData.access_token) {
    const row = [
      parsedData.expires_in,
      parsedData.id_token || "",
      parsedData.access_token,
      parsedData.refresh_token,
      new Date().toISOString() // Save token refresh time
    ];

    updateRow(tokenSheet, 1, row); // Update the first row with new token data
    Logger.log("Access token refreshed successfully");
    return parsedData.access_token;
  } else {
    throw new Error("Failed to refresh token: " + JSON.stringify(parsedData));
  }
}

function isTokenExpired() {
  const tokenSheet = getActiveSheet(QBmainTokenSheetName);
  if (!tokenSheet) throw new Error("Token sheet not found");

  const rows = getRows(tokenSheet);
  const tokenCreationTime = new Date(rows[0][5]); 
  const expiresIn = parseInt(rows[0][0]); 

  const expirationTime = new Date(tokenCreationTime.getTime() + expiresIn * 1000);
  const now = new Date();

  return now >= expirationTime;
}

function handleQuickBooksApiCall() {
  if (isTokenExpired()) {
    Logger.log("Access token expired. Refreshing...");
    const newAccessToken = refreshAccessToken();
    Logger.log("New Access Token: " + newAccessToken);
  } else {
    Logger.log("Access token is valid. Proceeding with API call...");
    // Use the existing token for API calls
  }
}

function checkTokenExp(text) {
  if (typeof text !== "string") {
    return false;
  }
  text = text.toLowerCase();

  return (text.includes('access') && (text.includes('expired')) || text.includes('invalid') || text.includes('unauthorized'));
}

function doApiCall(fullUrl, options) {
  var url = UrlFetchApp.fetch(fullUrl, options);
  return url.getContentText();

}
function makeApiCall(
  uri,
  token,
  locationId = "",
  method = "get",
  payload = "",
  json = false
) {
  // versionHeader = '2021-04-15';
  // if (versionHeader == "") {
  //   let sheet = getActiveSheet("AppData");
  //   let rows = getRows(sheet);

  //   versionHeader = formatDate(rows[4][1], "yyyy-MM-dd");
  // }
  return new Promise((resolve, reject) => {
    var fullUrl = mainauthurl + uri;
    let options = apiCallSetup(method, token, payload, versionHeader, json);

    let data = doApiCall(fullUrl, options);
    data = JSON.parse(data);
    if (data && data?.statusCode) {
      handleRefreshCheck(locationId, data, false).then(p => {
        resolve(p);
      }).catch(p => {
        reject(p);
      })
    } else {
      resolve(data);
    }
  });
}
function handleRefreshCheck(locationId, data, isCompany = false) {
  return new Promise((resolve, reject) => {
    if (data.statusCode == 401 && data?.message) {
      if (checkTokenExp(data.message) || checkTokenExp(data.error)) {
        let userType = isCompany ? userTypes.company : userTypes.location;
        getToken(locationId, refreshParam, userType).then(refresh => {
          if (refresh != "") {
            oauthToken(refresh, refreshParam).then((x) => {
              if (isCompany) {
                agencyApiCall(uri, x, locationId, method, payload, json).then(x => {
                  resolve(x);
                })
              } else {
                makeApiCall(uri, x, locationId, method, payload, json).then(x => {
                  resolve(x);
                })
              }

            }).catch(p => {
              if (isCompany) {
                reject(p);
              }
              if (p?.error == 'invalid_grant' || p?.error_description.includes('refresh token is invalid')) {
                let sheet = getActiveSheet(mainTokenSheetName);
                let rows = getRows(sheet);
                let location = rows.find(t => t[locationIdIndex] == locationId);
                if (location) {
                  let company = rows.find(t => t[companyIdIndex] == location[companyIdIndex] && t[userTypeIndex] == userTypes.company);
                  if (company) {
                    connectLocation(locationId, company[companyIdIndex], company[accessTokenIndex]).then(token => {
                      makeApiCall(uri, token, locationId, method, payload, json).then(x => {
                        resolve(x);
                      })
                    }).catch(o => {
                      reject(o);
                    })
                  } else {
                    reject(data);
                  }

                } else {
                  reject(data);
                }
              } else {
                reject(data);
              }

            });
          } else {
            reject(data);
          }
        })

      } else {
        reject(data);
      }
    } else {
      reject(data);
    }
  })
}

function apiCallSetup(method, token, payload, versionHeader = '', json = false, headers = {}) {
  var options = {
    method: method,

    headers: {
      Authorization: "Bearer " + token,
      Version: versionHeader,
      ...headers
    },
    muteHttpExceptions: true,
    followRedirects: false,
  };
  if (json) {
    options["payload"] = JSON.stringify(payload);
    options["contentType"] = "application/json";
  } else {
    if (method != "get") {
      options["payload"] = payload;
    }
  }
  return options;
}
function agencyApiCall(
  uri,
  token,
  companyId = "",
  method = "get",
  payload = "",
  json = false
) {
  // versionHeader = '2021-04-15';
  // if (versionHeader == "") {
  //   let sheet = getActiveSheet("AppData");
  //   let rows = getRows(sheet);

  //   versionHeader = formatDate(rows[4][1], "yyyy-MM-dd");
  // }
  return new Promise((resolve, reject) => {
    var fullUrl = mainauthurl + uri;

    let options = apiCallSetup(method, token, payload, versionHeader, json);
    let data = doApiCall(fullUrl, options);
    addLogs(['AgencyAPICALL', data]);
    data = JSON.parse(data);
    if (data && data?.statusCode) {
      handleRefreshCheck(companyId, data, true).then(p => {
        resolve(p);
      }).catch(p => {
        reject(p);
      })
    } else {
      resolve(data);
    }
  });
}

function removeBraces(str, replacement = '') {
  var regex = /[{}' ']/g;
  return str.replace(regex, replacement);
}

function getCustomField(locationId, token) {
  return new Promise((resolve, reject) => {
    makeApiCall(`locations/${locationId}/customFields`, token, locationId).then(
      (t) => {
        if (t?.customFields) {
          let cf = removeBraces(customfieldkey);
          let field_exists = t.customFields.find((x) => {
            return removeBraces(x.fieldKey) == cf;
          });
          if (field_exists) {
            resolve(field_exists.id);
          } else {
            var regex = /[{}' ']/g;
            let cfield = {
              name: removeBraces(x.fieldKey).replace(regex, ' '),
              dataType: "TEXT",
            };
            makeApiCall(`locations/${locationId}/customFields`, token, locationId, 'Post', cfield, true).then(x => {
              if (x?.customField) {
                resolve(x.customField.id);
              }
            });
          }

        }
      }
    );
  });

}


function getCustomValues(locationId, token) {
  return new Promise((resolve, reject) => {
    makeApiCall(`locations/${locationId}/customValues`, token, locationId).then(
      (t) => {
        if (t?.customFields) {
          resolve(t.customFields);
          let cf = removeBraces(customfieldkey);
          let field_exists = t.customFields.find((x) => {
            return removeBraces(x.fieldKey) == cf;
          });
          if (field_exists) {
            resolve(field_exists.id);
          } else {
            resolve([]);
            var regex = /[{}' ']/g;
            let cfield = {
              name: removeBraces(x.fieldKey).replace(regex, ' '),
              dataType: "TEXT",
            };
            makeApiCall(`locations/${locationId}/customValues`, token, locationId, 'Post', cfield, true).then(x => {
              if (x?.customField) {
                resolve(x.customField.id);
              }
            });
          }

        }
      }
    );
  });

}






function removeTag(arr, strToRemove) {
  return arr.filter(function (str) {
    return str !== strToRemove;
  });
}





function updateContact(contactId, locationId, token, newData) {

  makeApiCall(
    `contacts/${contactId}`,
    token,
    locationId,
    'put', newData, true
  ).then((t) => {
    addLogs(['updateContactSuccess', JSON.stringify(t)]);

  }).catch(x => {
    addLogs(['updateContactFailed', JSON.stringify(x)]);
  });
}


function getContact(contactId, locationId, token) {
  makeApiCall(
    `contacts/${contactId}`,
    token,
    locationId
  ).then((t) => {
    if (t?.contact) {
      let contact = t.contact;
      if (contact?.phone) {
        handleDND(contact, locationId, token);
      }
    }

  });
}
function addLogs(logdata) {
  let logDataSheetName = "Logs"; // Default sheet name

  // Check if the "Logs" sheet exists
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(logDataSheetName);

  // If "Logs" does not exist, assign "QBLogs"
  if (!sheet) {
    logDataSheetName = "QBLogs";
    sheet = spreadsheet.getSheetByName(logDataSheetName);

    if (!sheet) {
      throw new Error(`Neither "Logs" nor "QBLogs" sheets exist.`);
    }
  }

  try {
    // Append the log data
    appendRow(sheet, logdata);
    return true;
  } catch (error) {
    console.error("Error in addLogs:", error.message);
    Logger.log(error);
    return false;
  }
}


function addTriggers(logdata) {
  try {
    let sheet = getActiveSheet('Triggers');
    let lastIndex = appendRow(sheet, logdata);

    sheet.getRange('D' + (lastIndex)).setValue('1');
    //updateRow(sheet,lastIndex,logdata);
  } catch (error) {

  }
}

function filter_tags(tags) {
  try {
    if (typeof tags == 'string') {
      tags = tags.split(',');

    }
  } catch (error) {
    tags = [];
  }
  return tags.filter(x => {
    return !allowedtags.some(t => {
      return t == x;
    });
  });
}

function keyCreate(name) {
  name = name.toLowerCase();
  return name.replace(' ', '_');
}

function handleWebhook(data) {
  if (data?.type) {
    addLogs(['handleWebhook', JSON.stringify(data)]);
    if (['LocationCreate'].includes(data.type)) {
      let sheet = getActiveSheet('Locations');
      let rows = getRows(sheet);
      let isNotUnique = true;
      let uniqueId = '';
      do {
        uniqueId = Utilities.getUuid();
        let findIndex = rows.findIndex(t => {
          return t[0] == uniqueId;
        })
        isNotUnique = findIndex > 0;
      } while (isNotUnique);
      appendRow(sheet, [uniqueId, data.id, data.name, data.companyId]);
      let cvalue = {
        name: 'Site ID',
        value: uniqueId
      };

      let companyid = data.companyId;
      getToken(companyid, accessParam).then(token => {
        connectLocation(data.id, companyid, token).then(token => {
          let cvURL = `locations/${data.id}/customValues`;
          makeApiCall(cvURL, token, data.id).then(x => {
            let customValues = x.customValues ?? [];
            let customFieldId = customValues.find(cv => {
              let cvkey = keyCreate(cvalue.name);
              return cv.fieldKey.includes(cvkey);
            })?.id;

            let method = 'post';
            if (customFieldId) {
              cvURL += '/' + customFieldId;
              method = 'put';
            }
            makeApiCall(cvURL, token, data.id, method, cvalue, true).then(x => { });


          });
        }).catch(p => {

        });
      });
    }

    if (['EnvelopeCreate'].includes(data.type)) {
      let locationId = data.locationId;
      getToken(locationId, accessParam, userTypes.location).then(token => {
        let contactData = {
          customFields: [
            {
              key: data.fieldKey,
              value: data.envelopeId
            }
          ]
        }
        makeApiCall('contacts/' + data.contactId, token, locationId, 'put', contactData, true).then(x => {
          Logger.log(x);


        });
      });
    }
    if (['EnvelopeTag'].includes(data.type)) {
      let documentName = data.documentName ?? '';
      let contactEmail = data.contactEmail ?? '';
      let currentTag = '';
      if (documentName != '' && contactEmail != '') {
        let allDocs = documentName.split('-');

        currentTag = allDocs[1] ?? '';
        let siteId = allDocs[0] ?? '';
        if (currentTag != '' && siteId != '') {
          let sheet = getActiveSheet('Locations');
          let rows = getRows(sheet);
          let location = rows.find(t => {
            return t[0] == siteId;
          });
          if (location) {

            let locationId = location[1] ?? '';
            if (locationId != '') {

              getToken(locationId, accessParam, userTypes.location).then(token => {
                let contactData = {
                  "tags": [
                    currentTag
                  ]
                }
                let filters = {
                  "locationId": locationId,
                  "filters": [
                    {
                      "field": "email",
                      "operator": "eq",
                      "value": contactEmail
                    }
                  ],
                  page: 1,
                  pageLimit: 1
                };
                makeApiCall('contacts/search', token, locationId, 'post', filters, true).then(x => {

                  let contacts = x.contacts ?? [];
                  let contact = contacts[0] ?? null;
                  if (contact) {
                    makeApiCall('contacts/' + contact.id + '/tags', token, locationId, 'post', contactData, true).then(x1 => {

                    });
                  }

                }).catch(p => {

                })

              });
            }
          }


        }
      }


    }
    if (data?.locationId) {
      // getToken(locationId1).then(async (loctoken)=>{
      //   if(['LocationCreate'].includes(data.type)){
      //        let sheet  = getActiveSheet('Locations');
      //        let uniqueId = Utilities.getUuid();
      //        appendRow(sheet,[uniqueId,data.id,data.name,data.companyId]); 
      //   }
      let locationId1 = data.locationId;
      //   if(['ContactCreate','OutboundMessage','ContactTagUpdate'].includes(data.type)){    
      //   }
      // });
    }
  }
}

function connectLocation(locationId, companyId, token) {
  return new Promise((resolve, reject) => {
    var formData = {
      companyId: companyId,
      locationId: locationId
    };

    var payload = [];
    for (var key in formData) {
      if (formData.hasOwnProperty(key)) {
        payload.push(encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]));
      }
    }
    var payloadString = payload.join('&');
    let options = apiCallSetup('POST', token, payloadString, '2021-07-28', false, { 'Content-Type': 'application/x-www-form-urlencoded' })
    let data = doApiCall(mainauthurl + 'oauth/locationToken', options);
    data = JSON.parse(data);
    Logger.log(data)
    if (data && data?.statusCode) {

      if (data.statusCode == 401 && data?.message) {
        if (checkTokenExp(data.message) || checkTokenExp(data.error)) {
          getToken(companyId, refreshParam).then(refresh => {
            if (refresh != "") {
              oauthToken(refresh, refreshParam).then((x) => {
                connectLocation(locationId, companyId, x).then(x => {
                  resolve(x);
                });
              });
            } else {
              reject("Invalid a ");
            }
          }).catch(x => {
            reject('invalid b');
          });

        }
      }
    } else if (data && data?.access_token) {

      let accessToken = data.access_token;

      sheet = getActiveSheet(mainTokenSheetName);
      rows = getRows(sheet);
      let findIndex = -1;
      let userType = userTypes.location;
      findIndex = rows.findIndex((t, index) => {
        return t[locationIdIndex] == locationId;
      });
      let row = [
        companyId,
        locationId,
        data.access_token,
        data.refresh_token,
        userType,
        '',
        ''
      ];
      if (findIndex > -1) {
        updateRow(sheet, findIndex + 1, row);
      } else {
        appendRow(sheet, row);
      }
      resolve(accessToken);
    } else {
      reject('Invalid response data');
    }
  });
}


function getLocations() {

  // handleWebhook({
  //   "type": "LocationCreate",
  //   "id": "JoqQ51Bl3LEmR42l6LrG",
  //   "companyId": "oEEb4PRxpIyxEV1LxLea",
  //   "name": "Sohail  1223 44444 222  34343434",
  // });

  // handleWebhook({
  //   "type": "EnvelopeCreate",
  //   "locationId": "Q6sATpsoSLCPFf5ErtoF",
  //   "contactId": '9x77lQKwW9nDArrtslRI',
  //   "fieldKey": "vehicle",
  //   "envelopeId": "SohailDekhRaha Hai",
  // });

  // handleWebhook({
  //   "type": "EnvelopeTag",
  //   "contactEmail": "admin+sa@crmsupportteam.com",
  //   "documentName": '512-PSDR-2024',
  // });


  // locationIdcon = 'JoqQ51Bl3LEmR42l6LrG';
  // getToken(locationIdcon, accessParam, userTypes.location).then(token => {

  //   makeApiCall('locations/' + locationIdcon, token, locationIdcon).then(t => {

  //     Logger.log(t);
  //   })
  // })
  // return;
  let companyid = 'woMsQK4yjLjGCHfTvHLX';
  getToken(companyid, accessParam).then(token => {

    agencyApiCall('locations/search', token, companyid).then(t => {

      if (t.locations) {
        t.locations.forEach(x => {
          Logger.log(x);
          connectLocation(x.id, companyid);
        })
      }
    })
  })

}


function onEdit(e) {
  // addLogs([JSON.stringify(e)]);
}




function doPost(e) {
  var msg = 'Received';
  const response = ContentService
    .createTextOutput(msg)
    .setMimeType(ContentService.MimeType.JSON);
  var jsonString = '';
  try {
    jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    Logger.log(data);
    handleWebhook(data);
  } catch (err) {
    msg = err;
  }


  // addToBackground('handleBackground', 35);

  return ContentService.createTextOutput(msg);
}


function addToBackground(func, time = 5) {
  ScriptApp.newTrigger(func)
    .timeBased()
    .after(time * 1000)
    .create();
}

function doGet(e) {
  let message = 'request_received';

  let parameters = getParams(e);
  let code = isUnd(parameters, "code");
  let action = isUnd(parameters, "action");
  if (code != '') {
    if (parameters.hasOwnProperty('state')) {
      getQuickBooksRealmId(code);
    } else {
      oauthToken(code);
    }
    return HtmlService.createHtmlOutput(`Connected to CRM`);
  }
  else if (action != '') {

    if (action == "fullUrl") {
      let fullurl = getFullUrl();
      return HtmlService.createHtmlOutput(
        `<a href="${fullurl}" target="_blank">Click Here to Connect HL_CRM</a>`
      );
    }
    if (action == "qbfullUrl") {
      let fullurl = QBgetFullUrl();
      return HtmlService.createHtmlOutput(
        `<a href="${fullurl}" target="_blank">Click Here to Connect QB_CRM</a>`
      );
    }
    if (action == refreshParam) {
      message = "Refresh Token Init";
      const response = ContentService
        .createTextOutput(message)
        .setMimeType(ContentService.MimeType.JSON);
      addToBackground('updateLocationTokens');
      return response;
    }

  } else {
    return ContentService.createTextOutput("Invalid request");
  }

}
