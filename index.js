
/**
 * Create the Car Database with a previous one or a new one with each refresh
 * */
if(sessionStorage.getItem("Inventory")){
   var inventory = JSON.parse(sessionStorage.getItem("Inventory"));
}
else{
  var inventory = [{}];
}

var today=new Date();
var timezone = "T00:00:00"

function statusUpdate(car){
  if(document.getElementsByName("status")[car].checked){
    document.getElementsByName("rentedfrom")[car].removeAttribute("disabled");
  }
  else{
    document.getElementsByName("rentedfrom")[car].setAttribute("disabled", true);
  }
}

/* *
 * Creates and Add new car object into the inventory
 * @function
 * */
function addcar(){
  var car = {
    id: inventory.length,
    make: document.getElementsByName("make")[0].value,
    model: document.getElementsByName("model")[0].value,
    year: document.getElementsByName("year")[0].value,
    numSeats: document.getElementsByName("numseats")[0].value,
    price: document.getElementsByName("price")[0].value,
    rented: document.getElementsByName("status")[0].checked,
    rentedFrom: "",
    rentedTo: "",

    history: {
      totalprice: "",
      numofdays: "",
      miles: ""
    }
  }

  if(car.rented){
    addHistory(car, 0)
  }

  inventory.push(car);
  sessionStorage.setItem("Inventory", JSON.stringify(inventory));
}

function addHistory(car, index){
  car.rentedFrom = new Date(document.getElementsByName("rentedfrom")[index].value);
  car.rentedTo = new Date(document.getElementsByName("rentedto")[index].value);
  car.history.numofdays = (car.rentedTo.getTime() - car.rentedFrom.getTime())/(1000*3600*24);
  car.history.totalprice = car.history.numofdays * car.price;
  car.history.miles = car.history.numofdays * 10;
}

/* *
 * Displays all the cars in the index.html
 * @function
 * */
function display(){
  document.getElementById("displayall").innerHTML = "<div class = 'avail'></div>";
  inventory.forEach((x, index) => {
    if(index > 0){


    document.getElementById("displayall").innerHTML += "<div class = 'avail'><br>" + "Make: " + x.make + "<br>" +
                                                      "Model: " + x.model + "<br>" +
                                                      "Year: " + x.year + "<br>" +
                                                      "Number of Seats: " + x.numSeats + "<br>" +
                                                      "Price: $" + x.price + "<br><br></div>";

    if(x.rented){
      var from = new Date(x.rentedFrom.split("T")[0] + timezone);
      var to = new Date(x.rentedTo.split("T")[0] + timezone);
      document.getElementById("displayall").innerHTML += "Rented From: " + from.toDateString() + "<br>" +
                                                         "Rented To: " + to.toDateString() + "<br>" +
                                                         "Number of days: " + x.history.numofdays + "<br>" +
                                                         "Miles driven: " + x.history.miles + "<br>" +
                                                         "Total price: $" + x.history.totalprice + "<br>" +
                                                         "Total price w/ vat: $" + ((x.history.totalprice * .21) + x.history.totalprice);

      document.getElementsByClassName("avail")[x.id].className = "avail notavail";
    }

    document.getElementById("displayall").innerHTML += editform(x.id);


  }

});
}

/* *
 * Edits an existing car object based on the value from the form
 * @function
 * @param {car: object} car - car information
 * */
function editcar(car){
  inventory[car].make = document.getElementsByName("make")[car].value;
  inventory[car].model = document.getElementsByName("model")[car].value;
  inventory[car].year = document.getElementsByName("year")[car].value;
  inventory[car].numSeats= document.getElementsByName("numseats")[car].value;
  inventory[car].price = document.getElementsByName("price")[car].value;
  inventory[car].rented = document.getElementsByName("status")[car].checked;


  if(inventory[car].rented){
    addHistory(inventory[car], car);
  }

  sessionStorage.setItem("Inventory", JSON.stringify(inventory));
}

/* *
 * Create the form to edit an existing car object
 * @function
 * @param {car: object} car - car information
 * @returns {string} form for editing car object
 * */
function editform(car){
  return "<div class='accordion' id='accordionExample'>" +
"<div class='accordion-item'>" +
  "<h2 class='accordion-header' id='headingOne'>" +
    "<button class='accordion-button col-md-4' type='button' data-bs-toggle='collapse' data-bs-target='#collapse" +car+ "' aria-expanded='true' aria-controls='collapseOne'>" +
      "Edit Car" +
    "</button>" +
  "</h2>" +


  "<div id='collapse"+car+"' class='accordion-collapse collapse' aria-labelledby='headingOne' data-bs-parent='#accordionExample'>" +
    "<div class='accordion-body'>" +

  "<form action='index.html' method='post'>" +

  "<label for='Make'>Make: </label>" +
  "<input type='text' name='make' value=" + inventory[car].make +" required>" +

  "<label for='Model'>Model: </label>" +
  "<input type='text' name='model'  value= " + inventory[car].model +" required>" +

  "<label for='Year'>Year: </label>" +
  "<input type='number' name='year'  value= " + inventory[car].year +" required>" +

  "<label for='Numseats'>Number of Seats: </label>" +
  "<input type='number' name='numseats'  value= " + inventory[car].numSeats +" required>" +

  "<label for='Price'>Price: </label>" +
  "<input type='number' name='price' value= " + inventory[car].price + " " + "step='0.01' required>" +

  "<label for='status' class='form-check-label'>Rented</label>" +
  "<input type='checkbox' class='form-check-input' name='status' onchange='statusUpdate(" +car+ ")'>" +

  "<label for='RentedFrom'>Rented From: </label>" +
  "<input type='date' name='rentedfrom' onchange='valiDate_edit(" + car+ ")' disabled required>" +

  "<label for='rentedTo'>Rented To: </label>" +
  "<input type='date' name='rentedto' disabled required>" +
  "<button type='submit' onclick='editcar(" + car + ")'>Submit</button>" + "</form></div></div></div></div><br>";
}

/* *
 * Formats the date object to string for html use
 * @function
 * @param {Date} d - Date object
 * @returns (string) formatted html date
 * */
function formatDate(d){
  if(d.getMonth() + 1 < 10) {var month = "0" + (d.getMonth() + 1);}
  else{var month = d.getMonth() + 1;}

  if(d.getDate() < 10) {var day = "0" + d.getDate();}
  else{var day = d.getDate();}

  return d.getFullYear() + "-" + month + "-" + day;
}


/* *
 * bundles the functions needed to run when index.html loads
 * */
 function start(){
   if (inventory.length != 0){
     display();
   }
   valiDate_add();
 }

 /* *
  * sets the 'min' attribute of 'rentedfrom' to today's date
  * */
 function valiDate_add(){
  document.getElementsByName("rentedfrom").forEach((item, index) => {
    item.setAttribute("min", formatDate(today));
  });
 }

 /* *
  * sets the 'min' attribute of 'rentedto' to rentedfrom date
  * @param {int} car - car's id
  * */
 function valiDate_edit(car){
  if((document.getElementsByName("rentedfrom")[car].value > document.getElementsByName("rentedto")[car].value) && document.getElementsByName("rentedto")[car].value != ""){
    document.getElementsByName("rentedto")[car].setAttribute("disabled", true);
  }
  else{
    document.getElementsByName("rentedto")[car].removeAttribute("disabled")
    document.getElementsByName("rentedto")[car].setAttribute("min", document.getElementsByName("rentedfrom")[car].value);
  }
 }
