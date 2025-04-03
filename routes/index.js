var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let categoryModel = require('../schemas/category');
let productModel = require('../schemas/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/slug/:category', async function(req, res, next) {
  try {
    const categorySlug = req.params.category;
    

    const category = await categoryModel.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    

    const products = await productModel.find({ 
      category: category._id,
      isDeleted: false
    });
    
    res.status(200).send({
      success: true,
      data: {
        category,
        products
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.get('/slug/:category/:product', async function(req, res, next) {
  try {
    const categorySlug = req.params.category;
    const productSlug = req.params.product;
    

    const category = await categoryModel.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    

    const product = await productModel.findOne({
      slug: productSlug,
      category: category._id,
      isDeleted: false
    }).populate("category");
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;