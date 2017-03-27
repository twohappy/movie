let mongoose = require('mongoose');
//保护密码最好的是加盐的密码hash后的值
let bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function (next) {
    let user = this;

    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });

    // next();
});

UserSchema.methods = {
    comparePassword(_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return cb(err);

            cb(null, isMatch);
        })
    }
};

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updatedAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = UserSchema;