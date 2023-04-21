$(document).ready(function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var minDate = yyyy + '-' + mm + '-' + dd;
  $('#start').attr('min', minDate);

  $('#registration').validate({
    rules: {
      title: {
        required: true
      },
      message: {
        required: true
      },
      start: {
        required: true,
        date: true
      },
      end: {
        required: true,
        date: true,
        greaterThanStart: true
      }
    },
    messages: {
      title: {
        required: "Please enter a title"
      },
      message: {
        required: "Please enter a description"
      },
      start: {
        required: "Please enter a start date",
        date: "Please enter a valid date"
      },
      end: {
        required: "Please enter an end date",
        date: "Please enter a valid date",
        greaterThanStart: "End date must be greater than start date"
      }
    },
    errorElement: "div",
    errorPlacement: function(error, element) {
      error.addClass("invalid-feedback");
      element.closest(".form-group").append(error);
    },
    highlight: function(element, errorClass, validClass) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    submitHandler: function(form) {
      const formData = $(form).serializeArray();
      $.ajax({
        url: '/process_M_2',
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

  $.validator.addMethod("greaterThanStart", function(value, element) {
    var start = $("#start").val();
    return this.optional(element) || new Date(value) > new Date(start);
  }, "End date must be greater than start date");
});
