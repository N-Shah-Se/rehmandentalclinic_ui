let patientTableInit,ID
let changeFirstName,changeLastName,changeDescription,changeTotalPayment,changePaid,changePhone
let editFirstName,editLastName,editDescription,editTotalPayment,editPaid,editPhone
const POST = "POST";
const Content_Type = "application/json";
const accessToken=localStorage.getItem('_access')
const refreshToken=localStorage.getItem('_refresh')
$(document).ready(function () {
  $('.handelActive').removeClass('active');
  $("#sidebar").load("/sidebar.html", function () {
    // After loading, add the 'active' class to the #dashboard element
    $('#patientDetails').addClass('active');
    console.log('Updated classes:', $('#patientDetails').attr('class'));
});
    $("#header").load("/header.html");
    reFreshApi()
    // Data table opations
    const options = JSON.stringify({
        dom: 'Bfrtip',
        columnDefs: [
          {
            targets: '_all', // Apply to all columns
            render: function (data, type, row) {
              if (type === 'display' && data) {
                // Capitalize the first letter of the cell's content
                return data.charAt(0).toUpperCase() + data.slice(1)
              }
              return data
            }
          }, {
            targets: [0, 2]
            // orderable: false
          }],
        order: [
          // Custom order
        ],
        pageLength: 10,
        isResponsive: true,
        isShowPaging: true
      })
      // INITIALIZATION OF DATATABLES
      patientTableInit = initializeDatatable('patientTable', options, 1)
      const entriesPerPageChanged = Number($('#datatableEntries1').val())
      getAllPatient(entriesPerPageChanged, 1)
      $('#createPatientForm').validate({
        debug: true,
        focusInvalid: false,
        ignore: [],
        rules: {
          first_name: {
            required:true
          },
          signuplastname: {
            required: true
          },
        
          totalPayment: {
            required: true
          },
          
          paid: {
            required: true
          },
          
          phone: {
            required: true
          },
          
          description: {
            required: true
          }
          
        },
        messages: {
      
        },
        errorClass: 'error invalid-feedback',
        validClass: 'success',
        errorElement: 'span',
        highlight: function (element, errorClass, validClass) {
          $(element)
            .parents('div.control-group')
            .addClass(errorClass)
            .removeClass(validClass)
        },
        unhighlight: function (element, errorClass, validClass) {
          $(element)
            .parents('.error')
            .removeClass(errorClass)
            .addClass(validClass)
        },
        // the errorPlacement has to take the table layout into account
        errorPlacement: function (error, element) {
          if (element.is(':checkbox') || element.is('#readAccess')) { error.appendTo(element.parent().parent().parent()) } else if (element.is('#writeAccess')) { error.appendTo(element.parent().parent()) } else {
            error.appendTo(element.parent())
          }
        }
      })
      $('#editPatientForm').validate({
        debug: true,
        focusInvalid: false,
        ignore: [],
        rules: {
          editFirstName: {
            required:true
          },
          editLastName: {
            required: true
          },
        
          editTotalPayment: {
            required: true
          },
          
          editPaid: {
            required: true
          },
          
          editPhone: {
            required: true
          },
          
          editDescription: {
            required: true
          }
          
        },
        messages: {
      
        },
        errorClass: 'error invalid-feedback',
        validClass: 'success',
        errorElement: 'span',
        highlight: function (element, errorClass, validClass) {
          $(element)
            .parents('div.control-group')
            .addClass(errorClass)
            .removeClass(validClass)
        },
        unhighlight: function (element, errorClass, validClass) {
          $(element)
            .parents('.error')
            .removeClass(errorClass)
            .addClass(validClass)
        },
        // the errorPlacement has to take the table layout into account
        errorPlacement: function (error, element) {
          if (element.is(':checkbox') || element.is('#readAccess')) { error.appendTo(element.parent().parent().parent()) } else if (element.is('#writeAccess')) { error.appendTo(element.parent().parent()) } else {
            error.appendTo(element.parent())
          }
        }
      })
    
  });

