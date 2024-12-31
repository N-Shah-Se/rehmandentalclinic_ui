
// // Data table initlization
function initializeDatatable(tableSelector, options, tableNo, exportColumnsArray) {
    // Convrt the options recived to json formate
    let columnIndex = -1
  
    // Loop through each th element in the first row of the table header
    $(`#${tableSelector} thead tr:first th`).each(function (index) {
      const headerText = $(this).text().trim().toLowerCase()
  
      // Check if the header text contains 'action' or 'actions'
      if (headerText.includes('action') || headerText.includes('actions')) {
        columnIndex = index
      }
    })
  
  
    options = JSON.parse(options)
    if (columnIndex != -1) {
      options.columnDefs.push({
        targets: [columnIndex],
        orderable: false
      })
    }
    // Defult buttons for data table
    const defaultButtons = [
      {
        extend: 'copy',
        className: 'd-none'
  
      },
      {
        extend: 'excel',
        className: 'd-none',
        text: 'Export XLSX',
        exportOptions: {
          title: "category",
          columns: exportColumnsArray
        }
      },
      {
        extend: 'csv',
        className: 'd-none',
        text: 'Export CSV',
        exportOptions: {
          columns: exportColumnsArray
        }
      },
      {
        extend: 'pdf',
        className: 'd-none'
      },
      {
        extend: 'print',
        className: 'd-none'
  
      }
    ]
    // data table initlization
    HSCore.components.HSDatatables.init($(`#${tableSelector}`), {
      dom: options.dom || 'Bfrtip',
      columnDefs: options.columnDefs,
      order: options.order || [],
      info: {
        totalQty: '#datatableWithPaginationInfoTotalQty' + tableNo
      },
      search: '#datatableSearch' + tableNo,
      entries: '#datatableEntries' + tableNo,
      pageLength: options.pageLength,
      isResponsive: options.isResponsive,
      isShowPaging: options.isShowPaging,
  
      // scrolly: true,
      // scrollX: true,
      fixedColumns: true,
      scrollCollapse: true,
  
      pagination: 'datatablePagination' + tableNo,
      buttons: defaultButtons,
      language: {
        zeroRecords: `<div class="text-center p-4">
           
            <p class="mb-0 noDataToShow"  id="noDataToShow">No data to show.</p>
            </div>`
      }
    })
    // To get Recent create table from the list
    const datatable = HSCore.components.HSDatatables.getItem(`${tableSelector}`)
    // Table buttons to export data
    $('#export-copy' + tableNo).click(function () {
      datatable.button('.buttons-copy').trigger()
    })
    $('#export-excel' + tableNo).on('click', function () {
      datatable.button('.buttons-excel').trigger()
      console.log('clicked')
    })
    $('#export-csv' + tableNo).click(function () {
      datatable.button('.buttons-csv').trigger()
    })
    $('#export-pdf' + tableNo).click(function () {
      datatable.button('.buttons-pdf').trigger()
    })
    $('#export-print' + tableNo).click(function () {
      datatable.button('.buttons-print').trigger()
    })
    // Return Table object
    return datatable
  }
  
  const apiCalled = false // Flag to track API call
  
  // Function for datatable pagination
  function datatablePagination(tableSelector, tableNo, totalNoOfRecords, funcationToCall, dataTableSearch, inputName) {
    const table = $(`#${tableSelector}`).DataTable()
    const pageInfo = table.page.info()
    const totalPagesNo = pageInfo.pages
    // FOOTER DETAL FOR SINGLE ENTERIES
    if (Number(localStorage.getItem(totalNoOfRecords)) == 1) {
      const tableInfo = $(`#datatableWithPaginationInfoTotalQty${tableNo}`)
      const newInfo = `Showing ${1} to ${1} of ${1} entries`
      tableInfo.text(newInfo)
      $('#datatablePagination' + tableNo).css('display', 'block')
      return 0
    }
  
    // Table draw funcation
    $(`#${tableSelector}`).on('draw.dt', function (e, settings) {
      const api = settings.oInstance.api()
      const pageInfo = api.page.info()
      const start = pageInfo.start
      const end = pageInfo.end
      const currentPage = pageInfo.page
      const totalPages = pageInfo.pages
  
      // Geting data form local storage and filter
      const entriesPerPage = Number($('#datatableEntries' + tableNo).val())
      const totalResults = Number(localStorage.getItem(`${totalNoOfRecords}`))
      // To calculate the total number of pages based on the total number of records avialb in the backend
      const totalNoOfPages = Math.floor((totalResults + (entriesPerPage - 1)) / entriesPerPage)
  
      // Event listner for next button click
      $('.paginate_item > .next').on('click', function (event) {
        event.stopImmediatePropagation()
        // alert(currentPage)
        console.log(apiCalled, 'apiCalled First if')
        // Next button was clicked and API call not already made
        // console.log('Entriess per page', entriesPerPage, 'total pages ', totalPages, ' current page', currentPage + 1)
        if (((currentPage + 1) === totalPages) && (currentPage < totalNoOfPages)) {
          $(`#${tableSelector}_pagination`).append('<div class="d-flex justify-content-center" ><div class="spinner-border" role="status" style="color: #631212;width: 2rem; height: 2rem" ></div></div>')
          $(this).hide()
          // API Call
          funcationToCall(entriesPerPage, totalPages + 1)
        }
      })
      // Table info Update
      const tableInfo = $(`#datatableWithPaginationInfoTotalQty${tableNo}`)
      const newInfo = `Showing ${start + 1} to ${end} of ${totalResults} entries`
      tableInfo.text(newInfo)
  
      // To show and acitvate next button for API calls
      $('#datatablePagination' + tableNo).css('display', 'block')
      const pagination = document.getElementById(`${tableSelector}_next`)
      const pageItem = pagination.parentNode
      if (currentPage + 1 < totalNoOfPages && pageItem) {
        pageItem.classList.remove('disabled')
      } else {
        pageItem.classList.add('disabled')
      }
    })
  
    // Find the next button
    const nextButton = $(`#${tableSelector}_next`)
    // Get the parent <li> element
    const parentListItem = nextButton.closest('li')
    // Get the previous <li> element
    const previousListItem = parentListItem.prev()
    // Add the "active" class to the previous <li> element
    previousListItem.addClass('active')
    // Find the <a> tag inside the previous <li> element
    const previousLink = previousListItem.find('a')
    // Trigger the click event on the <a> tag
    previousLink.click()
  }
  
  // function for no pagination on datatable
  function datatableNoPagination(tableSelector, tableNo, totalNoOfRecords, funcationToCall, dataTableSearch, inputName) {
    const table = $(`#${tableSelector}`).DataTable()
    const pageInfo = table.page.info()
    // Gating data form local storage and filter
    // Table info Update
    // FOOTER DETAL FOR SINGLE ENTERIES
    if (Number(localStorage.getItem(`${totalNoOfRecords}`)) == 1) {
      const tableInfo = $(`#datatableWithPaginationInfoTotalQty${tableNo}`)
      const newInfo = `Showing ${1} to ${1} of ${1} entries`
      tableInfo.text(newInfo)
      $('#datatablePagination' + tableNo).css('display', 'block')
      return 0
    } else {
      // Table draw funcation
      $(`#${tableSelector}`).on('draw.dt', function (e, settings) {
        const api = settings.oInstance.api()
        const pageInfo = api.page.info()
        const start = pageInfo.start
        const end = pageInfo.end
  
        // Gating data form local storage and filter
        const totalResults = Number(localStorage.getItem(`${totalNoOfRecords}`))
  
        // Table info Update
        const tableInfo = $(`#datatableWithPaginationInfoTotalQty${tableNo}`)
        const newInfo = `Showing ${start + 1} to ${end} of ${totalResults} entries`
        tableInfo.text(newInfo)
        $('#datatablePagination' + tableNo).css('display', 'block')
      })
    }
  
    // Find the Previous button
    const previousButton = $(`#${tableSelector}_previous`)
    // Get the parent <li> element
    const previousParentListItem = previousButton.closest('li')
    // Get the previous <li> element
    const previousListItem2 = previousParentListItem.prev()
    // Add the "active" class to the previous <li> element
    previousListItem2.addClass('active')
    // Find the <a> tag inside the previous <li> element
    const previousLink2 = previousListItem2.find('a')
    // Trigger the click event on the <a> tag
    previousLink2.click()
  }
  
  
  
  
  
  
  function createExportButtons(config) {
    const exportDropdown = document.createElement('div');
    exportDropdown.className = 'dropdown';
    if (config.tableExportFunc != null) {
      exportDropdown.innerHTML = `
                  <div class="dropdown">
                      <button type="button" class="btn btn-white btn-sm dropdown-toggle w-100" id="${config.tableId}ExportDropdown"
                          data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="bi-download me-2"></i> Export
                      </button>
                      <div class="dropdown-menu dropdown-menu-sm-end" aria-labelledby="${config.tableId}ExportDropdown">
                          <span class="dropdown-header">Download options</span>
                          <a ${config.tableExportFunc == "" ? `id="export-excel${config.tableIndexNo}"` : ""} data-exportData="xlsx" class="${config.tableExportFunc ? `${config.tableId}ExportTableDataClassClick` : ""} dropdown-item" href="javascript:;">
                              <img class="avatar avatar-xss avatar-4x3 me-2" src="/assets/svg/brands/excel-icon.svg" alt="Image Description"> Excel
                          </a>
                          <a  ${config.tableExportFunc == "" ? `id="export-csv${config.tableIndexNo}"` : ""} data-exportData="csv"  class="${config.tableExportFunc ? `${config.tableId}ExportTableDataClassClick` : ""} dropdown-item" href="javascript:;">
                              <img class="avatar avatar-xss avatar-4x3 me-2" src="/assets/svg/components/placeholder-csv-format.svg" alt="Image Description"> .CSV
                          </a>
                          <a ${config.tableExportFunc == "" ? `id="export-pdf${config.tableIndexNo}"` : ""} data-exportData="pdf" class=" ${config.tableExportFunc ? `${config.tableId}ExportTableDataClassClick` : ""} dropdown-item d-none" href="javascript:;">
                              <img class="avatar avatar-xss avatar-4x3 me-2" src="/assets/svg/brands/pdf-icon.svg" alt="Image Description"> PDF
                          </a>
                      </div>
                  </div>`;
    }
  
    // Add event listeners after the dropdown is appended to the DOM
    return exportDropdown;
  }
  
  // Table Export file even listener 
  function exportFileEventListener(config){
    $(`.${config.tableId}ExportTableDataClassClick`).on('click', function() {
      const extensionType = $(this).attr('data-exportData')
      if (extensionType && config.tableExportFunc) {
        config.tableExportFunc(extensionType)
      } 
    });
  }
  
  
  function createSearchAndFilter(config) {
    const searchAndFilterDiv = document.createElement('div');
    searchAndFilterDiv.className = 'mb-2 mb-md-0 d-flex justify-content-md-end w-100';
  
    if (config.searchFields) {
      const searchDropdown = `
        <div class="dropdown me-1">
          <button type="button" class="btn btn-white w-100" id="${config.tableId}AddSearchInputFields" data-bs-toggle="dropdown"
            aria-expanded="false" data-bs-auto-close="outside">
            <i class="bi-search me-1"></i> Search
          </button>
          <div class="dropdown-menu dropdown-menu-end dropdown-card ${config.tableId}CloseSearchDropDown" aria-labelledby="${config.tableId}AddSearchInputFields"
            style="min-width: 22rem;">
            <div class="card">
              <div class="card-header card-header-content-between">
                <h5 class="card-header-title">Search Query</h5>
                <button type="button" class="${config.tableId}CloseSearchColumn btn btn-ghost-secondary btn-icon btn-sm ms-2">
                  <i class="bi-x-lg"></i>
                </button>
              </div>
              <div class="card-body">
                <form>
                  <div class="mb-5">
                    <small class="text-cap text-body">Select Search Options</small>
                      ${config.searchFields.fields.reduce((acc, field, index) => {
        if (index % 2 === 0) {
          // Start a new row
          acc.push(`<div class="row mb-4">`);
        }
  
        // Add the column to the current row
        acc.push(`
                            <div class="col">
                              <div class="form-check">
                                <input class="form-check-input ${config.tableId}ShowInputsFieldsCheckBox" data-searchFieldID="${field.id}" type="checkbox" value="${field.label}"
                                  id="${field.id}SerachFieldIdFor${config.tableId}" data-custom-placeholder="${field.placeholder}" ${field.checked ? 'checked' : ''}>
                                <label class="form-label" for="${field.id}">
                                  ${field.label}
                                </label>
                              </div>
                            </div>
                          `);
  
        if (index % 2 !== 0) {
          // Close the row after two columns
          acc.push(`</div>`);
        }
  
        return acc;
      }, []).join('')}
  
                        ${config.searchFields.fields.length % 2 !== 0 ? '</div>' : ''}
                  </div>
                  <div class="d-grid">
                    <button class="${config.tableId}CloseSearchColumn btn btn-primary" type="button" role="button" id="${config.tableId}ApplySearchColumns">Apply</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
      searchAndFilterDiv.innerHTML += searchDropdown;
    }
  
    if (config.filterFields) {
  
      const filterButton = `
        <a class="btn btn-white dropdown-toggle me-1" data-bs-toggle="collapse" href="#${config.tableId}FilterCollapse"
          role="button" aria-expanded="false" aria-controls="${config.tableId}FilterCollapse">
          <i class="bi-funnel me-1"></i> Filters
        </a>
      `;
  
      searchAndFilterDiv.innerHTML += filterButton;
    }
  
  
  
    // Initialize event listeners after the elements are added to the DOM
    return searchAndFilterDiv;
  }
  
  function createTableHeader(config) {
    const headerMainDiv = document.createElement('div');
    headerMainDiv.id = `${config.tableId}DatatableMainHeading`;
  
    const headerSearchFilterColumns = document.createElement('div');
    headerSearchFilterColumns.className = 'card-header card-header-content-md-between';
  
    // Create export buttons and search/filter options
    const exportButtons = createExportButtons(config);
    const searchAndFilterOptions = createSearchAndFilter(config);
  
    // Create a container for the export buttons and search/filter options
    const containerDiv = document.createElement('div');
    containerDiv.className = 'd-grid d-sm-flex justify-content-md-start align-items-sm-center gap-2';
  
    // Append export buttons and search/filter options to the container
  
  
    // Append the container to the main header div
    containerDiv.appendChild(exportButtons);
    headerSearchFilterColumns.appendChild(containerDiv);
    headerSearchFilterColumns.appendChild(searchAndFilterOptions);
    if (config.columns) {
      appendDropdownToTableHeader(config, searchAndFilterOptions);
    }
    headerMainDiv.appendChild(headerSearchFilterColumns);
    if (config.filterFields) {
      appendFilterCollapse(config, headerMainDiv)
    }
    if (config.searchFields) {
      appendSearchCollapse(config, headerMainDiv)
    }
  
    return headerMainDiv;
  }
  
  // Function to generate and append the dropdown to the table header
  function appendDropdownToTableHeader(config, headerSelector) {
    const headerElement = typeof headerSelector === 'string' ? document.querySelector(headerSelector) : headerSelector;
  
    if (!headerElement) {
      console.error('Header element not found', headerSelector);
      return;
    }
  
    // Create the dropdown container and populate it
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown';
  
    dropdownContainer.innerHTML = `
          <button type="button" class="btn btn-white w-100" id="showHideDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
              <i class="bi-table me-1"></i> Columns <span class="badge bg-soft-dark text-dark rounded-circle ms-1" id="${config.tableId}ColumnCount">0</span>
          </button>
          <div class="dropdown-menu dropdown-menu-end dropdown-card" aria-labelledby="showHideDropdown" style="width: 15rem;">
              <div class="card card-sm">
                  <div class="card-body">
                      <div class="d-grid gap-3" id="${config.tableId}columnSwitches">
                          ${config.columns.map(column => `
                              <label class="row form-check form-switch" for="${column.id}">
                                  <span class="col-8 col-sm-9 ms-0">
                                      <span class="me-2">${column.name}</span>
                                  </span>
                                  <span class="col-4 col-sm-3 text-end">
                                      <input type="checkbox" class="form-check-input" id="${config.tableId}ToggleColumn${column.id}" ${column.visible ? 'checked' : ''}>
                                  </span>
                              </label>
                          `).join('')}
                      </div>
                  </div>
              </div>
          </div>
      `;
  
    // Update the visible column count
    const visibleCount = config.columns.length;
    dropdownContainer.querySelector(`#${config.tableId}ColumnCount`).textContent = visibleCount;
  
    // Append the dropdown to the header
    headerElement.appendChild(dropdownContainer);
  }
  
  
  function appendFilterCollapse(config, headerMainDiv) {
    // Create the collapse container
    const collapseContainer = document.createElement('div');
    collapseContainer.className = 'collapse';
    collapseContainer.id = `${config.tableId}FilterCollapse`;
  
    // Create the card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    // Create the row container for the form elements
    const rowContainer = document.createElement('div');
    rowContainer.className = 'row';
  
    // Loop through the dynamic fields in the config and create form elements
    config.filterFields.forEach(field => {
      const colDiv = document.createElement('div');
      colDiv.className = `col-sm-12 col-lg-3 ${field.hidden ? 'd-none' : ''}`;
  
      const formGroupDiv = document.createElement('div');
      formGroupDiv.className = 'mb-4';
  
      const label = document.createElement('label');
      label.className = 'form-label';
      label.setAttribute('for', `${config.tableId + field.id}Filter`);
      label.textContent = field.label;
  
      formGroupDiv.appendChild(label);
  
      if (field.type === 'text') {
        const inputGroupDiv = document.createElement('div');
        inputGroupDiv.className = 'input-group input-group-merge';
  
        const inputGroupPrependDiv = document.createElement('div');
        inputGroupPrependDiv.className = 'input-group-prepend input-group-text';
        inputGroupPrependDiv.innerHTML = `<i class="bi-search"></i>`;
  
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `${config.tableId + field.id}Filter`;
        input.className = 'form-control';
        input.placeholder = field.placeholder;
        input.maxLength = field.maxLength || '50';
  
        inputGroupDiv.appendChild(inputGroupPrependDiv);
        inputGroupDiv.appendChild(input);
  
        formGroupDiv.appendChild(inputGroupDiv);
      } else if (field.type === 'select') {
        const selectContainerDiv = document.createElement('div');
        selectContainerDiv.className = 'tom-select-custom';
  
        const select = document.createElement('select');
        select.className = 'form-select';
        select.id = field.tomSelectId;
        select.setAttribute('autocomplete', 'off');
  
        // Add options to the select element
        field.options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          select.appendChild(optionElement);
        });
  
        selectContainerDiv.appendChild(select);
        formGroupDiv.appendChild(selectContainerDiv);
      }
  
      colDiv.appendChild(formGroupDiv);
      rowContainer.appendChild(colDiv);
    });
  
    cardBody.appendChild(rowContainer);
    collapseContainer.appendChild(cardBody);
    headerMainDiv.appendChild(collapseContainer)
  }
  
  
  function appendSearchCollapse(config, headerMainDiv) {
    const collapseContainer = document.createElement('div');
    collapseContainer.className = 'collapse';
    collapseContainer.id = `${config.tableId}SearchThroughAllData`;
  
    collapseContainer.innerHTML = `
          <div class="card-body d-flex">
              <div class="col-sm-12 col-lg-12">
                  <div class="mb-0">
                     
                          <div class="row mb-0" id="${config.tableId}AppendSearchFields">
                              <!-- Input fields will be dynamically appended here -->
                          </div>
                          <div class="row d-flex justify-content-end mt-0 mb-3">
                              <div class="d-grid gap-2 d-flex flex-row-reverse">
                                  <button type="button" id="${config.tableId}DynamicSearchBtn"
                                      class="btn bg-parimry-theme-color text-white btn-sm" disabled>Search</button>
                                  <button type="button" id="${config.tableId}CloseSearchCollapse"
                                      class="forgot-password-close-modal btn bg-secondary text-white btn-sm">Cancel</button>
                              </div>
                          </div>
                  </div>
              </div>
          </div>
      `;
  
    headerMainDiv.appendChild(collapseContainer);
  }
  
  
  function setupDynamicColumnToggles(config, table) {
    config.columns.forEach((column, index) => {
      const toggleElement = document.getElementById(`${config.tableId}ToggleColumn${column.id}`);
  
      if (toggleElement) {
        toggleElement.addEventListener('change', function (e) {
          table.columns(column.columnNo).visible(e.target.checked);
        });
  
        // Set the initial visibility state
        table.columns(column.columnNo).visible(column.visible);
        toggleElement.checked = column.visible;
      } else {
        console.warn(`Toggle element with ID ${config.tableId}ToggleColumn${column.id} not found.`);
      }
    });
  }
  
  
  function setupDynamicFilters(config, table) {
    config.filterFields.forEach((field, index) => {
      if (field.type === 'text') {
        // Handle text input filter
        const inputElement = document.getElementById(`${config.tableId + field.id}Filter`);
        if (inputElement) {
          inputElement.addEventListener('keyup', function () {
            table.columns(field.columnNo).search(this.value).draw();
          });
  
        } else {
          console.warn(`Input element with ID ${`${config.tableId + field.id}Filter`} not found.`);
        }
      } else if (field.type === 'select') {
        // Handle select dropdown filter
        const selectElement = document.getElementById(field.tomSelectId);
        if (selectElement) {
          selectElement.addEventListener('change', function () {
            table.columns(field.columnNo).search(this.value).draw();
          });
  
        } else {
          console.warn(`Select element with ID ${field.tomSelectId} not found.`);
        }
      }
    });
  }
  
  
  // Initiate Number of rows change EventListener
  function initChangeNumberOfRowsEventListeners(config, table) {
    $(`#datatableEntries${config.tableIndexNo}`).on('change', () => {
      $(`#${config.tableId}Loader`).addClass('d-flex').removeClass('d-none');
      $(`#${config.tableId}DatatableMainHeading`).removeClass('d-none');
      $(`#${config.tableId}, #${config.tableId}FooterDiv, #${config.tableId}ErrorDiv`).addClass('d-none');
  
      table.clear().draw();
      const entriesPerPageChanged = Number($(`#datatableEntries${config.tableIndexNo}`).val());
      config.tableMainApiCallFunc(entriesPerPageChanged, 1);
    });
  };
  
  
  
  // Search on apply button
  function initSearchEventListeners(config, table, searchManager) {
  
  
    // close the dropdown of search input fields selections
    $(`.${config.tableId}CloseSearchColumn`).on('click', function () {
      $(`.${config.tableId}CloseSearchDropDown`).removeClass('show')
      // $('#group_name').prop('checked', true)
    })
  
  
    $(`#${config.tableId}CloseSearchCollapse`).on('click', function (e) {
      e.preventDefault()
      $(`#${config.tableId}SearchThroughAllData`).removeClass('show')
      // Loop through the checkboxes and and remove checked
      $(`.${config.tableId}ShowInputsFieldsCheckBox`).prop('checked', false); // Uncheck all elements
      const index = config.searchFields.fields.findIndex(field => field.checked === true);
      $(`.${config.tableId}ShowInputsFieldsCheckBox`).eq(index).prop('checked', true);
  
      $(`${config.tableId}DynamicSearchBtn`).prop('disabled', true)
  
  
      // Create an instance of the search manager
      let searchObject = ""
      searchObject = searchManager.getSearchObject();
      const searchFieldsContainer = document.getElementById(`${config.tableId}AppendSearchFields`);
      searchFieldsContainer.innerHTML = "";
      if (Object.keys(searchObject).length > 0) {
        config.searchFields.searchFunctionForSearchObj("");
        $(`#${config.tableId}Loader`).addClass('d-flex').removeClass('d-none');
        $(`#${config.tableId}DatatableMainHeading`).removeClass('d-none');
        $(`#${config.tableId}, #${config.tableId}FooterDiv, #${config.tableId}ErrorDiv`).addClass('d-none');
  
        searchManager.setSearchObject("");
        table.clear().draw();
        const entriesPerPageChanged = Number($(`#datatableEntries${config.tableIndexNo}`).val());
        config.tableMainApiCallFunc(entriesPerPageChanged, 1);
      }
  
    });
  
    // Check for checkboxes and enable/disable the Apply button
    const applyButton = document.getElementById(`${config.tableId}ApplySearchColumns`);
    const checkboxes = document.querySelectorAll(`.${config.tableId}ShowInputsFieldsCheckBox`);
  
    if (applyButton && checkboxes) {
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
          applyButton.disabled = !anyChecked;
        });
      });
  
      // Event listener for Apply button
      applyButton.addEventListener("click", () => {
        $(`#${config.tableId}SearchThroughAllData`).addClass("show");
        dynamicSearchOptions(config, table, searchManager);
      });
    } else {
      console.error('Apply button or checkboxes not found');
    }
  }
  
  function dynamicSearchOptions(config, table, searchManager) {
    // Query all checkboxes that correspond to the class name pattern
    const allFields = document.querySelectorAll(`.${config.tableId}ShowInputsFieldsCheckBox`);
    const appendSearchFieldsContainer = document.getElementById(`${config.tableId}AppendSearchFields`);
  
    if (!appendSearchFieldsContainer) {
      console.error('Append Search Fields container not found');
      return;
    }
  
    // Clear existing fields
    appendSearchFieldsContainer.innerHTML = '';
    
  
    // Filter to get only the checked fields
    const selectedFields = Array.from(allFields).filter(checkbox => checkbox.checked);
  
    // Iterate over selected fields
    selectedFields.forEach(checkbox => {
      const searchFieldID = checkbox.getAttribute('data-searchFieldID');
      // Get the corresponding field configuration based on the checkbox ID
      const fieldConfig = config.searchFields.fields.find(field => field.id === searchFieldID);
  
  
      if (fieldConfig) {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'col-sm-12 col-lg-3 mb-4';
  
        // Create field elements based on the field type
        if (fieldConfig.type === 'text') {
          fieldElement.innerHTML = `
                    <label for="${fieldConfig.id}" class="form-label">${fieldConfig.label}</label>
                    <div class="input-group input-group-merge">
                        <div class="input-group-prepend input-group-text">
                            <i class="bi-search"></i>
                        </div>
                        <input maxlength="50" type="text" id="${fieldConfig.id}ActualSearchField${config.tableId}" data-searchFieldID="${fieldConfig.id}" class="form-control"
                            placeholder="${fieldConfig.placeholder}">
                    </div>
                `;
        } else if (fieldConfig.type === 'select') {
          fieldElement.innerHTML = `
                    <label for="${fieldConfig.tomSelectId}" class="form-label">${fieldConfig.label}</label>
                    <div class="tom-select-custom">
                        <select class="form-select" id="${fieldConfig.tomSelectId}" data-searchFieldID="${fieldConfig.id}" autocomplete="off">
                            ${fieldConfig.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                        </select>
                    </div>
                `;
        }
  
        // Append the dynamically created field element to the container
        appendSearchFieldsContainer.appendChild(fieldElement);
     
      }
    });
    if (config.searchFields.searchFuncForTomSelect) {
      config.searchFields.searchFuncForTomSelect();
    }
  
    // Function to check if any input/select field has a value
    const checkFieldsForValue = () => {
      
      const hasValue = Array.from(appendSearchFieldsContainer.querySelectorAll('input, select')).some(input => {
        if (input.type === 'text') {
          return input.value.trim() !== '';
        } else if (input.tagName === 'SELECT') {
          return input.value !== '';
        }
        return false;
      });
  
      const searchBtn = document.getElementById(`${config.tableId}DynamicSearchBtn`);
      if (searchBtn) {
        searchBtn.disabled = !hasValue;
        if (!hasValue) {
          searchObject = searchManager.getSearchObject();
          if (Object.keys(searchObject).length > 0) {
            config.searchFields.searchFunctionForSearchObj("");
            $(`#${config.tableId}Loader`).addClass('d-flex').removeClass('d-none');
            $(`#${config.tableId}DatatableMainHeading`).removeClass('d-none');
            $(`#${config.tableId}, #${config.tableId}FooterDiv, #${config.tableId}ErrorDiv`).addClass('d-none');
  
            searchManager.setSearchObject("");
            table.clear().draw();
            const entriesPerPageChanged = Number($(`#datatableEntries${config.tableIndexNo}`).val());
            config.tableMainApiCallFunc(entriesPerPageChanged, 1);
          }
        }
      } else {
        console.error('Search button not found');
      }
    };
  
    // Add event listeners to the dynamically created input/select fields to monitor changes
    appendSearchFieldsContainer.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', checkFieldsForValue);
    });
  
    // Initial check to set the button state
    checkFieldsForValue();
    collectSearchValues(config, table, searchManager)
  }
  
  function collectSearchValues(config, table, searchManager) {
    const searchBtn = document.getElementById(`${config.tableId}DynamicSearchBtn`);
  
  
    if (!searchBtn) {
      console.error('Search button not found');
      return;
    }
  
  
    // Remove any existing event listeners
    const newSearchBtn = searchBtn.cloneNode(true);
    searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
  
    newSearchBtn.addEventListener('click', function () {
      const searchFieldsContainer = document.getElementById(`${config.tableId}AppendSearchFields`);
      const searchFields = searchFieldsContainer.querySelectorAll('input, select');
      const searchValues = {};
  
      searchFields.forEach(field => {
        const fieldId = field.getAttribute('data-searchFieldID');
        // const fieldId = field.searchFieldID;
  
        if (field.tagName.toLowerCase() === 'select') {
          // Handle select fields
          // const fieldConfig = config.searchFields.fields.find(f => f.tomSelectId === fieldId);
          // if (fieldConfig && field.value) {
            // searchValues[fieldId] = field.value;
            if(field.value.length > 0){
              searchValues[fieldId] = field.value;
            }
          // }
        } else {
          // Handle input fields
          const fieldValue = field.value;
          if (fieldValue) {
            searchValues[fieldId] = fieldValue;
          }
        }
      });
  
      console.log(searchValues); // Output the JSON object to the console
      // Update the searchObject value
      if (Object.keys(searchValues).length > 0) {
        searchManager.setSearchObject(searchValues);
        config.searchFields.searchFunctionForSearchObj(searchValues);
        $(`#${config.tableId}Loader`).addClass('d-flex').removeClass('d-none');
        $(`#${config.tableId}DatatableMainHeading`).removeClass('d-none');
        $(`#${config.tableId}, #${config.tableId}FooterDiv, #${config.tableId}ErrorDiv`).addClass('d-none');
        table.clear().draw();
        const entriesPerPageChanged = Number($(`#datatableEntries${config.tableIndexNo}`).val());
        config.tableMainApiCallFunc(entriesPerPageChanged, 1, searchValues);
      }
    });
  }
  
  
  // Main function
  function createTableComponent(config, options) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'card';
  
    const tableHeading = `
          <div class="card-header card-header-content-sm-between">
            <h4 class="card-header-title mb-2 mb-sm-0 d-flex " ${config.tableHeaderID? `id=${config.tableHeaderID}`:''}  >${config.tableName}</h4>
            ${config.tableHeaderHTMLContent ? config.tableHeaderHTMLContent : ''}
          </div>
    `
    tableContainer.innerHTML=(tableHeading);
  
    // Create and append the main header
    const tableHeader = createTableHeader(config);
    tableContainer.appendChild(tableHeader);
  
    // Table
    const tableHtml = `
        <div class="card-body p-0">
        ${config.tableEnableProtectionHTML?
      ` <!--  Links for protection-->
        <h4 id="${config.tableEnableProtectionHTML.parentID}" class="m-0 m-4 d-none">
          <u class="text-primary">
          <a href="${config.tableEnableProtectionHTML.link}" class="text-primary" id="${config.tableEnableProtectionHTML.ancharID}">${config.tableEnableProtectionHTML.label}</a>
          </u>
        </h4>`:''}
         <!-- Data table spinner -->
         <div class="d-flex justify-content-center align-items-center mt-5 mb-5" id="${config.tableId}Loader">
            <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;color: #631212;"></div>
          </div>
          <div class="table-responsive datatable-custom datatable-custom-centered">
            <!-- Datatable Error Message -->
            <div class="p-5 text-center d-none" id="${config.tableId}ErrorDiv">
                <img class="mb-3" src="/files/images/signin_signup/logo.png" alt="Image Description" style="width: 10rem; opacity:0.3">
                <p id="${config.tableId}ErrorText"></p>
            </div>
            <table id="${config.tableId}" class="js-datatable table table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100 d-none">
              <thead class="thead-light">
                <tr>
  
                  ${config.tableHeader.map(header => {
                  // Check if header has a key 'headerType' and its value is true
                  if (header.html && header.html === true) {
                      return `<th class="${header.widthClass}">${header.name}</th>`;
                  }
                  // If the condition is not met, still render the header but with a different format or class
                  return `<th class="${header.widthClass}">${header.name}</th>`; // Render as usual
                  }).join('')}
                </tr>
              </thead>
            </table>
          </div>
        </div>`;
    tableContainer.innerHTML += tableHtml;
  
    // Footer
    const footerHtml = `
        <div class="card-footer mt-4 d-none" id="${config.tableId}FooterDiv">
          <div class="row justify-content-center justify-content-sm-between align-items-sm-center">
            <div class="col-sm mb-2 mb-sm-0">
              <div class="d-flex justify-content-center justify-content-sm-start align-items-center">
                <span class="me-2"># of rows:</span>
                <div class="tom-select-custom">
                  <select id="datatableEntries${config.tableIndexNo}" class="js-select${config.tableIndexNo} form-select form-select-borderless w-auto" autocomplete="off">
                    <option class="p-2" value="10" selected>10</option>
                    <option class="p-2" value="25">25</option>
                    <option class="p-2" value="50">50</option>
                    <option class="p-2" value="100">100</option>
                  </select>
                </div>
                <span id="datatableWithPaginationInfoTotalQty${config.tableIndexNo}"></span>
              </div>
            </div>
            <div class="col-sm-auto">
              <div class="d-flex justify-content-center justify-content-sm-end">
                <nav id="datatablePagination${config.tableIndexNo}" aria-label="Activity pagination"></nav>
              </div>
            </div>
          </div>
        </div>`;
    tableContainer.innerHTML += footerHtml;
    
    // Append to the DOM
    document.getElementById(config.tableHTMLIdToAppend).appendChild(tableContainer);  // Change 'tableContainerId' to your container ID
  
    let newDataTable = initializeDatatable(config.tableId, options, config.tableIndexNo)
  
  
  
  
    const searchManager = createSearchManager();
    if (config.searchFields && 'searchFunctionForSearchObj' in config.searchFields && config.searchFields.searchFunctionForSearchObj) {
      setTimeout(initSearchEventListeners(config, newDataTable, searchManager), 100)
    }
    if (config.tablePagination) {
      setTimeout(initChangeNumberOfRowsEventListeners(config, newDataTable), 100)
    }
    if (config.columns) {
    setTimeout(setupDynamicColumnToggles(config, newDataTable), 100)
    }
    if (config.filterFields) {
      setTimeout(setupDynamicFilters(config, newDataTable), 100)
    }
    if (config.tableExportFunc) {
    setTimeout(exportFileEventListener(config), 100)
    }
    
   
    setTimeout(()=>{
      $(`#datatableEntries${config.tableIndexNo}-ts-control`)
      .closest('.tom-select-custom')
      .find('.dropdown-input-wrap')
      .addClass('d-none');
    },2000)
     HSCore.components.HSTomSelect.init(`.js-select${config.tableIndexNo}`);
    return newDataTable;
    // INITIALIZATION OF SELECT
    // =======================================================
    // HSCore.components.HSTomSelect.init('.js-select');
  }
  
  // Table Search Object for export and update on main theme
  function createSearchManager() {
    let searchObject = "";
  
    return {
      getSearchObject: function () {
        return searchObject;
      },
      setSearchObject: function (newValue) {
        searchObject = newValue;
      }
    };
  }
  
 
  // const config = {
  //   "tableName": "Groups",
  //   "tableId": "ssoGroupDatatable12", //table name (Unique) Required
  //   "tableExportFunc": "exportUserGroupsDataTableData", // Null = d-none // ""=export for no pagination // functionName for export
  //   "tableMainApiCallFunc": getAllSSOGroups, // Main API Call function name for datatable
  //   "tableIndexNo": 2, // Table number (Required)
  //   "tablePagination": true,
  //   "tableHeaderHTMLContent": ` <button type="button" class="btn bg-parimry-theme-color btn-sm read_only" data-bs-toggle="modal"
  //       data-bs-target="#addGroup">
  //       Add group
  //     </button>`,
  //   // "columns": null,
  //   "columns": [
  //     { "name": "Description", "id": "description", "columnNo": 0, "visible": true },
  //     { "name": "Actions", "id": "action", "columnNo": 2, "visible": true }
  //   ],
  //   // "searchFields": null,
  //   "searchFields": {
  //     "searchFuncForTomSelect": searchFunctionForTomSelectInit, // if we have tom select in search make a function
  //     "searchFunctionForSearchObj": searchObjectCreation,  
  //     "fields": [
  //       {
  //         "label": "Group name",
  //         "id": "group_name",
  //         "placeholder": "Enter group name",
  //         "type": "text",
  //         "checked": true,
  //       },
  //       {
  //         "label": "Status",
  //         "id": "status",
  //         "tomSelectId": "statusSearchTomSelectInitialization",
  //         "placeholder": "Select status",
  //         "type": "select",
  //         "options": [
  //           { "value": "", "label": "Select status" },
  //           { "value": "active", "label": "Active" },
  //           { "value": "inactive", "label": "Inactive" }
  //         ],
  //         "checked": false
  //       }
  //     ]
  //   },
  //   // "filterFields": null,
  //   "filterFields": [
  //     {
  //       "type": "text",
  //       "label": "Group name",
  //       "id": "groupName",
  //       "placeholder": "Enter group name",
  //       "columnNo": 0,
  //       "hidden": false // This field is shown
  //     },
  //     {
  //       "type": "text",
  //       "label": "Description",
  //       "id": "description",
  //       "placeholder": "Enter description",
  //       "columnNo": 1,
  //       "hidden": false // This field is shown
  //     },
  //     {
  //       "type": "select",
  //       "label": "Status",
  //       "id": "status",
  //       "tomSelectId": "statusFilterTomSelectInitialization",
  //       "options": [
  //         { "value": "", "label": "Select status" },
  //         { "value": "active", "label": "Active" },
  //         { "value": "inactive", "label": "Inactive" }
  //       ],
  //       "columnNo": 2,
  //       "hidden": true // This field is hidden
  //     }
  //   ],
  //   "tableHeader": [
  //     { "name": "Group name", "widthClass": "w-10" },
  //     { "name": "Description", "widthClass": "w-25" },
  //     { "name": "Actions", "widthClass": "" }
  //   ],
  // };
  
  // newTableInstance = createTableComponent(config, options);