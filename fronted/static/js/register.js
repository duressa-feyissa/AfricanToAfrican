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
      $.ajax({
        url: 'http://localhost:3001/api/students',
        type: 'POST',
        data: $(form).serialize(),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
          alert(12, response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 400) {
            alert(1, jqXHR.responseText);
          } else {
            alert('Error: ' + errorThrown);
          }
        }
      });   
    }
  });
});
/*
submitHandler: function(form) {
  $.ajax({
    url: '/signup',
    type: 'POST',
    data: $(form).serialize(),
    success: function(response) {
      // If the form submission is successful, display a success message
      alert(response);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // If the form submission fails, display an error message
      if (jqXHR.status == 400) {
        $('#email-error').text(jqXHR.responseText);
      } else {
        alert('Error: ' + errorThrown);
      }
    }
  });
}
*/