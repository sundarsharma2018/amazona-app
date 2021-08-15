import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import admin from '../firebase-config.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';
// const admin = require('./firebaseconfig');
const userRouter = express.Router();


const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email});
     if(user.firebaseToken == req.body.firebaseToken){
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(user),
            firebaseToken: user.firebaseToken,
            status:"success",
          });
          return;
        }
      }
      res.send({status:"fail", message: 'Invalid email or password' });
    }else{
      if (user) {
        user.firebaseToken = req.body.firebaseToken;
        const updatedUser = await user.save();
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(updatedUser),
          firebaseToken: user.firebaseToken,
          status:"success"
        }); 
      }
    }

  })
);


// userRouter.post(
//   '/signin',
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       if (bcrypt.compareSync(req.body.password, user.password)) {
//         res.send({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           isAdmin: user.isAdmin,
//           isSeller: user.isSeller,
//           token: generateToken(user),
//           firebaseToken: user.firebaseToken,
//           status:"success",
//         });
//         return;
//       }
//     }
//     res.status(401).send({status:"fail", message: 'Invalid email or password' });
//   })
// );

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      firebaseToken: req.body.firebaseToken,
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(createdUser),
      firebaseToken: user.firebaseToken,
      status:"success",
    });
  })
);


// userRouter.post(
//   '/register',
//   expressAsyncHandler(async (req, res) => {
//     const us console.log(user.firebaseToken);er = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 8),
//       firebaseToken: req.body.firebaseToken,
//     });
//     const createdUser = await user.save();
//     res.send({
//       _id: createdUser._id,
//       name: createdUser.name,
//       email: createdUser.email,
//       isAdmin: createdUser.isAdmin,
//       isSeller: user.isSeller,
//       token: generateToken(createdUser),
//       status:"success",
//     });
//   })
// );

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);


userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);




userRouter.post('/firebase/notification', (req, res)=>{
  const  registrationToken = req.body.registrationToken
 //const message = "req.body.message"
  // const payload = {
  //   notification: {
  //     title: 'Notification Title',
  //     body: 'This is an example notification',
  //   },
  // };


  const payload = {
    data: {
      title: req.body.title,
      body: req.body.body,
    },
  };
  const options =  notification_options
    admin.messaging().sendToDevice(registrationToken, payload, options)
    .then( response => {
     // res.send("Notification sent successfully");
     res.send({status:"success", message:"Notification sent successfully"})
    })
    .catch( error => {
        console.log(error);
    });

})

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

export default userRouter;
