import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync ('1234', 8),
      isAdmin: true,
      isSeller: true,
      seller: {
        name: 'Puma',
        logo: '/images/logo1.png',
        description: 'best seller',
        rating: 4.5,
        numReviews: 120,
      },
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync ('1234', 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Nike Slim Shirt',
      category: 'Shirts1',
      image: '/images/p1.jpg',
      price: 120,
      serviceId:1,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      location : {
        "type" : "Point",
        "coordinates" : [
            23.033677,
            72.463412
        ]
    },
    },
    {
      name: 'Adidas Fit Shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 100,
      serviceId: 2,
      countInStock: 20,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality product',
      location: {
        "type": "Point",
        "coordinates": [
            23.033677,
            72.463412
        ]
    },
    },
    {
      name: 'Lacoste Free Shirt',
      category: 'Shirts',
      image: '/images/p3.jpg',
      price: 220,
      serviceId: 3,
      countInStock: 0,
      brand: 'Lacoste',
      rating: 4.8,
      numReviews: 17,
      description: 'high quality product',
      location: {
        "type": "Point",
        "coordinates": [
            23.033677,
            72.463412
        ]
    },
    },
    {
      name: 'Nike Slim Pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 78,
      serviceId: 4,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality product',
      location: {
        "type": "Point",
        "coordinates": [
            23.033677,
            72.463412
        ]
    },
    },
    {
      name: 'Puma Slim Pant',
      category: 'Pants',
      image: '/images/p5.jpg',
      price: 65,
      serviceId: 1,
      countInStock: 5,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      location: {
        "type": "Point",
        "coordinates": [
            23.033677,
            72.463412
        ]
    },
    },
    {
      name: 'Adidas Fit Pant',
      category: 'Pants',
      image: '/images/p6.jpg',
      price: 139,
      serviceId: 1,
      countInStock: 12,
      brand: 'Adidas',
      rating: 4.5,
      numReviews: 15,
      description: 'high quality product',
      location: {
        "type": "Point",
        "coordinates": [
            23.033677,
            72.463412
        ]
    },
    },
  ],
};
export default data;
