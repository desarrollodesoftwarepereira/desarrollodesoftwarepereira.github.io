import { PRODUCTS } from '../Constant';
import { Category, ShoppingCartItem } from '../interfaces/ProductInterface';
import CategoryCard from './CategoryCard';

type ProductsByCategoryProps = {
  productQuantities: Array<ShoppingCartItem>;
  setProductQuantities: React.Dispatch<
    React.SetStateAction<Array<ShoppingCartItem>>
  >;
};

const ProductsByCategory: React.FC<ProductsByCategoryProps> = ({
  productQuantities,
  setProductQuantities,
}) => {
  return (
    <div className="flex flex-col gap-2 xs:gap-4">
      {PRODUCTS.map((category: Category, index) => (
        <CategoryCard
          key={`${index}-${category.name}`}
          category={category}
          productQuantities={productQuantities}
          setProductQuantities={setProductQuantities}
        />
      ))}
    </div>
  );
};

export default ProductsByCategory;
