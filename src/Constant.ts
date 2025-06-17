import { Category } from "./interfaces/ProductInterface";
import { Profile } from "./interfaces/ProfileInterface";

export const DEFAULT_URL = 'http://localhost:5173';
export const CART_STORAGE_KEY = 'shopping-cart';
export const CART_EXPIRATION_HOURS = 24;

export const PROFILE: Profile = {
  name: 'CHOCOLO Y MÁS',
  description: 'Venta de maiz tierno desgranado, arepas, tortas, empanadas y más',
  socialLinks: {
    email: 'chocoloymas@gmail.com',
    phone: '(+57) 314 6182506',
    whatsappNumber: '573146182506',
    websiteUrl: 'https://chocoloymas.github.io/',
    facebook: 'https://www.facebook.com/chocoloymas',
    instagram: 'https://www.instagram.com/chocoloymas',
  },
};

export const PRODUCTS: Category[] = [
  {
    name: 'RICAMAS',
    products: [
      {
        name: 'Arepas de chocolo',
        description: 'Arepas RICAMAS de chocolo recién hechas, perfectas para acompañar cualquier comida. Paquete 300g x 5 unidades.',
        price: 5800,
        imageUrl: './assets/images/arepa-chocolo.webp',
      },
      {
        name: 'Arepas de pandebono',
        description: 'Arepas RICAMAS de pandebono queso y mantequilla, ideal para acompañar tus desayunos o para las comidas que prefieras. Paquete 350g x 5 unidades.',
        price: 4700,
        imageUrl: './assets/images/arepa-pandebono.webp',
      },
      {
        name: 'Arepas rellenas de queso',
        description: 'Arepas RICAMAS rellenas de queso, de sabor inigualable, ideales para acompañar tus comidas. Paquete 350g x 5 unidades.',
        price: 6500,
        imageUrl: './assets/images/arepa-queso.webp',
      },
      {
        name: 'Palitos de queso',
        description: 'Palitos RICAMAS de maiz rellenos de queso, sabrosos y perfectos para acompañar tus comidas o como snack. Paquete 450g x 8 unidades.',
        price: 6000,
        imageUrl: './assets/images/palitos-queso.webp',
      },
      {
        name: 'Mazamorra',
        description: 'Mazamorra RICAMAS, una deliciosa mezcla de maíz tierno con leche, ideal para disfrutar como postre o desayuno. Paquete 1000g.',
        price: 5500,
        imageUrl: './assets/images/mazamorra.webp',
      },
      {
        name: 'Mezcla de mazorca tierna',
        description: 'Mezcla de mazorca tierna RICAMAS, perfecta para preparar deliciosas tortas. Paquete 1000g.',
        price: 4600,
        imageUrl: './assets/images/mezcla-mazorca-tierna.webp',
      },
    ]
  },
  {
    name: 'Maiz | Chocolo',
    products: [
      {
        name: 'Maíz tierno desgranado',
        description: 'Maíz tierno desgranado fresco y delicioso, ideal para tus recetas.',
        price: 5500,
        unit: 'kg',
        imageUrl: './assets/images/maiz-desgranado.webp',
      },
      {
        name: 'Masa de maíz tierno',
        description: 'Masa de maíz tierno fresco y delicioso, ideal para tus preparaciones, lista para utilizar.',
        price: 6000,
        unit: 'kg',
        imageUrl: './assets/images/masa-maiz.webp',
      },
      {
        name: 'Mazorca tierna',
        description: 'Mazorca tierna fresca, ideal para asar o cocinar, con un sabor inigualable.',
        price: 3000,
        unit: 'kg',
        imageUrl: './assets/images/mazorca.webp',
      }
    ]
  }
];