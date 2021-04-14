const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/edit", express.static(path.join(__dirname, "public")));

var today = new Date();
var inventory = [];

app.route("/")
  .get(function(req, res){
    res.render("list", {inventory: inventory});
  })

  .post(function(req, res){
    var car = {
      id: inventory.length,
      make: req.body.make,
      model: req.body.model,
      year: Number(req.body.year),
      numSeats: Number(req.body.numseats),
      price: parseFloat(req.body.price),
      rented: false,
      rentedFrom: "",
      rentedTo: "",
      history: {
        totalprice: "",
        numofdays: "",
        miles: "",
        totalprice_vat: ""
      }
    }
    if(req.body.status === "on"){
      car.rented = true;
      car.rentedFrom = new Date(req.body.rentedfrom);
      car.rentedTo = new Date(req.body.rentedto);
      car.history.numofdays = (car.rentedTo.getTime() - car.rentedFrom.getTime())/(1000*3600*24);
      car.history.totalprice = car.history.numofdays * car.price;
      car.history.miles = car.history.numofdays * 10;
      car.history.totalprice_vat = car.history.totalprice + (car.history.totalprice * .21);
    }

    inventory.push(car);
    res.redirect("/");
  });

app.post("/edit/:id", function(req, res){
  res.render("edit", {car: inventory[req.params.id]});
});

app.post("/change/:id", function(req, res){
  inventory[req.params.id].make=req.body.make;
  inventory[req.params.id].model=req.body.model;
  inventory[req.params.id].year=req.body.year;
  inventory[req.params.id].numSeats=req.body.numseats;
  inventory[req.params.id].price=req.body.price;
  inventory[req.params.id].rented=false;
  inventory[req.params.id].rentedFrom="";
  inventory[req.params.id].rentedTo="";
  if(req.body.status === "on"){
    inventory[req.params.id].rented = true;
    inventory[req.params.id].rentedFrom = new Date(req.body.rentedfrom);
    inventory[req.params.id].rentedTo = new Date(req.body.rentedto);
    inventory[req.params.id].history.numofdays = (inventory[req.params.id].rentedTo.getTime() - inventory[req.params.id].rentedFrom.getTime()) / (1000*3600*24);
    inventory[req.params.id].history.totalprice = inventory[req.params.id].history.numofdays * inventory[req.params.id].price;
    inventory[req.params.id].history.miles = inventory[req.params.id].history.numofdays * 10;
    inventory[req.params.id].history.totalprice_vat = inventory[req.params.id].history.totalprice + (inventory[req.params.id].history.totalprice * .21);
  }

  res.redirect("/");
});

app.all("/contact", function(req, res){
  res.sendFile(__dirname + "/contactme.html");
});

app.listen(3000, function(req, res){
  var options = {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',

  }
  console.log(today.toLocaleDateString("en-US", options) + " - Server is running on port 3000!");

});
