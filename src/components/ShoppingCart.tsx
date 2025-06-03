import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { Product } from '../interfaces/ProductInterface';
import { FaTrash } from 'react-icons/fa6';
import { PROFILE } from '../Constant';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            className="relative w-full max-w-md p-4 rounded-lg shadow-lg bg-product-bg text-product-text"
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
              <div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Precio total: $
                    {productQuantities.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    )}
                  </h3>
                </div>
                <button
                  onClick={goToWhatsapp}
                  className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
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