// Get All Sso Groups
function getAllPatient (skip, page, search) {

    // API call
    $.ajax({
      url: 'https://rehmandentalclinic.org:9090/api/v1/patient/get/record/',
      method: 'GET',
      contentType: Content_Type,
      dataType: 'json',
      headers: {
        "Authorization": `Bearer ${accessToken}` // Ensure accessToken is defined
    },
    
      statusCode: {
        200: function (data) {
          
          $('#patientTableLoader, #patientTableErrorDiv').addClass('d-none')
          $('#patientTableLoader').removeClass('d-flex')
          $('#patientTable, #patientTableFooterDiv, #patientTableMainHeading').removeClass('d-none')
          let apiData = data.UserData

          const total = apiData.length
          // Set total count to the localstorage
          localStorage.setItem('patientTableTotalResults', total)
        
  
          for (let i = 0; i < apiData.length; i++) {

            patientTableInit.row
              .add([
                `<td>${apiData[i].firstname}</td>`,
                `<td>${apiData[i].lastname}</td>`,
                `<td ><span  style="background:transparent;border:none;width:150% !important; white-space: nowrap; overflow: hidden; text-overflow: clip; cursor: text; text-overflow: ellipsis; display: block; max-width: 400px;" disabled   type="text" title="${apiData[i].description}">${apiData[i].description==""?"N/A":`${apiData[i].description}`}</span></td>`,
              `<td>${apiData[i].phone}</td>`,
                `<td>${apiData[i].total_payment}</td>`,
                `<td>${apiData[i].paid}</td>`,
                `<td>${apiData[i].balance}</td>`,
                `<td>${apiData[i].created_date}</td>`,
                `<td>
                  <div class="dropdown" style="position:unset">
                  <button type="button" class="btn btn-white btn-sm" id="actionDropdown1 w-100" data-bs-toggle="dropdown" aria-expanded="false">
                  Action <i class="bi-chevron-down ms-1"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-end" aria-labelledby="actionDropdown${i + 1}">
                  <a class="dropdown-item editGroupLink" style="cursor:pointer" data-bs-target="#editGroup" data-bs-toggle="modal" title="Click to edit.">Edit</a>
                  <a class="dropdown-item" style="cursor:pointer" data-bs-target="#" data-bs-toggle="modal" onclick="deletePatientRecord('${apiData[i].id}')" title="Click to delete.">Delete</a>
  
  
               
                </div>
                          
                  </div>
                </td>`
              ])
              .draw()
  
  
  
  
  
            datatablePagination('patientTable', 1, 'patientTableTotalResults', getAllPatient)
           
            // Assuming you have the index i available in your JavaScript code
            const editGroupLinks = document.querySelectorAll('.editGroupLink');
            editGroupLinks.forEach((editGroupLink, index) => {
                editGroupLink.onclick = function () {
                    const firstName =apiData[index].firstname
                    ID =apiData[index].id
                    const lastName =apiData[index].lastname
                    const description = apiData[index].description;
                    const totalPayment = apiData[index].total_payment;
                    const paid = apiData[index].paid;
                    const phone = apiData[index].phone;
  
                    updateEditPatientModal(ID,lastName,firstName, description, totalPayment,paid,phone);
                };
            });
            
          }
        },
        204: function () {
          $('#cover-spin').hide()
          alert('204')
        }
      },
      error: function (xhr) {
        $('#cover-spin').hide()
        // $('#pageContentToShow').addClass('d-none')
        // $('#pageErrorsToShow').removeClass('d-none')
  
        if (xhr.status === 400) {
          $('#showErrorText').text('invalidRequest400Error')
        } else if (xhr.status === 401) {
          $('#showErrorText').text('unauthorizedRequest401Error')
        } else if (xhr.status === 404) {
          $('#showErrorText').text('notFound404Error')
        } else if (xhr.status === 503) {
          $('#showErrorText').text('serverError503Error')
        } else {
       
        }
      }
    })
  }

   // Submit form Validations start
