const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    res.render('edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
       return res.status(422).render('edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
                category: category
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
          });
    }
    const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, category: category, userId: req.user, createdBy: req.user.name});
    await product.save()
      .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  console.log(prodId + "getting edit product");
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  })
  .catch(err => { 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
  })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => { 
        console.log('Destroyed Product');
        res.redirect('/admin/products')
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

    exports.postEditProduct = (req, res, next) => {
        const prodId = req.body.productId;
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedImageUrl = req.body.imageUrl;
        const updatedDesc = req.body.description;
        const updatedCat = req.body.category;
        const errors = validationResult(req);
    
        if(!errors.isEmpty()){
           return res.status(422).render('edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                hasError: true,
                product: {
                    title: updatedTitle,
                    price: updatedPrice,
                    imageUrl: updatedImageUrl,
                    description: updatedDesc,
                    category: updatedCat,
                    _id: prodId
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
              });
        }

        Product.findById(prodId).then(product => {
            if (product.userId.toString() !== req.user._id.toString()){ 
                return res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl; 
            product.category = updatedCat;
            return product.save().then(result => {
                console.log(result);
                console.log('Product Updated');
                res.redirect('/admin/products');
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  //.select('title price -_id') this is to select only certain variables from an product object | same for user populate .populate('UserId', 'name') - that will recieve just the users name - if you put  .populate('UserId', 'name', 'email') - you have to include it in your ejs
  .populate('userId')
  .then(products => {
    res.render('admin-products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })       
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
});
};
