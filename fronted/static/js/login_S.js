$(document).ready(function() {
  $("#registration").validate({
    rules: {
      email: {
        required: true,
        email: true
      },      
      password: {
        required: true,
        minlength: 6
      },
    },
    messages: {        
      email: {
        required: "Please enter email address",
        email: "Please enter a valid email address.",
      },
      password: {
        required: 'Please enter a password',
        minlength: 'Your password must be at least 6 characters long'
      }
    },
    submitHandler: function(form) {
      const formData = $(form).serializeArray();
      $.ajax({
        url: '/process_S_1',
        type: 'POST',
        data: $(form).serialize(),
        success: function(response) {
          window.location.href = '/'
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 400) {
            setTimeout(function() {
              $('#myAlert').addClass('show');
              $('#myAlert').html('<h5>Invalid email or password!</h5>')
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
