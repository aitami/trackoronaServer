import { success, notFound } from "../../services/response/";
import { User } from ".";
import { sign } from "../../services/jwt";
import multer from 'multer'
import fs from 'fs'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = __dirname+'/../../uploads/'  + req.url.replace('/uploadVoice/','').split('?access_token')[0]
      console.log("...............................",path)
        if (!fs.existsSync(path)){
            fs.mkdirSync(path)
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage }).single('file')

export const uploadVoice = (req, res, next) => {
  upload(req, res, function (err) {
      console.log("****************",req.body._parts)
      const id = req.params.id || ''

      if (!req.file) {
          console.log("No file received", req.body);
          return res.status(404).json({
              success: false,
              error:'No file received'
          });
      }
      
      if (!id) {
          console.log("No user id to update", req.body);
          return res.status(404).json({
              success: false,
              error:'No user id to update'
          });
      }

      console.log(req.file)
      console.log("reeeeeeeeeeq......",Object.assign({}, {  voices: req.file.originalname}, {id: id}))
      User.findById(id)
          .then((user)=> {
              console.log({user});
              let voice = {
                file: req.file.originalname,
                date: new Date()
              }
              return user ? Object.assign(user, {voices: user.voices.concat(voice)}).save() : null
          })
          .then(()=>{
              return res.status(200).json({success :true, data :req.body})
          })

  })
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then((count) =>
      User.find(query, select, cursor).then((users) => ({
        rows: users.map((user) => user.view()),
        count,
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.view() : null))
    .then(success(res))
    .catch(next);

export const showMe = ({ user }, res) => res.json(user.view(true));

export const create = ({ bodymen: { body } }, res, next) => {
  console.log({ body });
  return User.create(body)
    .then((user) => {
      console.log({ user });
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201));
    })
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === "MongoError" && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: "phone",
          message: "phone already registered",
        });
      } else {
        next(err);
      }
    });
};
export const updateContactedPeople = (
  { bodymen: { body }, params, user },
  res,
  next
) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => {
      const shouldAddContact =
        user.contactedPeople &&
        user.contactedPeople.find(
          (elm) => elm.deviceId === body.contactedPeople.deviceId
        ) === undefined;
      // console.log({
      //   uuuuu: user.contactedPeople,
      //   ffff: user.contactedPeople.find(
      //     (elm) => elm.deviceId === body.contactedPeople.deviceId
      //   ),
      //   bbbbb: body.contactedPeople,
      // });
      if (shouldAddContact) {
        let newContactedPeople = user.contactedPeople;
        newContactedPeople.push(body.contactedPeople);
        return user
          ? Object.assign(user, { contactedPeople: newContactedPeople }).save()
          : null;
      }
    })
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updateScore = ({ bodymen: { body }, params, user }, res, next) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updateLocations = (
  { bodymen: { body }, params, user },
  res,
  next
) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => {
      const shouldAddLocation =
        user.locations &&
        user.locations.find(
          (elm) =>
            elm.latitude === body.locations.latitude &&
            elm.longitude === body.locations.longitude
        ) === undefined;

      if (shouldAddLocation) {
        let newLocations = user.locations;
        newLocations.push(body.locations);
        return user
          ? Object.assign(user, { locations: newLocations }).save()
          : null;
      }
    })
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updateProfil = (
  { bodymen: { body }, params, user },
  res,
  next
) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updateDefaultLocation = ({ bodymen: { body }, params, user }, res, next) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updateDefaultConfinementDistance = ({ bodymen: { body }, params, user }, res, next) => {
  return User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);
};

export const updatePassword = (
  { bodymen: { body }, params, user },
  res,
  next
) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: "password",
          message: "You can't change other user's password",
        });
        return null;
      }
      return result;
    })
    .then((user) =>
      user ? user.set({ password: body.password }).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next);
