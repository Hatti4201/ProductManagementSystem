const Product = require('../models/Product');

// everyone can visit 所有人都可以访问
exports.getAllProducts = async (req, res) => {
  const { search = '', skip = 0, limit = 10 } = req.query;

  const filter = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.json({ products, total });
};


exports.getProductById = async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({message: 'Product not found'});
    res.json(product);
};


//only admin 仅限管理员
exports.createProduct = async(req, res) => {
    const { name, description, price, category, stock, imagUrl } = req.body;

    const product = new Product({ name, description, price, category, stock, imagUrl });
    await product.save();

    res.status(201).json(product);
};

exports.updateProduct = async(req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
    
    if(!product) return res.status(404).json({ message:'Product not found' });
    res.json(product);
};

exports.deleteProduct = async(req, res) => {
    const product = await Product.findByIdAndDelete( req.params.id);
    if(!product) return res.status(404).json({ message:'Product not found' });
    res.json({ message: 'Deleted successfully!' });
};