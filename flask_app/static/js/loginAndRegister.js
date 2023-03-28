// removes validations after the set time
$(document).ready(function() { 
    setTimeout(() => {
      let classes = $(".alert.alert-danger");
      for (let i = 0; i < classes.length; i++){
        $(classes[i]).css("display", 'none');
      }
    }, 3000);
  });