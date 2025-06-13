require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const HoldingsModel = require('./models/HoldingsModel');
const PositionsModel = require('./models/PositionsModel');
const OrdersModel = require("./models/OrdersModel");
const User = require("./models/User");
const { generateHashPassword, isValidPassword } = require("./utils");

const app = express();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("Server Is Listening on Port " + PORT);
});

async function main() {
    await mongoose.connect(process.env.DB_URL);
}

main().then(() => {
    console.log("ZERODHA Database has been connected successfully....");
}).catch((err) => {
    console.log("Error While Connecting to the ZERODHA Database : " + err);
});

//middlewares 
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
)); // allow sending request to other port or other domain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes 

app.get("/holdings", async (req, res,next) => {
    try {
        const holdings = await HoldingsModel.find({});
        res.json(holdings);
    } catch (error) {
        next(error);
    }
})

app.get("/positions", async (req, res,next) => {
    try {
        const positions = await PositionsModel.find({});
        res.json(positions);
    } catch (error) {
        next(error);
    }
})

app.get("/orders", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.json({ message: "Not Authenticated" })//you are not authenticated user log in please
        } else {
            const decoded = jwt.verify(token, process.env.SECRET);
            let orders = await OrdersModel.find({userId:decoded.id});
            res.json(orders);
        }
    } catch (error) {
        res.json({ message: "Invalid token" });
    }
})

app.post("/order", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.json({ message: "Not Authenticated" })//you are not authenticated user log in please
        }else{
            const decoded = jwt.verify(token, process.env.SECRET);
            req.body.userId = decoded.id;
            let order = new OrdersModel(req.body);
            await order.save();
            res.json({flag:true})
        }
    } catch (error) {
        res.json({flag:false})
    }
})

//register

app.post("/register", async (req, res) => {
    try {
        let user = req.body;
        const hash = await generateHashPassword(user.password);
        user.password = hash;
        let newUser = new User(user);
        await newUser.save();
        //token creation
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
            expiresIn: "1d",
        });
        //sending token in cookie to user 
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax", // for cross origin 
            secure: false, // true for https
        });
        res.json({ flag: true });
    } catch (error) {
       console.log(error);
       res.json({message:"Error Occured Please try again!"})
    }
})

//login

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            res.json({ message: "invalid email" });
        } else {
            let result = await isValidPassword(password, user.password);
            if (result) {
                //token creation
                const token = jwt.sign({ id: user._id }, process.env.SECRET, {
                    expiresIn: "1d",
                });
                //sending token in cookie to user 
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax", // for cross origin 
                    secure: false, // true for https
                });
                res.json({ flag: true }); // successfully logged in
            } else {
                res.json({ flag: false }); // invalid password
            }
        }
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});

//logout

app.get("/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax", // or "none" if using secure:true
      secure: false    // true if using HTTPS
    });
    console.log("logout");
    res.json({flag:true});
  });

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // log the error stack
    res.json({error: err.message });
  });
  