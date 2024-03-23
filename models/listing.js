const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url : String,
    filename : String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
//   geometry:{
//     type : {
//     type : String,
//     enum : ['Point'], 
//     required : true
//   },
//   coordinates : {
//     type : [Number],
//     required : true
//   }
// }
});

//mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

//{type : String,default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommunity.glideapps.com%2Ft%2Frandom-template-to-generate-unsplash-images%2F15862&psig=AOvVaw2rJ94vDh8ltqanBSmH5V63&ust=1704445955913000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIi5y5Wyw4MDFQAAAAAdAAAAABAD", set:(v)=>v===""?"https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommunity.glideapps.com%2Ft%2Frandom-template-to-generate-unsplash-images%2F15862&psig=AOvVaw2rJ94vDh8ltqanBSmH5V63&ust=1704445955913000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIi5y5Wyw4MDFQAAAAAdAAAAABAD":v},
