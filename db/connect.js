const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DBURL,{useNewUrlParser: true,
    useUnifiedTopology: true})