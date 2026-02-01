import { MenuItem, ContactInfo } from './types';

export const APP_NAME = "Les Saveurs du Maghreb";

export const RESTAURANT_INFO = {
  name: 'Les Saveurs du Maghreb',
  type: 'Restaurant Maghrébin',
  slogan: 'Savourez l\'authenticité du Maghreb',
  description: 'Découvrez les saveurs authentiques du Maghreb dans une ambiance chaleureuse. Nos couscous et tajines sont préparés selon les recettes traditionnelles, avec des ingrédients frais et des épices sélectionnées.',
  address: {
    street: '21 Rue des Maréchaux',
    city: 'Nancy',
    zipCode: '54000',
    full: '21 Rue des Maréchaux, 54000 Nancy'
  },
  contact: {
    phone: '03 83 32 10 30',
    email: 'lessaveursdumaghreb16@gmail.com'
  },
  hours: {
    weekdays: '12:00-14:15 et 19:00-23:00',
    detail: 'Horaires variables selon les jours'
  },
  services: ['Sur place', 'À emporter', 'Livraison'],
  specialties: ['Couscous Royal', 'Tajines traditionnels', 'Grillades maison']
};

export const CONTACT_INFO: ContactInfo = {
  phone: "03 83 32 10 30",
  email: "lessaveursdumaghreb16@gmail.com",
  address: "21 Rue des Maréchaux, 54000 Nancy",
  openingHours: [
    "Lundi: 12:00-14:15, 19:00-23:00",
    "Mardi: 12:00-14:15, 19:00-21:00",
    "Mercredi: 12:00-14:15, 19:00-23:00",
    "Jeudi: 12:00-14:15, 19:00-23:00",
    "Vendredi: 12:00-14:15, 19:00-23:00",
    "Samedi: 12:00-15:00, 19:00-23:00",
    "Dimanche: 12:00-15:00, 19:00-23:00"
  ]
};

export const MENU_CATEGORIES = [
  'Couscous',
  'Tajines',
  'Grillades',
  'Entrées',
  'Salades',
  'Accompagnements',
  'Desserts',
  'Boissons'
];

