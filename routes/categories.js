var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let categoryModel = require('../schemas/category')
let productModel = require('../schemas/product');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  

  let categories = await categoryModel.find({});

  res.status(200).send({
    success:true,
    data:categories
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

/* GET category by slug and all products in that category */
router.get('/slug/:category', async function(req, res, next) {
  try {
    const categorySlug = req.params.category;
    
    // Find the category by slug
    const category = await categoryModel.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    // Find all products in this category
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

router.post('/', async function(req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
    })
    await newCategory.save();
    res.status(200).send({
      success:true,
      data:newCategory
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

/* PUT update category */
router.put('/:id', async function(req, res, next) {
  try {
    const updateData = {};
    
    if (req.body.name) {
      updateData.name = req.body.name;
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    res.status(200).send({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
