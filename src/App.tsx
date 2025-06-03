import Profile from './components/Profile';
import ProductsByCategory from './components/ProductsByCategory';
import ShoppingCart from './components/ShoppingCart';
import { useState } from 'react';
import { Product } from './interfaces/ProductInterface';

const App: React.FC = () => {
  const [productQuantities, setProductQuantities] = useState<
    { product: Product; quantity: number }[]
  >([]);
  return (
    <div className="flex items-center justify-center w-full h-full p-2 xs:p-4 sm:p-8">
      <div className="container flex flex-col gap-4 p-2 shadow-lg xs:gap-6 sm:gap-8 xs:p-4 sm:p-8 bg-app-bg rounded-2xl">
        <Profile />
        <ProductsByCategory
          productQuantities={productQuantities}
          setProductQuantities={setProductQuantities}
        />
        <ShoppingCart
          productQuantities={productQuantities}
          setProductQuantities={setProductQuantities}
        />
      </div>
    </div>
  );
};

export default App;
