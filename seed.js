const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminDb = require('./models/adminModal');

mongoose.connect('mongodb+srv://nidhinrobertstackup:nidhin17@cluster0.d1cicjl.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!');
    })
    .catch((err) => {
        console.log(err);
    });


const seedDb = async () => {

    const adminpassword = "12345";
    const hashedPassword = await bcrypt.hash(adminpassword, 10);

    const admin = [
        {
            username: "nidhin",

            email: "nidhin@gmail.com",

            password: hashedPassword
        }
    ];


    await adminDb.deleteMany({});
    await adminDb.insertMany(admin);
};

seedDb().then(() => {
    mongoose.connection.close();
});