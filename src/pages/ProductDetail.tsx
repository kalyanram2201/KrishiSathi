import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart, ChevronsRight, Info, FileText, MessageSquare } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const relatedProducts = product ? getRelatedProducts(product.category, product.id) : [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/marketplace" className="text-green-600 hover:underline mt-4 inline-block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    }, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-24">
              <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-full bg-gray-100 rounded-md overflow-hidden transition-all duration-200 ${
                      selectedImage === index ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description.split('\n')[0]}</p>

            <div className="mb-6">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <span className="ml-3 text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="ml-3 bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {product.discount}% OFF
                </span>
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-100 rounded-l-lg"><Minus className="h-4 w-4" /></button>
                <span className="px-6 py-2 text-lg font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-gray-100 rounded-r-lg"><Plus className="h-4 w-4" /></button>
              </div>
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={!product.inStock} className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center text-lg">
                <ChevronsRight className="mr-2 h-5 w-5" />
                Buy Now
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-t border-gray-200 pt-8">
                <div className="flex border-b border-gray-200 mb-6">
                    <button onClick={() => setActiveTab('description')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'description' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}><Info className="mr-2 h-4 w-4"/>Description</button>
                    <button onClick={() => setActiveTab('specs')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'specs' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}><FileText className="mr-2 h-4 w-4"/>Specifications</button>
                    <button onClick={() => setActiveTab('reviews')} className={`flex items-center px-6 py-3 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}><MessageSquare className="mr-2 h-4 w-4"/>Reviews</button>
                </div>
                <div className="prose max-w-none text-gray-600">
                    {activeTab === 'description' && <p>{product.description}</p>}
                    {activeTab === 'specs' && (
                        <ul className="space-y-2">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <li key={key}><strong>{key}:</strong> {value}</li>
                            ))}
                        </ul>
                    )}
                    {activeTab === 'reviews' && <p>Reviews are coming soon!</p>}
                </div>
            </div>

          </motion.div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(related => (
                    <Link to={`/product/${related.id}`} key={related.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
                        <div className="aspect-square w-full bg-gray-100 overflow-hidden">
                            <img src={related.images[0]} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 truncate">{related.name}</h3>
                            <p className="text-green-600 font-bold">₹{related.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
