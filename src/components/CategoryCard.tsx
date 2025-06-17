import { useState } from 'react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6';
import { Category, Product } from '../interfaces/ProductInterface';
import ProductCard from './ProductCard';

type CategoryCardProps = {
  category: Category;
  productQuantities: Array<{ product: Product; quantity: number }>;
  setProductQuantities: (
    productQuantities: {
      product: Product;
      quantity: number;
    }[]
  ) => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productQuantities,
  setProductQuantities,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-2 rounded-lg xs:p-4 bg-category-bg text-category-text">
      <button onClick={toggleAccordion} className="flex justify-between w-full">
        <h2 className="text-lg font-semibold">{category.name}</h2>
        {isOpen ? (
          <FaAngleUp className="text-2xl" />
        ) : (
          <FaAngleDown className="text-2xl" />
        )}
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 gap-4 mt-2 xs:mt-4 sm:grid-cols-2">
          {category.products.map((product: Product, index) => (
            <ProductCard
              key={`${index}-${product.name}`}
              product={product}
              productQuantities={productQuantities}
              setProductQuantities={setProductQuantities}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
