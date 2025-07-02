import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6';
import {
  Category,
  Product,
  ShoppingCartItem,
} from '../interfaces/ProductInterface';
import ProductCard from './ProductCard';

type CategoryCardProps = {
  category: Category;
  productQuantities: Array<ShoppingCartItem>;
  setProductQuantities: React.Dispatch<
    React.SetStateAction<Array<ShoppingCartItem>>
  >;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productQuantities,
  setProductQuantities,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [maxHeight, setMaxHeight] = useState<number>(1000);
  const [height, setHeight] = useState<string>('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = useCallback(() => {
    if (contentRef.current && contentRef.current.scrollHeight !== maxHeight) {
      setMaxHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef, maxHeight]);

  useLayoutEffect(() => {
    handleResize();
    if (isOpen) {
      setHeight(`${maxHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isOpen, category.products.length, handleResize, maxHeight]);

  useEffect(() => {
    // If the time on load the imgs is long, update max height on load page, after 1s and 10s
    setTimeout(handleResize, 100);
    setTimeout(handleResize, 1000);
    setTimeout(handleResize, 10000);
    // On resize window update max height
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <div className="rounded-lg bg-category-bg text-category-text">
      <button
        onClick={toggleAccordion}
        className="flex justify-between w-full p-2 xs:p-4"
      >
        <h2 className="text-lg font-semibold">{category.name}</h2>
        {isOpen ? (
          <FaAngleUp className="text-2xl" />
        ) : (
          <FaAngleDown className="text-2xl" />
        )}
      </button>
      <div
        ref={contentRef}
        className={`
            transition-all duration-300 overflow-hidden
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
        style={{
          maxHeight: height,
          transitionProperty: 'max-height, opacity',
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-2 xs:mx-4 mb-2 xs:mb-4">
          {category.products.map((product: Product, index) => (
            <ProductCard
              key={`${index}-${product.name}`}
              product={product}
              productQuantities={productQuantities}
              setProductQuantities={setProductQuantities}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
