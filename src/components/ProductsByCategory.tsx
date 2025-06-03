import { PRODUCTS } from '../Constant';
import { Category, Product } from '../interfaces/ProductInterface';
import CategoryCard from './CategoryCard';

type ProductsByCategoryProps = {
  productQuantities: Array<{ product: Product; quantity: number }>;
  setProductQuantities?: React.Dispatch<
    React.SetStateAction<Array<{ product: Product; quantity: number }>>
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
