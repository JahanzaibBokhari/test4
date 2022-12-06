const bcrypt = require('bcryptjs');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define the user schema
var userSchema = new Schema({
    "email": { type: String, unique: true },
    "password": String,
});

let User;

//initialize
module.exports.startDB = function () {

    return new Promise(function (resolve, reject) {

        let db = mongoose.createConnection(`mongodb+srv://dbuser:dbpass@senecaweb.nfty2og.mongodb.net/test4?retryWrites=true&w=majority`);

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("finalUsers", userSchema);
            resolve();
        });

    });

}

module.exports.register = function (user) {
    return new Promise(function (resolve, reject) {
        
        if (user.email.length === 0 || user.password.length === 0 || /^\s+$/.test(user.email) || /^\s+$/.test(user.password)) {
            reject("Error: email or password cannot be empty.");
        }
        else {
            bcrypt.hash(user.password, 10)
                .then(hash => {
                    user.password = hash;
                    let newUser = new User(user);

                    newUser.save()
                        .then(function () {
                            resolve(newUser);
                        }).catch(function (error) {
                            if (error.code === 11000) {
                                reject("Error: " + newUser.email + " already exists.")
                            }
                            else {
                                reject("Error: cannot create the user.")
                            }
                        });
                }).catch(function () {
                    reject("There was an error encrypting the password");
                });
        }


    });
}

module.exports.signIn = function (user) {
    return new Promise(function (resolve, reject) {
        
        User.findOne({ email: user.email }).exec()
            .then(function (foundUser) {
                if (!foundUser) {
                    reject("Cannot find the user: " + user.email);
                }
                else {
                    bcrypt.compare(user.password, foundUser.password)
                    .then((result) => {
                        if (result === true) {
                            resolve(foundUser);
                        }
                        else if (result === false) {
                            reject("Incorrect password for user: " + user.email);
                        }
                    });
                }
            })
            .catch(function (error) {
                reject("Cannot find the user: " + user.email);
            });


    });
}
