let Campground = require('../models/campground');
let cities = require('./cities');
let {descriptors, places} = require('./seed');

let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp')
    .then(() => {
        console.log("Mongoose Hit!");
    })
    .catch((e) => {
        console.log(`Error: ${e}`);
    })

let randArray = array => array[Math.floor(Math.random()*array.length)];

let seedDb  = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<20; i++){
        let rand = Math.floor(Math.random() * 1000);
        let camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${randArray(descriptors)} ${randArray(places)}`,
            image: 'images/places.jpg',
            description: "Nestled amid towering pine trees, this serene camping haven offers secluded sites, crackling campfires, and star-studded skies. Escape to nature's embrace, where tranquility meets adventure in every rustling leaf.",
            price: 12
        })
        await camp.save(); 
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})