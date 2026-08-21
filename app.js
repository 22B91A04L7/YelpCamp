const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require("method-override")

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection // simplification
db.on("error", console.error.bind(console, "connection error !"));
db.once("open", () => {
    console.log("Database connected !");

})

//middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds", async (req, res) => {
    const { title, location } = req.body;
    const newCamp = new Campground({ title: title, location: location })
    await newCamp.save();
    res.redirect("/campgrounds")
})

//edit --> form
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground })
})
//edit
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const { title, location } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title: title, location: location })
    res.redirect(`/campgrounds/${id}`)
})

//delete
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
})

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render("campgrounds/show", { campground })
})


app.listen(3000, () => {
    console.log("Server running on PORT 3000");
})