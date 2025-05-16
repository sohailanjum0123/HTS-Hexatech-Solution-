      async function fetchInventory(
        afterCursor = "",
        filters = {},
        sorting = {}
      ) {
        try {
          toggleLoader(true);

          const localStorageKey = itemKey + afterCursor;
          let items = localStorage.getItem(localStorageKey);
          let parsedItems = items ? JSON.parse(items) : "";

          const isNewRequest = afterCursor === "";
          const hasFilters = Object.keys(filters).length > 0;

          if (parsedItems && !hasFilters) {
            handleInventoryData(parsedItems, isNewRequest, afterCursor, true);
          }

          const options = {
            method: "POST",
            body: JSON.stringify({
              limit: itemsPerPage,
              after: afterCursor,
              filters: filters,
              sorting: sorting,
              locationId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (parsedItems == "" || hasFilters) {
            const response = await fetch(`${url}list`, options);

            if (response.ok) {
              const data = await response.json();

              IsresponseOK(response, "");
              const isValid = IsresponseOK(response, data);
              if (!isValid) {
                return;
              }

              handleInventoryData(
                data,
                isNewRequest,
                afterCursor,
                hasFilters,
                false
              );
            } else {
              IsresponseOK(response, null);
            }
          }
        } catch (error) {
          console.error("Error fetching inventory:", error);
        } finally {
          toggleLoader(false);
        }
      }
