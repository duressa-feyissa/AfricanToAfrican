$(document).ready(function() {
  
  $("#registration").validate({
    rules: {
      content: {
        required: true,
        minlength: 10
      },
      option: {
        required: true
      }
    },
    messages: {
      content: {
        required: "Please enter some content",
        minlength: "Content must be at least 10 characters long"
      },
      option: {
        required: "Please select a program"
      }
    },
    submitHandler: function(form) {
      const formData = $(form).serializeArray();
      $.ajax({
        url: '/process_M_3',
        type: 'POST',
        data: $(form).serialize(),
        success: function(response) {
          window.location.href = '/mentor'
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 400) {
            setTimeout(function() {
              $('#myAlert').addClass('show');
              $('#myAlert').html('<h5>something fill</h5>')
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
