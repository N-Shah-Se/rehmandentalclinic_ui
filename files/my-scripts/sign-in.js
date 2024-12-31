

let signinEmail = ''
let hashPassword = ''
const url2 = new URL(window.location);
const newUrl2 = url2.origin;
const POST = "POST";
const Content_Type = "application/json";
// Document Ready Function
$(document).ready(function () {
  // localStorage.clear()
  $('#signinForm').validate({
    debug: true,
    rules: {
      signInUsername: {
        required: true
      },
    
      signInUserPassword: {
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
      $(element).parents('.error').removeClass(errorClass).addClass(validClass)
    },
    errorPlacement: function (error, element) {
      if (element.is(':checkbox') || element.is('#signinUserPassword')) { error.appendTo(element.parent().parent()) } else if (element.is('#signinUserPassword')) { alert('here')  } else {
        error.appendTo(element.parent())
      }
    }
  })
})



$('#signinForm').submit(function (e) {
    
  e.preventDefault()

  if ($(this).validate().form()) {
   
    signinEmail = $('#signinUserEmail').val()
    const signinUserName = $('#signinUserName').val()
    const signinPassword = $('#signinUserPassword').val()

    // const hashObj = new jsSHA('SHA-512', 'TEXT')
    // hashObj.update(signinPassword)
    // const hash = hashObj.getHash('HEX')
    // hashPassword = hash
    // Secret key convert to hash
    const requireData = JSON.stringify({
    //   username: signinUserName,
    //   email: signinEmail,
    //   password: hashPassword,
    "username":signinUserName,
    // "password": hashPassword
    "password": signinPassword

    })
    
    $.ajax({
      url: `https://rehmandentalclinic.org:9090/api/v1/user/login/`,
      method: POST,
      contentType: Content_Type,
      dataType: 'json',
      data: requireData,
      statusCode: {
        200: function (xhr) {

          localStorage.setItem('_refresh',xhr.refresh)
          localStorage.setItem('_access',xhr.access)

         
          window.location.href = 'index.html'
        //   setTimeout(function () {
        //     $('#signinBtn').text('Sign In')
        //     $('#signinBtn').attr('disabled', false)
        //     $('#signinBtn').css('cursor', 'pointer')
        //   }, 100)
        },
    
      },
      error: function (xhr, error) {

        const errroShow = JSON.parse(xhr.responseText)
       
        if (
          xhr.status === 401 ||
          xhr.status === 400 ||
          xhr.status === 403 ||
          xhr.status === 404 ||
          xhr.status === 503
        ) {
          
          alert('Error occurs')
        }else{
            alert('error')
        }
      
      }
    })
  }
})




