import crypto from "crypto";
import bcrypt from "bcrypt";
import randtoken from "rand-token";
import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import { env } from "../../config";

const roles = ["user", "admin"];
const gender = ["male", "female"];

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      trim: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: gender,
    },
    age: {
      type: Number,
    },
    diabetes: {
      type: Boolean,
    },
    cardio: {
      type: Boolean,
    },
    pneumo: {
      type: Boolean,
    },
    illnessScore: {
      type: Number,
      default: 0,
    },
    contactedPeople: [
      {
        deviceId: {
          type: String,
        },
        rssi: {
          type: Number,
        },
        location: {
          type: String,
        },
      },
    ],
    locations: [
      {
        latitude: { type: String },
        longitude: { type: String },
        createdA: { type: Date },
      },
    ],
    firebaseUid: {
      type: String,
      unique: true,
      required: true,
    },
    deviceId: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: roles,
    },
    defaultLocation: [
      {
        latitude: { type: String },
        longitude: { type: String },
        createdA: { type: Date },
      },
    ],
    defaultConfinementDistance: { type: Number, default: 50 },
    voices: [
      {
        file: { type: String },
        date: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.path("phone").set(function (phone) {
//   if (!this.picture || this.picture.indexOf("https://gravatar.com") === 0) {
//     const hash = crypto.createHash("md5").update(phone).digest("hex");
//     this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
//   }

//   if (!this.name) {
//     this.name = phone.replace(/^(.+)@.+$/, "$1");
//   }

//   return phone;
// });

// userSchema.pre("save", function (next) {
//   if (!this.isModified("deviceId")) return next();

//   /* istanbul ignore next */
//   const rounds = env === "test" ? 1 : 9;

//   bcrypt
//     .hash(this.deviceId, rounds)
//     .then((hash) => {
//       this.deviceId = hash;
//       next();
//     })
//     .catch(next);
// });

userSchema.methods = {
  view(full) {
    const view = {};
    let fields = ["id", "phone", "firebaseUid", "deviceId"];

    if (full) {
      fields = [
        ...fields,
        "illnessScore",
        "firstName",
        "lastName",
        "gender",
        "age",
        "cardio",
        "pneumo",
        "diabetes",
        "contactedPeople",
        "locations",
        "defaultConfinementDistance",
        "defaultLocation",
        "voices",
        "createdAt",
      ];
    }

    fields.forEach((field) => {
      view[field] = this[field];
    });

    return view;
  },

  authenticate(password) {
    return bcrypt
      .compare(password, this.password)
      .then((valid) => (valid ? this : false));
  },
};

userSchema.statics = {
  roles,

  // createFromService({ service, id }) {
  //   return this.findOne({
  //     $or: [{ [`services.${service}`]: id }, { phone, deviceId }],
  //   }).then((user) => {
  //     if (user) {
  //       user.services[service] = id;
  //       user.name = name;
  //       user.picture = picture;
  //       return user.save();
  //     } else {
  //       const password = randtoken.generate(16);
  //       return this.create({ services: { [service]: id }, phone, deviceId });
  //     }
  //   });
  // },
};

userSchema.plugin(mongooseKeywords, { paths: ["phone"] });

const model = mongoose.model("User", userSchema);

export const schema = model.schema;
export default model;
