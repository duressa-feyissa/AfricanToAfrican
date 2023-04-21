$(document).ready(function() {

  $("#registration").validate({

    rules: {
      title: "required",
      link: "required",
      option: "required",
      duration: "required",
    },

    messages: {
      title: "Please enter a title",
      link: "Please enter a link",
      option: "Please select a program",
      duration: "Please select a session start time",
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
      $.ajax({
        url: '/process_M_4',
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
