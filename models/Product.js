import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: String,
  price: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: String,
  thumbnails: [String]
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;
