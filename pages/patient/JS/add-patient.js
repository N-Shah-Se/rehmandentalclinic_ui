let fname,lname,paid,totalPaid,phone,description
const POST = "POST";
const Content_Type = "application/json";
$(document).ready(function () {
    $("#sidebar").load("/sidebar.html");
    $("#header").load("/header.html");
    $('#spinner').show(0)
    validator = $('#createPatientForm').validate({
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
         
        //   groupName: {
        //     required: 'Please select an item.'
        //   },
         
          // signupusername: {
          //   chractesDotHypenUnderscore: "Permitted special characters: '-', '_', '.'"
          // }
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
            error.appendTo(element.parent().parent())
          }
        }
      })
  });


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
    $('#cover-spin').show()
  
   
   
    const requiredData = JSON.stringify({

      "firstname": fname,
      "lastname": lname,
      "description":description,
      "total_payment": totalPaid,
      "paid":paid,
      "phone":phone
    })
  const accessToken=localStorage.getItem('_access')
    $.ajax({
      url: 'https://rehmandentalclinic.org/' + 'api/v1/patient/add/',
      method: POST,
      contentType: Content_Type,
      dataType: 'json',
      data: requiredData,
      headers: {
        'Authorization': `Bearer ${accessToken}` // Adding Authorization header
      },
      statusCode: {
        200: function (data) {
          $('#cover-spin').hide(0)
          $("#").modal("hide");
          showNotificationError('bg-green', null, null, null, null, null, 'Saved Successfully')
          setTimeout(function () {
            window.location.reload()
          }, 1000)
        }
      },
  
      error: function (xhr) {
        $('#cover-spin').hide()
        
        if (xhr.status === 400) {
          showNotificationError(
            'bg-orange',
            null,
            null,
            null,
            null,
            null,
            invalidRequest400Error
          )
        } else if (xhr.status === 401) {
          showNotificationError(
            'bg-orange',
            null,
            null,
            null,
            null,
            null,
            unauthorizedRequest401Error
          )
        } else if (xhr.status === 404) {
          showNotificationError(
            'bg-orange',
            null,
            null,
            null,
            null,
            null,
            notFound404Error
          )
        } else if (xhr.status === 409) {
          showNotificationError(
            'bg-orange',
            null,
            null,
            null,
            null,
            null,
            alreadyExist409Error
          )
        } else if (xhr.status === 503) {
          showNotificationError('bg-red', null, null, null, null, null, serverError503Error)
        } else if (xhr.status === 408) {
          swal({
            title: ' ',
            text: sessionExpired408Error,
            type: 'info',
            showCancelButton: false,
            confirmButtonText: 'Logout'
          }, function (isConfirm) {
            if (isConfirm) {
              localStorage.clear()
              window.location.href = redirectToSignInPage408
            }
          })
        } else if (xhr.status === 410) {
          $('#cover-spin').show()
          $.ajax({
            url: MAIN_API_PATH + getGmtAPI,
            method: POST,
            contentType: Content_Type,
            dataType: 'json',
            success: function (data) {
              const encrypt = new JSEncrypt()
              encrypt.setPublicKey(sitePublicKey)
              const DateString = String(data.unixtime)
              securityKeyEncrypted = encrypt.encrypt(pageName + DateString)
              SecurityKeyTime = false
              createUser()
            },
            error: function () {
              $.getJSON(worldTimeAPI,
                function (data) {
                  const encrypt = new JSEncrypt()
                  encrypt.setPublicKey(sitePublicKey)
                  const DateString = String(data.unixtime)
                  securityKeyEncrypted = encrypt.encrypt(pageName + DateString)
                  SecurityKeyTime = false
                  createUser()
                })
            }
          })
        } else {
          showNotificationError('bg-red', null, null, null, null, null, serverError503Error)
        }
      }
    })
  }