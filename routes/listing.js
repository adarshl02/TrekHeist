const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(                                   //create route
    isLoggedIn,
    upload.single("listing[image]"), 
    validateListing, //multer image data ko req.file me li aega
    wrapAsync(listingController.createListing)
  );
  

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(
    wrapAsync(listingController.showListing) //Show route
  )
  .put(
    //Update route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    //Delete route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

//Edit Route to serve a form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