export const MENU_ITEMS: MenuItem[] = [
  // COUSCOUS
  {
    id: 'couscous-royal',
    name: 'Couscous Royal',
    description: 'Bœuf, Merguez, Agneau, Poulet avec légumes et sauce maison',
    price: 27.90,
    category: 'Couscous',
    image: "/images/menu/couscous-royal.png"
  },
  {
    id: 'couscous-boeuf',
    name: 'Couscous Bœuf',
    description: 'Bœuf mariné avec légumes et sauce maison',
    price: 19.90,
    category: 'Couscous',
    image: "/images/menu/couscous-boeuf.png"
  },
  {
    id: 'couscous-agneau',
    name: "Couscous d'Agneau",
    description: 'Morceau d\'agneau mariné avec légumes et sauce maison',
    price: 20.90,
    category: 'Couscous',
    image: "/images/menu/couscous-agneau.png"
  },
  {
    id: 'couscous-poulet',
    name: 'Couscous Poulet',
    description: 'Cuisse de poulet marinée avec légumes et sauce maison',
    price: 16.90,
    category: 'Couscous',
    image: "/images/menu/couscous-poulet.png"
  },
  {
    id: 'couscous-merguez',
    name: 'Couscous Merguez',
    description: 'Merguez avec légumes et sauce maison',
    price: 18.90,
    category: 'Couscous',
    image: "/images/menu/couscous-merguez.png"
  },
  {
    id: 'couscous-vegetarien',
    name: 'Couscous aux Légumes',
    description: 'Assortiment de légumes et sauce maison',
    price: 14.90,
    category: 'Couscous',
    image: "/images/menu/couscous-vegetarien.png"
  },

  // TAJINES
  {
    id: 'tajine-royal',
    name: 'Tajine Royal',
    description: 'Bœuf, Merguez, Agneau, Poulet avec légumes',
    price: 30.90,
    category: 'Tajines',
    image: "/images/menu/tajine-royal.png"
  },
  {
    id: 'tajine-boeuf',
    name: 'Tajine Bœuf',
    description: 'Bœuf ou viande hachée marinée avec légumes',
    price: 20.90,
    category: 'Tajines',
    image: "/images/menu/tajine-boeuf.png"
  },
  {
    id: 'tajine-agneau',
    name: "Tajine d'Agneau",
    description: 'Agneau avec assortiment de légumes',
    price: 21.90,
    category: 'Tajines',
    image: "/images/menu/tajine-agneau.png"
  },
  {
    id: 'tajine-poulet',
    name: 'Tajine Poulet',
    description: 'Cuisse de poulet avec légumes',
    price: 17.90,
    category: 'Tajines',
    image: "/images/menu/tajine-poulet.png"
  },
  {
    id: 'tajine-merguez',
    name: 'Tajine Merguez',
    description: 'Merguez avec légumes',
    price: 19.90,
    category: 'Tajines',
    image: "/images/menu/tajine-merguez.png"
  },
  {
    id: 'tajine-vegetarien',
    name: 'Tajine aux Légumes',
    description: 'Assortiment de légumes',
    price: 15.90,
    category: 'Tajines',
    image: "/images/menu/tajine-vegetarien.png"
  },

  // GRILLADES
  {
    id: 'poulet-tandoori',
    name: 'Poulet Tandoori',
    description: 'Poulet mariné et grillé',
    price: 9.90,
    category: 'Grillades',
    image: "/images/menu/poulet-tandoori.png"
  },
  {
    id: 'poulet-tikka',
    name: 'Poulet Tikka',
    description: 'Morceaux de poulet marinés et grillés',
    price: 10.90,
    category: 'Grillades',
    image: "/images/menu/poulet-tikka.png"
  },
  {
    id: 'sheek-kebab',
    name: 'Sheek Kebab',
    description: 'Brochettes de viande hachée',
    price: 10.90,
    category: 'Grillades',
    image: "/images/menu/sheek-kebab.png",
  },
  {
    id: 'merguez-epicees',
    name: 'Merguez',
    description: 'Merguez marinées aux épices maison',
    price: 10.90,
    category: 'Grillades',
    image: "/images/menu/merguez-epicees.png",
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: 'Ailes de poulet marinées et grillées',
    price: 8.90,
    category: 'Grillades',
    image: "/images/menu/chicken-wings.png"
  },
  {
    id: 'assortiment-grillades',
    name: 'Assortiment de Grillades',
    description: '4 viandes grillées',
    price: 19.90,
    category: 'Grillades',
    image: "/images/menu/assortiment-grillades.png"
  },

  // ENTRÉES
  {
    id: 'beignets',
    name: 'Beignets',
    description: 'Beignets frits avec sauce. Parfums disponibles : Calamars, Oignons, Poulet, Pommes de terre, Aubergine, Poisson',
    price: 0, // Prix sera calculé selon le choix
    category: 'Entrées',
    image: "/images/menu/beignet-calamar.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'calamar', name: 'Calamars', category: 'beignets', price: 8.90 },
        { id: 'oignon', name: 'Oignons', category: 'beignets', price: 6.90 },
        { id: 'poulet', name: 'Poulet', category: 'beignets', price: 8.90 },
        { id: 'pomme-terre', name: 'Pommes de terre', category: 'beignets', price: 6.90 },
        { id: 'aubergine', name: 'Aubergine', category: 'beignets', price: 6.90 },
        { id: 'poisson', name: 'Poisson', category: 'beignets', price: 10.90 }
      ]
    }
  },
  {
    id: 'nems',
    name: 'Nems',
    description: 'Nems croustillants. Parfums disponibles : Poulet, Bœuf, Crevettes, Légumes',
    price: 0, // Prix sera calculé selon le choix
    category: 'Entrées',
    image: "/images/menu/nem-poulet.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'poulet', name: 'Poulet', category: 'nems', price: 9.90 },
        { id: 'boeuf', name: 'Bœuf', category: 'nems', price: 9.90 },
        { id: 'crevettes', name: 'Crevettes', category: 'nems', price: 10.90 },
        { id: 'legumes', name: 'Légumes', category: 'nems', price: 8.90 }
      ]
    }
  },
  {
    id: 'samoussas',
    name: 'Samoussas',
    description: 'Samoussas croustillants. Parfums disponibles : Viande, Légumes',
    price: 0, // Prix sera calculé selon le choix
    category: 'Entrées',
    image: "/images/menu/samoussa-viande.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'viande', name: 'Viande', category: 'samoussas', price: 6.90 },
        { id: 'legumes', name: 'Légumes', category: 'samoussas', price: 6.90 }
      ]
    }
  },
  {
    id: 'nuggets',
    name: 'Nuggets de Poulet',
    description: 'Nuggets de poulet croustillants',
    price: 8.90,
    category: 'Entrées',
    image: "/images/menu/nuggets.png"
  },

  // SALADES
  {
    id: 'salade-vegetarienne',
    name: 'Salade aux Légumes',
    description: 'Salade, tomates, concombre, carottes, pommes de terre',
    price: 8.90,
    category: 'Salades',
    image: "/images/menu/salade-vegetarienne.png"
  },
  {
    id: 'salade-poulet',
    name: 'Salade Poulet',
    description: 'Salade, tomates, concombre, carottes, poulet',
    price: 10.90,
    category: 'Salades',
    image: "/images/menu/salade-poulet.png"
  },
  {
    id: 'salade-crevettes',
    name: 'Salade Crevettes',
    description: 'Salade, tomates, concombre, carottes, crevettes',
    price: 11.90,
    category: 'Salades',
    image: "/images/menu/salade-crevettes.png"
  },

  // ACCOMPAGNEMENTS
  {
    id: 'frites',
    name: 'Frites Traditionnelles',
    description: 'Frites maison croustillantes',
    price: 5.90,
    category: 'Accompagnements',
    image: "/images/menu/frites.png"
  },
  {
    id: 'naans',
    name: 'Naans',
    description: 'Pain naan traditionnel. Parfums disponibles : Nature, Fromage, Ail, Ail avec fromage, Gingembre, Ail avec gingembre, Amande, Raisin, Sucré noix de coco',
    price: 0, // Prix sera calculé selon le choix
    category: 'Accompagnements',
    image: "/images/menu/nan-nature.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'nature', name: 'Nature', category: 'naans', price: 3.00 },
        { id: 'fromage', name: 'Fromage', category: 'naans', price: 3.50 },
        { id: 'ail', name: 'Ail', category: 'naans', price: 4.50 },
        { id: 'ail-fromage', name: 'Ail avec fromage', category: 'naans', price: 5.00 },
        { id: 'gingembre', name: 'Gingembre', category: 'naans', price: 5.00 },
        { id: 'ail-gingembre', name: 'Ail avec gingembre', category: 'naans', price: 5.00 },
        { id: 'amande', name: 'Amande', category: 'naans', price: 5.00 },
        { id: 'raisin', name: 'Raisin', category: 'naans', price: 5.00 },
        { id: 'coco', name: 'Sucré noix de coco', category: 'naans', price: 5.00 }
      ]
    }
  },

  // DESSERTS
  {
    id: 'glace-2-boules',
    name: 'Glace 2 Boules',
    description: 'Vanille, Chocolat, Café, Fraise, Citron, Pistache, Caramel, Menthe',
    price: 6.90,
    category: 'Desserts',
    image: "/images/menu/glace-2-boules.png",
    options: {
      isComposed: true,
      requiredSelections: 2,
      availableChoices: [
        { id: 'vanille', name: 'Vanille', category: 'glaces' },
        { id: 'chocolat', name: 'Chocolat', category: 'glaces' },
        { id: 'cafe', name: 'Café', category: 'glaces' },
        { id: 'fraise', name: 'Fraise', category: 'glaces' },
        { id: 'citron', name: 'Citron', category: 'glaces' },
        { id: 'pistache', name: 'Pistache', category: 'glaces' },
        { id: 'caramel', name: 'Caramel', category: 'glaces' },
        { id: 'menthe', name: 'Menthe', category: 'glaces' }
      ]
    }
  },
  {
    id: 'sorbet-2-boules',
    name: 'Sorbet 2 Boules',
    description: 'Fraise, Citron, Mangue, Ananas, Framboise, Pêche',
    price: 6.90,
    category: 'Desserts',
    image: "/images/menu/sorbet-3-boules.png",
    options: {
      isComposed: true,
      requiredSelections: 2,
      availableChoices: [
        { id: 'fraise', name: 'Fraise', category: 'sorbets' },
        { id: 'citron', name: 'Citron', category: 'sorbets' },
        { id: 'mangue', name: 'Mangue', category: 'sorbets' },
        { id: 'ananas', name: 'Ananas', category: 'sorbets' },
        { id: 'framboise', name: 'Framboise', category: 'sorbets' },
        { id: 'peche', name: 'Pêche', category: 'sorbets' }
      ]
    }
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Tiramisu maison',
    price: 8.90,
    category: 'Desserts',
    image: "/images/menu/tiramisu.png"
  },
  {
    id: 'baklawa',
    name: 'Baklawa',
    description: 'Pâtisserie orientale au miel',
    price: 8.90,
    category: 'Desserts',
    image: "/images/menu/baklawa.png"
  },
  {
    id: 'patisserie-orientale',
    name: 'Pâtisserie Orientale',
    description: 'Assortiment de pâtisseries',
    price: 8.90,
    category: 'Desserts',
    image: "/images/menu/patisserie-orientale.png"
  },
  {
    id: 'salade-fruits',
    name: 'Salade de Fruits',
    description: 'Fruits frais de saison',
    price: 7.90,
    category: 'Desserts',
    image: "/images/menu/salade-fruits.png"
  },

  // BOISSONS
  {
    id: 'eau',
    name: 'Eau Minérale',
    description: '50cl. Choix : Vittel, San Pellegrino',
    price: 0, // Prix sera calculé selon le choix
    category: 'Boissons',
    image: "/images/menu/eau.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'vittel', name: 'Vittel', category: 'eau', price: 3.90 },
        { id: 'san-pellegrino', name: 'San Pellegrino', category: 'eau', price: 3.90 }
      ]
    }
  },
  {
    id: 'soda',
    name: 'Soda',
    description: '33cl. Choix : Coca Zero, Coca, Lipton, Orangina, Fanta',
    price: 0, // Prix sera calculé selon le choix
    category: 'Boissons',
    image: "/images/menu/soda.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'coca-zero', name: 'Coca Zero', category: 'sodas', price: 3.90 },
        { id: 'coca', name: 'Coca', category: 'sodas', price: 3.90 },
        { id: 'lipton', name: 'Lipton', category: 'sodas', price: 3.90 },
        { id: 'orangina', name: 'Orangina', category: 'sodas', price: 3.90 },
        { id: 'fanta', name: 'Fanta', category: 'sodas', price: 3.90 }
      ]
    }
  },
  {
    id: 'the-menthe',
    name: 'Thé à la Menthe',
    description: 'Thé à la menthe traditionnel',
    price: 3.50,
    category: 'Boissons',
    image: "/images/menu/the-menthe.png"
  },
  {
    id: 'the-glace',
    name: 'Thé Glacé Maison',
    description: 'Thé glacé fait maison',
    price: 6.00,
    category: 'Boissons',
    image: "/images/menu/the-glace.png"
  }
];