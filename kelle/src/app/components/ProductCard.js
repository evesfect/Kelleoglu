import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  
  const handleCardClick = () => {
    router.push(`/sales_listing/${product.id}`);
  };

  // 
  // the main image or first image
  const getMainImage = () => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    // Debug logging
    console.log('Product:', product.title);
    console.log('Images:', product.images);
    console.log('Images with is_main true:', product.images.filter(img => img.is_main));
    
    // Find the main image
    const mainImage = product.images.find(img => img.is_main);
    if (mainImage) {
      return mainImage.image_url;
    }
    
    // If no main image, use the first one
    return product.images[0].image_url;
  };

  const mainImageUrl = getMainImage();
  
  return (
    <div 
      className="bg-white rounded-[10px] shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Area */}
      <div className="h-42 bg-gray-200 overflow-hidden relative">
        {mainImageUrl && !imageError ? (
          <img 
            src={mainImageUrl}
            alt={`${product.title} ${product.model_year}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">No image available</p>
          </div>
        )}
        
        {/* Image count indicator */}
        {product.images && product.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {product.images.length} photos
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