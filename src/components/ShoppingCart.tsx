import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import {
  Product,
  ShoppingCartItem,
  StoredCart,
} from '../interfaces/ProductInterface';
import { FaTrash, FaWhatsapp } from 'react-icons/fa6';
import {
  CART_EXPIRATION_HOURS,
  CART_STORAGE_KEY,
  PRODUCTS,
  PROFILE,
} from '../Constant';

type ShoppingCartProps = {
  productQuantities: Array<ShoppingCartItem>;
  setProductQuantities: React.Dispatch<
    React.SetStateAction<Array<ShoppingCartItem>>
  >;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  productQuantities,
  setProductQuantities,
}) => {
  const isInitialMount = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setShowContent(true), 10);
  };

  const closeModal = () => {
    setShowContent(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const saveCartToStorage = (cart: Array<ShoppingCartItem>) => {
    const cartData: StoredCart = {
      items: cart.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
      })),
      timestamp: new Date().getTime(),
    };
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  };

  const getCartFromStorage = () => {
    const cartData = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;

    const { items, timestamp }: StoredCart = JSON.parse(cartData);
    const hours = (new Date().getTime() - timestamp) / (1000 * 60 * 60);

    if (hours > CART_EXPIRATION_HOURS) {
      sessionStorage.removeItem(CART_STORAGE_KEY);
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
    if (productQuantities.length === 0) {
      window.open(
        `https://wa.me/${PROFILE.socialLinks.whatsappNumber}`,
        '_blank'
      );
      return;
    }
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
      sessionStorage.removeItem(CART_STORAGE_KEY);
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

  const totalQuantity = productQuantities.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    if (!isInitialMount.current) {
      setAnimateCount(true);
      const timeout = setTimeout(() => setAnimateCount(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [totalQuantity]);

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
          className="relative p-3 text-white rounded-full bg-shopping-cart-bg hover:scale-115 transition-transform cursor-pointer"
        >
          <FaShoppingCart className="text-3xl md:text-4xl" />
          <div
            className={`
              absolute bg-red-600 rounded-full -right-1 -top-1
              w-6 h-6
              transition-transform
              ${animateCount ? 'scale-125' : 'scale-100'}
            `}
          >
            <div className="relative w-full h-full">
              <span className="text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {totalQuantity}
              </span>
            </div>
          </div>
        </button>
      </div>
      {isModalOpen && (
        <div
          onClick={closeModal}
          className={`
            fixed inset-0 z-50 flex
            bg-black/50 transition-opacity duration-300
            ${showContent ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`
              my-auto mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl
              max-h-11/12 overflow-y-auto overflow-x-auto rounded-lg shadow-lg bg-product-bg text-product-text
              transition-all duration-300
              ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <div className="relative min-w-[270px] p-4 h-full">
              <h2 className="mb-4 text-xl font-bold">Carrito de compras</h2>
              <ul className="space-y-4">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="pr-2">Cantidad</th>
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
                              className="hover:scale-115 transition-transform cursor-pointer"
                              onClick={() => {
                                if (setProductQuantities) {
                                  setProductQuantities((prev) =>
                                    prev.filter(
                                      (item) =>
                                        item.product.name !== product.name
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
              {productQuantities.length === 0 && (
                <button
                  onClick={goToWhatsapp}
                  className="w-full px-4 py-2 mt-4 text-white transition-transform bg-green-500 rounded-lg hover:scale-105 lg:hover:scale-102 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-center">
                    <span>Escríbenos por WhatsApp</span>
                    <FaWhatsapp className="text-2xl ml-2" />
                  </div>
                </button>
              )}
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
                      className="px-2 py-1 ml-auto text-sm text-red-500 border border-red-500 rounded-lg hover:scale-105 transition-transform cursor-pointer"
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
                    className="w-full px-4 py-2 mt-4 text-white transition-transform bg-green-500 rounded-lg hover:scale-105 cursor-pointer lg:hover:scale-102"
                  >
                    <div className="flex flex-wrap items-center justify-center">
                      <span>Finalizar compra por WhatsApp</span>
                      <FaWhatsapp className="text-2xl ml-2" />
                    </div>
                  </button>
                </div>
              )}
              <span
                onClick={closeModal}
                className="absolute z-10 p-1 right-2 top-3 hover:scale-115 transition-transform cursor-pointer"
              >
                <FaTimes className="text-2xl" />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
