$(document).ready(function() {

  $('#registration').validate({
    rules: {
      title: {
        required: true,
        minlength: 5
      },
      description: {
        required: true,
        minlength: 10
      },
      start: {
        required: true
      },
      end: {
        required: true
      },
      'resourceTitle': {
        required: true,
        minlength: 3
      },
      'resourceURL': {
        required: true,
        url: true
      }
    },
    messages: {
      title: {
        required: "Please enter a title",
        minlength: "Title must be at least 5 characters long"
      },
      description: {
        required: "Please enter a description",
        minlength: "Description must be at least 10 characters long"
      },
      start: {
        required: "Please select a start date"
      },
      end: {
        required: "Please select an end date"
      },
      'resourceTitle[]': {
        required: "Please enter a title",
        minlength: "Title must be at least 3 characters long"
      },
      'resourceURL[]': {
        required: "Please enter a URL",
        url: "Please enter a valid URL"
      }
    },
    submitHandler: function(form) {
      $.ajax({
        url: '/process_M_5',
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
