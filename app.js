/**
 * External nodejs mods used
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

/**
 * initialize and customize the app
 */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/edit", express.static(path.join(__dirname, "public")));

/**
 * initialize and connect to the mongoose server
 */
mongoose.connect("mongodb://localhost:27017/carsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * Mongoose Schemas
 */
const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  numSeats: Number,
  price: Number,
  rented: Boolean,
  rentedFrom: Date,
  rentedTo: Date,
  history: {
    totalprice: Number,
    numofdays: Number,
    miles: Number,
    totalprice_vat: Number
  }
});

/**
 * Mongoose Models
 */
const Car = mongoose.model("Car", carSchema);


var today = new Date();
var options = {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }

/**
 * Routes
 */
app.route("/")
  .get(function(req, res) {
    Car.find({}, function(err, inventory) {
      res.render("list", {inventory: inventory});
    });
  })

  .post(function(req, res) {
    const car = new Car({
      make: req.body.make,
      model: req.body.model,
      year: Number(req.body.year),
      numSeats: Number(req.body.numseats),
      price: Number(req.body.price),
      rented: false,
      rentedFrom: "",
      rentedTo: "",
      history: {
        totalprice: 0,
        numofdays: 0,
        miles: 0,
        totalprice_vat: 0
      }
    });

    if (req.body.status === "on") {
      car.rented = true;
      car.rentedFrom = new Date(req.body.rentedfrom);
      car.rentedTo = new Date(req.body.rentedto);
      car.history.numofdays = (car.rentedTo.getTime() - car.rentedFrom.getTime()) / (1000 * 3600 * 24);
      car.history.totalprice = car.history.numofdays * car.price;
      car.history.miles = car.history.numofdays * 10;
      car.history.totalprice_vat = car.history.totalprice + (car.history.totalprice * .21);
    }
    car.save();
    res.redirect("/");
  });

app.post("/edit/:id", function(req, res) {
  Car.findById(req.params.id, function(err, car) {
    res.render("edit", {car: car});
  });
});

app.post("/change/:id", function(req, res) {

  Car.findByIdAndUpdate({_id: req.params.id}, {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      numSeats: req.body.numseats,
      price: req.body.price,
      rented: false
    },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(today.toLocaleDateString("en-US", options) + " - Document updated Success!!");
      }
    });

  if (req.body.status === "on") {
    Car.findByIdAndUpdate({_id: req.params.id}, {
        rented: true,
        rentedFrom: new Date(req.body.rentedfrom),
        rentedTo: new Date(req.body.rentedto),
      },
      function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log(today.toLocaleDateString("en-US", options) + " - Dates updated Success!!");
        }
      });

    Car.findById({_id: req.params.id}, function(err, car_temp) {
      var numofdays = (car_temp.rentedTo.getTime() - car_temp.rentedFrom.getTime()) / (1000 * 3600 * 24);
      Car.findByIdAndUpdate({_id: req.params.id}, {
          history: {
            numofdays: numofdays,
            totalprice: numofdays * car_temp.price,
            miles: numofdays * 10,
            totalprice_vat: (numofdays * car_temp.price) + ((numofdays * car_temp.price) * .21)
          }
        },
        function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log(today.toLocaleDateString("en-US", options) + " - History updated Success!!");
          }
        });
    });
  }
  res.redirect("/");
});

app.all("/contact", function(req, res) {
  res.sendFile(__dirname + "/public/html/contactme.html");
});

app.listen(3000, function(req, res) {
  console.log(today.toLocaleDateString("en-US", options) + " - Server is running on port 3000!");
});
