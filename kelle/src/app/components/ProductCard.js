import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white rounded-[10px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      {/* Image Area */}
      <div className="h-42 bg-gray-200 overflow-hidden">
        {product.image_url && !imageError ? (
          <img 
            src={product.image_url}
            alt={`${product.title} ${product.model_year}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">No image available</p>
          </div>
        )}
      </div>
     
      {/* Info Rectangle */}
      <div className="pl-4 pr-2 pt-2 pb-2 bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-0">
          {product.title} ({product.model_year})
        </h3>
        <p className="text-xl font-semibold text-gray-900">
          €{product.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}