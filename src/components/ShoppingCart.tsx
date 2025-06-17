import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import {
  Product,
  ShoppingCartItem,
  StoredCart,
} from '../interfaces/ProductInterface';
import { FaTrash } from 'react-icons/fa6';
import {
  CART_EXPIRATION_HOURS,
  CART_STORAGE_KEY,
  PRODUCTS,
  PROFILE,
} from '../Constant';

type ShoppingCartProps = {
  productQuantities: Array<{ product: Product; quantity: number }>;
  setProductQuantities?: React.Dispatch<
    React.SetStateAction<Array<{ product: Product; quantity: number }>>
  >;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  productQuantities,
  setProductQuantities,
}) => {
  const isInitialMount = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveCartToStorage = (
    cart: Array<{ product: Product; quantity: number }>
  ) => {
    const cartData: StoredCart = {
      items: cart.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
      })),
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  };

  const getCartFromStorage = () => {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;

    const { items, timestamp }: StoredCart = JSON.parse(cartData);
    const hours = (new Date().getTime() - timestamp) / (1000 * 60 * 60);

    if (hours > CART_EXPIRATION_HOURS) {
      //localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    return items
      .map(({ name, quantity }) => {
        const product = PRODUCTS.reduce<Product | undefined>(
          (found, category) => {
            if (found) return found;
            return category.products.find((p) => p.name === name);
          },
          undefined
        );

        return product ? { product, quantity } : null;
      })
      .filter((item): item is ShoppingCartItem => item !== null);
  };

  const goToWhatsapp = () => {
    const message = productQuantities
      .map(
        (item) =>
          `${item.product.name} - ${item.quantity} x $${
            item.product.price * item.quantity
          }`
      )
      .join(', ');
    const total = productQuantities.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const whatsappUrl = `https://wa.me/${PROFILE.socialLinks.whatsappNumber}?text=${encodeURIComponent(
      `Hola, deseo comprar: ${message}, Total: $${total}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (productQuantities.length > 0) {
      saveCartToStorage(productQuantities);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [productQuantities]);

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

  useEffect(() => {
    const savedCart = getCartFromStorage();
    if (savedCart && setProductQuantities) {
      setProductQuantities(savedCart);
    }
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={openModal}
          className="relative p-3 text-white rounded-full bg-shopping-cart-bg"
        >
          <FaShoppingCart className="text-2xl" />
          <span className="absolute px-2 text-xs bg-red-600 rounded-full -right-1 -top-1">
            {productQuantities.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </span>
        </button>
      </div>
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative w-full max-w-md max-h-screen p-4 overflow-y-auto rounded-lg shadow-lg bg-product-bg text-product-text"
          >
            <h2 className="mb-4 text-xl font-bold">Carrito de compras</h2>
            <ul className="space-y-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productQuantities.length > 0 ? (
                    productQuantities.map(({ product, quantity }, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{quantity}</td>
                        <td>${product.price * quantity}</td>
                        <td>
                          <button
                            onClick={() => {
                              if (setProductQuantities) {
                                setProductQuantities((prev) =>
                                  prev.filter(
                                    (item) => item.product.name !== product.name
                                  )
                                );
                              }
                            }}
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        El carrito de compras esta vacio.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ul>
            {productQuantities.length > 0 && (
              <div className="flex flex-col mt-2">
                <div className="flex items-center justify-between mt-2">
                  <p className="font-semibold">
                    Precio total: $
                    <span className="text-lg">
                      {productQuantities.reduce(
                        (total, item) =>
                          total + item.product.price * item.quantity,
                        0
                      )}
                    </span>
                  </p>
                  <button
                    className="px-2 py-1 ml-auto text-sm text-red-500 border border-red-500 rounded-lg hover:scale-105"
                    onClick={() => {
                      if (setProductQuantities) {
                        setProductQuantities([]);
                      }
                    }}
                  >
                    Vaciar carrito
                  </button>
                </div>
                <button
                  onClick={goToWhatsapp}
                  className="w-full px-4 py-2 mt-4 text-white transition-transform duration-300 bg-green-500 rounded-lg hover:scale-105"
                >
                  Comprar via WhatsApp
                </button>
              </div>
            )}
            <span
              onClick={closeModal}
              className="absolute z-10 p-1 right-2 top-3"
            >
              <FaTimes className="text-2xl" />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
