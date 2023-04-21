$(document).ready(function() {
  $("#registration").validate({
    rules: {
      username: "required",
      email: {
        required: true,
        email: true
      },      
      password: {
        required: true,
        minlength: 6
      },
      cpassword: {
        required: true,
        equalTo: '#password'
      }
    },
    messages: {
      username: {
        required: "Please enter username",
      },          
      email: {
        required: "Please enter email address",
        email: "Please enter a valid email address.",
      },
      password: {
        required: 'Please enter a password',
        minlength: 'Your password must be at least 6 characters long'
      },
      cpassword: {
        required: 'Please confirm your password',
        equalTo: 'Your passwords do not match'
      }
    },
    submitHandler: function(form) {
      const formData = $(form).serializeArray();
      $.ajax({
        url: '/process_S',
        type: 'POST',
        data: $(form).serialize(),
        success: function(response) {
          window.location.href = '/students/login'
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 400) {
            setTimeout(function() {
              $('#myAlert').addClass('show');
              $('#myAlert').html('<h5>Email already registered!</h5>')
            }, 1000);

            setTimeout(function() {
              $('#myAlert').removeClass('show');
            }, 5000);

          } else {
            alert('Error2: ' + errorThrown);
          }
        }
      });
    }    
  });
});
