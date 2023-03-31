const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.mongo_URL).then(
    () => {
        console.log('DB connected successfully.....')
    }
)
.catch((err) => {
    console.log(err)
})