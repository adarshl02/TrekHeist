if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const cookieParser=require("cookie-parser");
const session = require('express-session');
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
// const { serialize } = require("v8");
const userRouter=require("./routes/user.js");


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("db connection is successful");
})
.catch(err => console.log(err));

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }
async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.use(cookieParser("secretcode"));
// app.get( "/getcookies", (req,res)=>{
//     res.cookie("greet","namaste");
//     res.send("send you a cookie");
// });
// app.get("verify",(req,res)=>{
//     console.log(req.signedCookies);   //gives actual value
//     res.send("verified");
// });
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("madein","India",{signed : true});
//     res.send("signed cookie sent");
// });

const store=MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter :  24 *3600,   //in second  
});

store.on("error",()=>{
    console.log("ERROR in Mongo Session Store",err);
});

const sessionOptions={
    store,
    secret:  process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,   //for seven days
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
};
app.get("/",(req,res)=>{
    res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());  //middleware that initialise passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //authenticate - sign up or login

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error= req.flash("error") ;
    res.locals.currUser=req.user;
    next();
});

//
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email : "student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=404,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
    // res.send("Something went wrong!");        //error handling middleware
});                                     

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});


