import { Category } from "./interfaces/ProductInterface";
import { Profile } from "./interfaces/ProfileInterface";

export const DEFAULT_URL = 'http://localhost:5173';

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
    name: 'AREPAS',
    products: [
      {
        name: 'Arepas',
        description: 'Arepas recién hechas, perfectas para acompañar cualquier comida.',
        price: 2000,
        imageUrl: './assets/images/arepa-chocolo.webp',
      },
      {
        name: 'Tortas',
        description: 'Tortas caseras, ideales para celebraciones y ocasiones especiales.',
        price: 15000,
      },
      {
        name: 'Empanadas',
        description: 'Empanadas crujientes y sabrosas, rellenas de carne, pollo o queso.',
        price: 3000,
      }
    ]
  },
  {
    name: 'DESGRANADO',
    products: [
      {
        name: 'Maíz tierno desgranado',
        description: 'Maíz tierno desgranado fresco y delicioso, ideal para tus recetas.',
        price: 5000,
      }
    ]
  }
];