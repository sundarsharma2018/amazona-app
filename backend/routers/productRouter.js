import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
const productRouter = express.Router();
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const products = await Product.find({ ...sellerFilter }).populate(
      'seller',
      'seller.name seller.logo'
    );


    //res.send(products);
    console.log("Products"+products);

    if(products.length != 0){
      res.send({status:"success",product:products});

    }else{
      res.send({status:"fail",message:"Not product"});

    }
  })
);

//find near by store by lat long and meters

// productRouter.get (
//   '/:lat/:lng/',
//   expressAsyncHandler (async (req, res) => {
//     console.log (req.params.lat + '' + req.params.lng);
//     const seller = req.query.seller || '';
//     const sellerFilter = seller ? {seller} : {};
//     const products = await Product.find ({
//       ...sellerFilter,
//       location: {
//         $near: {
//           $maxDistance: 1000,
//           $geometry: {
//             type: 'Point',
//             coordinates: [req.params.lat, req.params.lng],
//           },
//         },
//       },
//    
//     }).populate ('seller', 'seller.name seller.logo');
//     if (products.length != 0) {
//       res.send ({status:'success',product:products});
//     } else {
//       res.status (404).send ({status:'fail',message: 'Product Not Found'});
//     }
//   })
// );


productRouter.get(
  '/:lat/:lng/:serviceId',
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.lat + '' + req.params.lng + ":" + req.params.serviceId);
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const products = await Product.find({
      ...sellerFilter,
      location: {
        $near: {
          $maxDistance: 10000,
          $geometry: {
            type: "Point",
            coordinates: [req.params.lat, req.params.lng],
          },
        },
      },
      serviceId: req.params.serviceId
    }).populate('seller', 'seller.name seller.logo');
    if (products.length != 0) {
      res.send({ status: 'success', product: products });
    } else {
      res.send({ status: 'fail', message: 'Product Not Found' });
    }
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product1 = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    console.log(product1.seller._id);
   
      res.send(product1);
   
    // if (product1) {
    //   res.send({status: "success", product:product1});
    // } else {
    //   res.send({ status: "fail", message: 'Product Not Found' });
    // }
  })
);


// productRouter.post (
//   '/',
//   isAuth,
//   isSellerOrAdmin,
//   expressAsyncHandler (async (req, res) => {
//     const product = new Product ({
//       name: 'sample name ' + Date.now (),
//       seller: req.user._id,
//       image: '/images/p1.jpg',
//       price: 0,
//       category: 'sample category',
//       brand: 'sample brand',
//       countInStock: 0,
//       rating: 0,
//       numReviews: 0,
//       description: 'sample description'
//     });
//     const createdProduct = await product.save ();
//     res.send ({message: 'Product Created', product: createdProduct});
//   })
// );

productRouter.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name ' + Date.now(),
      seller: req.user._id,
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
      serviceId: 1,
      location: {
        type: "Point",
        coordinates: [28.4051, 77.6326]
      },
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.serviceId = req.body.serviceId;
      product.location = {
         "type": req.body.type,
         "coordinates": [req.body.lat,req.body.lng]
      }
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
