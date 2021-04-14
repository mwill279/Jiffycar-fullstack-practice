
var today = new Date();


$("#status").change(function(){
  if($(this).prop("checked")){
    $("#rentedFrom").removeAttr("disabled");
  }
  else{
    $("#rentedFrom, #rentedTo").each(function(){
      $(this).val("");
      $(this).attr("disabled", true);
    });
  }
});


$("#rentedFrom").change(function(){
  $("#rentedTo").removeAttr("disabled");
  $("#rentedTo").attr("min", $(this).val());
});

$("#rentedFrom").attr("min", today.toISOString().split("T")[0]);
