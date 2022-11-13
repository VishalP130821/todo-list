//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-vishal:Test123@cluster0.tqqbw.mongodb.net/todolistDB");

const itemsSchema = {

  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Wlcm to your To-Do List"
})

const item2 = new Item({
  name: "Hit this + to add item"
})

const item3 = new Item({
  name: "<-- Hit this to delete item"
})


const defaultItems = [item1, item2, item3];


const listSchema = {

  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {



  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {

      Item.insertMany(defaultItems, function (err) {

        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted default items.")
        }
      });
      res.redirect('/');

    } else {

      var today = new Date();

      var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
      }


      var day = today.toLocaleDateString(today.getTimezoneOffset(), options);
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }


  });


});


app.get('/:customListName', function (req, res) {

  const customListName = req.params.customListName;

  const list = new List({

    name: customListName,
    items: defaultItems
  });

  list.save();

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect('/');
});


app.post("/delete", function (req, res) {

  const deleteItemId = req.body.checkbox;

  Item.findByIdAndRemove(deleteItemId, function (err) {

    if (!err) {

      console.log("Item Deleted Successfully");
      res.redirect('/');
    }
  });
});



app.get("/about", function (req, res) {
  res.render("about");
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}




app.listen(port, function () {
  console.log("Server started has started Successfully!");
});