const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities")
const { descriptors, places } = require("./seedHelpers")

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection // simplification
db.on("error", console.error.bind(console, "connection error !"));
db.once("open", () => {
    console.log("Database connected !");

})

// returns random array value
function random(arr) {
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${random(descriptors)}-${random(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            location: `${cities[randomIndex].city},${cities[randomIndex].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })