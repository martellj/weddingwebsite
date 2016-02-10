$(document).ready(function(){
  var rsvpBtn = $("#rsvpBtn");
  var resetRsvp = $("#resetRsvp");

  var attending = $("#attending");
  var dinnerOption = $("#dinnerOption");

  function btnState(enabled) {
      rsvpBtn.prop("disabled", !enabled);
  }
  function switchRsvpState(showSuccess){
      var rsvp = $("#rsvp-form");
      var success = $("#success-form");

      if (showSuccess) {
          rsvp.hide();
          success.fadeIn(500);
      } else {
          rsvp.find("input[type=text]").val("");
          rsvp.find("select option:eq(0)").prop("selected", true);
          dinnerOption.prop("disabled", true);
          dinnerOption.find("option:eq(0)").prop("selected", true);
          success.hide();
          rsvp.fadeIn(500);
      }
  }
    resetRsvp.on("click", function(e){
        e.preventDefault();
        btnState(true);
        switchRsvpState(false);
    });

    attending.on("change",function(){

        if (!(!!attending.find(":selected").val())){
            dinnerOption.prop("disabled", true);
            dinnerOption.find("option:eq(0)").prop("selected", true);
        } else {
            dinnerOption.prop("disabled", false);
        }

    });

    rsvpBtn.on("click", function(){

       if($("#name").val() === "") {
           alert("Please enter a name");
           return;
       }

        if($("#email").val() === "") {
            alert("Please enter an email address.");
            return;
        }

       var json = {
           "name" : $("#name").val(),
           "email" : $("#email").val(),
           "attending" : $("#attending option:selected").val(),
           "dinnerOption" : $("#dinnerOption option:selected").val()
       }

       btnState(false);
       $.ajax({
           url: "/rsvp",
           method: "POST",
           data: JSON.stringify(json),
           dataType: "json",
           contentType: "application/json; charset=utf-8"
       }).complete(function(){
          switchRsvpState(true);
       });


   });


});