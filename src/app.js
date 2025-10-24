import express from "express"
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

//Routes import

import userRoutes from './routes/user.routes.js'
import branchRoutes from './routes/branch.routes.js'


// Router declaration

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/branches", branchRoutes)


export {app}