$('#createPatientForm').on('submit', function (event) {
  event.preventDefault()
  // const requiredData = $(this).serialize()
  if ($(this).validate().form()) {
   
    // First Name Validation
    fname =  $('#firstName').val()
    // Last Name Validation
    lname =  $('#lastName').val()
    // User Name Validation
    phone =  $('#phone').val()
    // Email Validation
    paid = $('#paid').val()

    totalPaid = $('#totalPayment').val()
    
   description = $('#description').val()
    createUser()
  }
})
// Submit form Validations end

// Create user validation start
function createUser() {
  const requiredData = JSON.stringify({

    "firstname": fname,
    "lastname": lname,
    "description":description,
    "total_payment": Number(totalPaid),
    "paid":Number(paid),
    "phone":Number(phone)
  })

  $.ajax({
    url: 'https://rehmandentalclinic.org:9090/api/v1/patient/add/', // Ensure trailing slash is present
    method: "POST", // Wrap POST in quotes
    contentType: Content_Type, // Ensure Content_Type is defined (e.g., "application/json")
    dataType: "json",
    data: requiredData, // Convert data to JSON if sending JSON
    headers: {
        "Authorization": `Bearer ${accessToken}` // Ensure accessToken is defined
    },
    statusCode: {
      201:function (data) {
        $('#patientTableLoader').addClass('d-flex')
          $('#patientTableLoader').removeClass('d-none')
          $('#patientTable, #patientTableFooterDiv, #patientTableErrorDiv').addClass('d-none')
          
        const responseObj = data
      // Access and set the value
      const patientId = responseObj["Patient Id"];
        localStorage.setItem('patientID',patientId)
        $("#addPatient").modal("hide");
        patientTableInit.clear().draw();
        const entriesPerPageChanged = Number($('#datatableEntries1').val())
        getAllPatient(10, 1)
        const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-success text-white">
              <strong class="ms-2 me-auto">Success</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Patient added successfully.
            </div>
          </div>`;
          $('body').append(toastHTML);
        // setTimeout(function () {
        //     window.location.reload(); // Reload page after 1 second
        // }, 1000);
      }
    },
    error: function (xhr, status, error) {
      $('#cover-spin').hide();
      console.log('----', xhr.status);
      $('#addPatient').modal('hide');
  
      if (xhr.status === 400) {
          // Handle Bad Request
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Bad Request</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was an issue with the data you submitted. Please check and try again.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 401) {
          // Handle Unauthorized
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-danger text-white">
              <strong class="ms-2 me-auto">Session Expired</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Your session token has expired. Please refresh the page or re-login.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 404) {
          // Handle Not Found
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Resource Not Found</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The requested resource could not be found. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 409) {
          // Handle Conflict
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Conflict</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was a conflict with your request. Please try again with different data.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 503) {
          // Handle Service Unavailable
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Service Unavailable</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The server is currently unavailable. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else {
          // Handle Other Errors
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Error</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              An unexpected error occurred. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      }
  
     
     
  }
  
});

}

function reFreshApi(){
   
  const requiredData = JSON.stringify({

    "refresh": refreshToken,
   
  })

  $.ajax({
    url: 'https://rehmandentalclinic.org:9090/api/v1/user/refresh/', // Ensure trailing slash is present
    method: "POST", // Wrap POST in quotes
    contentType: Content_Type, // Ensure Content_Type is defined (e.g., "application/json")
    dataType: "json",
    data: requiredData, // Convert data to JSON if sending JSON
  
    statusCode: {
      200:function (data) {
        console.log('---.,.',data)
        localStorage.setItem('_access',data.access)
      }
    },
    error: function (xhr, status, error) {
     
  
      if (xhr.status === 400) {
          // Handle Bad Request
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Bad Request</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was an issue with the data you submitted. Please check and try again.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 401) {
          // Handle Unauthorized
          window.location.href = '../../sign-in.html'
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header ">
              <strong class="ms-2 me-auto">Session Expired</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Your session token has expired. Please refresh the page or re-login.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 404) {
          // Handle Not Found
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Resource Not Found</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The requested resource could not be found. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 409) {
          // Handle Conflict
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Conflict</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was a conflict with your request. Please try again with different data.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 503) {
          // Handle Service Unavailable
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Service Unavailable</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The server is currently unavailable. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else {
          // Handle Other Errors
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Error</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              An unexpected error occurred. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      }
  
     
  }
  
});
}

$('#editPatientForm').on('submit', function (e) {
  e.preventDefault()
  editPatient()
})

function updateEditPatientModal (ID,lastName,firstName, description, totalPayment,paid,phone) {
 // First Name Validation
 
 
  changeFirstName=firstName
  changeLastName=lastName
  changeDescription=description
  changeTotalPayment=totalPayment
  changePaid=paid
  changePhone=phone

 editFirstName =  $('#editFirstName').val(firstName)
 // Last Name Validation
 editLastName =  $('#editLastName').val(lastName)
 // User Name Validation
 editPhone =  $('#editPhone').val(phone)
 // Email Validation
 editPaid = $('#editPaid').val(paid)

 editTotalPayment = $('#editTotalPayment').val(totalPayment)
 
editDescription = $('#editDescription').val(description)
 ID=ID
}


 
  // When user change description
  $('#editDescription').on('input', function (event) {
    if (changeDescription === $('#editDescription').val()) {
      // $("#editPatientBtn").removeAttr("disabled");
      $('#editPatientBtn').prop('disabled', true)
       $('#editPatientBtn').parent().css('cursor', "no-drop")

    } else {
      $('#editPatientBtn').prop('disabled', false)
       $('#editPatientBtn').parent().css('cursor', "pointer")

    }
  enableDiableButton()

  })
// Update Group
function editPatient () {
  const requiredData = JSON.stringify({
    
    "firstname": $('#editFirstName').val(),
    "lastname": $('#editLastName').val(),
    "description":$('#editDescription').val(),
    "total_payment": Number($('#editTotalPayment').val()),
    "paid":Number($('#editPaid').val()),
    "phone":$('#editPhone').val(),
    "id":ID
  })

  $.ajax({
    url: 'https://rehmandentalclinic.org:9090/api/v1/patient/edit/', // Ensure trailing slash is present
    method: "PUT", // Wrap POST in quotes
    contentType: Content_Type, // Ensure Content_Type is defined (e.g., "application/json")
    dataType: "json",
    data: requiredData, // Convert data to JSON if sending JSON
    headers: {
        "Authorization": `Bearer ${accessToken}` // Ensure accessToken is defined
    },
    statusCode: {
      200:function (data) {
        $('#patientTableLoader').addClass('d-flex')
          $('#patientTableLoader').removeClass('d-none')
          $('#patientTable, #patientTableFooterDiv, #patientTableErrorDiv').addClass('d-none')
          
        $("#editGroup").modal("hide");
        patientTableInit.clear().draw();
        const entriesPerPageChanged = Number($('#datatableEntries1').val())
        getAllPatient(10, 1)
        const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-success text-white">
              <strong class="ms-2 me-auto">Success</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Patient updated successfully.
            </div>
          </div>`;
          $('body').append(toastHTML);
        // setTimeout(function () {
        //     window.location.reload(); // Reload page after 1 second
        // }, 1000);
      }
    },
    error: function (xhr, status, error) {
      $('#cover-spin').hide();
      console.log('----', xhr.status);
      $('#addPatient').modal('hide');
  
      if (xhr.status === 400) {
          // Handle Bad Request
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Bad Request</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was an issue with the data you submitted. Please check and try again.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 401) {
          // Handle Unauthorized
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-danger text-white">
              <strong class="ms-2 me-auto">Session Expired</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Your session token has expired. Please refresh the page or re-login.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 404) {
          // Handle Not Found
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Resource Not Found</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The requested resource could not be found. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 409) {
          // Handle Conflict
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Conflict</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was a conflict with your request. Please try again with different data.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 503) {
          // Handle Service Unavailable
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Service Unavailable</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The server is currently unavailable. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else {
          // Handle Other Errors
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Error</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              An unexpected error occurred. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      }
  
     
     
  }
  
});
}
// Enable/Disable Save Button on change input value
function enableDiableButton(){
  if (selectedStatus === setStatus && selectedDesc ===$('#editGroupDescription').val() && isSame) {
    $('#editPatientBtn').prop('disabled', true)
    $('#editPatientBtn').parent().css('cursor', "no-drop")
  } else {
    $('#editPatientBtn').prop('disabled', false)
    $('#editPatientBtn').parent().css('cursor', "pointer")

  }
}

function deletePatientRecord(ID) {
  
  Swal.fire({
    title: 'Deleting Patient Details',
    text: 'Are you sure you want to delete?',
    icon: 'warning',
    showCancelButton: true,
    
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    // If the user confirmed the action
    if (result.isConfirmed) {
     
      deletePatient(ID)
    } else {
     
    }
  });

}

function  deletePatient(Id){

  $.ajax({
    url: `https://rehmandentalclinic.org:9090/api/v1/patient/delete/${Id}`, // Ensure trailing slash is present
    method: "DELETE", // Wrap POST in quotes
    contentType: Content_Type, // Ensure Content_Type is defined (e.g., "application/json")
    dataType: "json",
    // data: requiredData, // Convert data to JSON if sending JSON
    headers: {
        "Authorization": `Bearer ${accessToken}` // Ensure accessToken is defined
    },
    statusCode: {
      202:function (data) {
        $('#patientTableLoader').addClass('d-flex')
          $('#patientTableLoader').removeClass('d-none')
          $('#patientTable, #patientTableFooterDiv, #patientTableErrorDiv').addClass('d-none')
          
        patientTableInit.clear().draw();
        const entriesPerPageChanged = Number($('#datatableEntries1').val())
        getAllPatient(10, 1)
        const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-success text-white">
              <strong class="ms-2 me-auto">Success</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Patient deleted successfully.
            </div>
          </div>`;
          $('body').append(toastHTML);
        // setTimeout(function () {
        //     window.location.reload(); // Reload page after 1 second
        // }, 1000);
      }
    },
    error: function (xhr, status, error) {
      $('#cover-spin').hide();
      console.log('----', xhr.status);
      $('#addPatient').modal('hide');
  
      if (xhr.status === 400) {
          // Handle Bad Request
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Bad Request</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was an issue with the data you submitted. Please check and try again.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 401) {
          // Handle Unauthorized
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header p-3 mb-2 bg-danger text-white">
              <strong class="ms-2 me-auto">Session Expired</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              Your session token has expired. Please refresh the page or re-login.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 404) {
          // Handle Not Found
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Resource Not Found</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The requested resource could not be found. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 409) {
          // Handle Conflict
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Conflict</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              There was a conflict with your request. Please try again with different data.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else if (xhr.status === 503) {
          // Handle Service Unavailable
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Service Unavailable</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              The server is currently unavailable. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      } else {
          // Handle Other Errors
          const toastHTML = `
          <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 10px; right: 10px; min-width: 300px; z-index: 1050;">
            <div class="toast-header">
              <strong class="ms-2 me-auto">Error</strong>
              <small>Just now</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              An unexpected error occurred. Please try again later.
            </div>
          </div>`;
          $('body').append(toastHTML);
      }
  
     
     
  }
  
});
}