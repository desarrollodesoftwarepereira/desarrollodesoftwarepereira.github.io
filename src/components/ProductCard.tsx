import { useEffect, useState } from 'react';
import { Product, ShoppingCartItem } from '../interfaces/ProductInterface';
import { FaTimes } from 'react-icons/fa';

type ProductCardProps = {
  product: Product;
  productQuantities: Array<ShoppingCartItem>;
  setProductQuantities: React.Dispatch<
    React.SetStateAction<Array<ShoppingCartItem>>
  >;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productQuantities,
  setProductQuantities,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const quantity =
    productQuantities.find((item) => item.product.name === product.name)
      ?.quantity || 0;

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setShowContent(true), 10);
  };

  const closeModal = () => {
    setShowContent(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const minusQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (setProductQuantities) {
      setProductQuantities((prev) => {
        const existingProduct = prev.find(
          (item) => item.product.name === product.name
        );
        if (existingProduct && existingProduct.quantity > 1) {
          return prev.map((item) =>
            item.product.name === product.name
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        } else {
          return prev.filter((item) => item.product.name !== product.name);
        }
      });
    }
    e.stopPropagation();
  };

  const plusQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (setProductQuantities) {
      setProductQuantities((prev) => {
        const existingProduct = prev.find(
          (item) => item.product.name === product.name
        );
        if (existingProduct) {
          return prev.map((item) =>
            item.product.name === product.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { product, quantity: 1 }];
        }
      });
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  return (
    <>
      <div
        onClick={openModal}
        className="flex flex-col items-center p-4 rounded-lg cursor-pointer bg-product-bg text-product-text"
      >
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-32 mb-2 rounded-lg xs:h-42"
          />
        )}
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-sm">{product.description}</p>
        <p className="mb-2 font-semibold">
          ${product.price}
          {product.unit ? (
            <span className="text-xs"> x {product.unit}</span>
          ) : null}
        </p>
        <div className="flex items-end flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={minusQuantity}
              className="w-9 h-9 relative bg-red-500 rounded-full cursor-pointer hover:scale-115 active:scale-105 transition-transform"
            >
              <span className="text-white font-bold text-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                -
              </span>
            </button>
            <span className="flex justify-center w-5">{quantity}</span>
            <button
              onClick={plusQuantity}
              className="w-9 h-9 relative bg-green-500 rounded-full cursor-pointer hover:scale-115 active:scale-105 transition-transform"
            >
              <span className="text-white font-bold text-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                +
              </span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className={`
            fixed top-0 left-0 flex items-center justify-center w-full h-full
            bg-black/50 transition-opacity duration-300
            ${showContent ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from closing
            }}
            className={`relative flex flex-col items-center max-w-md max-h-screen p-4 overflow-y-auto rounded-lg bg-product-bg text-product-text
              transition-all duration-300
              ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-auto mb-2 rounded-lg"
              />
            )}
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p className="mb-2 font-semibold">
              ${product.price}
              {product.unit ? (
                <span className="text-xs"> x {product.unit}</span>
              ) : null}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={minusQuantity}
                className="w-9 h-9 relative bg-red-500 rounded-full cursor-pointer hover:scale-115 active:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  -
                </span>
              </button>
              <span className="flex justify-center w-5">{quantity}</span>
              <button
                onClick={plusQuantity}
                className="w-9 h-9 relative bg-green-500 rounded-full cursor-pointer hover:scale-115 active:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  +
                </span>
              </button>
            </div>
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 z-10 p-1"
            >
              <FaTimes className="text-2xl hover:scale-115 transition-transform cursor-pointer" />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
