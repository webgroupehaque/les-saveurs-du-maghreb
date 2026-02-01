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
    weekdays: '11h30 - 14h00 et 18h30 - 23h00',
    detail: 'Ouvert 7j/7'
  },
  services: ['Sur place', 'À emporter', 'Livraison'],
  specialties: ['Couscous Royal', 'Tajines traditionnels', 'Grillades maison']
};

export const CONTACT_INFO: ContactInfo = {
  phone: "03 83 32 10 30",
  email: "lessaveursdumaghreb16@gmail.com",
  address: "21 Rue des Maréchaux, 54000 Nancy",
  openingHours: [
    "Lundi - Dimanche: 11h30 - 14h00 et 18h30 - 23h00"
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
    id: 'beignet-calamar',
    name: 'Beignets de Calamars',
    description: 'Calamars frits avec sauce',
    price: 8.90,
    category: 'Entrées',
    image: "/images/menu/beignet-calamar.png"
  },
  {
    id: 'beignet-oignon',
    name: "Beignets d'Oignons",
    description: 'Rondelles d\'oignons frites',
    price: 6.90,
    category: 'Entrées',
    image: "/images/menu/beignet-oignon.png"
  },
  {
    id: 'beignet-poulet',
    name: 'Beignet de Poulet',
    description: 'Poulet frit avec sauce',
    price: 8.90,
    category: 'Entrées',
    image: "/images/menu/beignet-poulet.png"
  },
  {
    id: 'beignet-pomme-terre',
    name: 'Beignet de Pommes de Terre',
    description: 'Rondelles de pommes de terre frites',
    price: 6.90,
    category: 'Entrées',
    image: "/images/menu/beignet-pomme-terre.png"
  },
  {
    id: 'beignet-aubergine',
    name: 'Beignet d\'Aubergine',
    description: 'Rondelles d\'aubergine frites',
    price: 6.90,
    category: 'Entrées',
    image: "/images/menu/beignet-aubergine.png"
  },
  {
    id: 'beignet-poisson',
    name: 'Beignet de Poisson',
    description: 'Poisson frit avec sauce',
    price: 10.90,
    category: 'Entrées',
    image: "/images/menu/beignet-poisson.png"
  },
  {
    id: 'nem-poulet',
    name: 'Nems Poulet',
    description: 'Nems farcis au poulet',
    price: 9.90,
    category: 'Entrées',
    image: "/images/menu/nem-poulet.png"
  },
  {
    id: 'nem-boeuf',
    name: 'Nems Bœuf',
    description: 'Nems farcis au bœuf',
    price: 9.90,
    category: 'Entrées',
    image: "/images/menu/nem-boeuf.png"
  },
  {
    id: 'nem-crevettes',
    name: 'Nems Crevettes',
    description: 'Nems farcis aux crevettes',
    price: 10.90,
    category: 'Entrées',
    image: "/images/menu/nem-crevettes.png"
  },
  {
    id: 'nem-vegetarien',
    name: 'Nems aux Légumes',
    description: 'Nems farcis aux légumes',
    price: 8.90,
    category: 'Entrées',
    image: "/images/menu/nem-vegetarien.png"
  },
  {
    id: 'samoussa-viande',
    name: 'Samoussa Viande',
    description: 'Samoussa farcis à la viande',
    price: 6.90,
    category: 'Entrées',
    image: "/images/menu/samoussa-viande.png"
  },
  {
    id: 'samoussa-vegetarien',
    name: 'Samoussa aux Légumes',
    description: 'Samoussa farcis aux légumes',
    price: 6.90,
    category: 'Entrées',
    image: "/images/menu/samoussa-vegetarien.png"
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
    id: 'nan-nature',
    name: 'Nan Nature',
    description: 'Pain nan nature',
    price: 3.50,
    category: 'Accompagnements',
    image: "/images/menu/nan-nature.png"
  },
  {
    id: 'nan-fromage',
    name: 'Nan Fromage',
    description: 'Pain nan au fromage',
    price: 3.50,
    category: 'Accompagnements',
    image: "/images/menu/nan-fromage.png"
  },
  {
    id: 'nan-ail',
    name: 'Nan Ail',
    description: 'Pain nan à l\'ail',
    price: 4.50,
    category: 'Accompagnements',
    image: "/images/menu/nan-ail.png"
  },

  // DESSERTS
  {
    id: 'glace-2-boules',
    name: 'Glace 2 Boules',
    description: 'Vanille, Chocolat, Café, Fraise, Citron',
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
        { id: 'citron', name: 'Citron', category: 'glaces' }
      ]
    }
  },
  {
    id: 'sorbet-3-boules',
    name: 'Sorbet 3 Boules',
    description: 'Fraise, Citron, Mangue, Ananas',
    price: 7.90,
    category: 'Desserts',
    image: "/images/menu/sorbet-3-boules.png",
    options: {
      isComposed: true,
      requiredSelections: 3,
      availableChoices: [
        { id: 'fraise', name: 'Fraise', category: 'sorbets' },
        { id: 'citron', name: 'Citron', category: 'sorbets' },
        { id: 'mangue', name: 'Mangue', category: 'sorbets' },
        { id: 'ananas', name: 'Ananas', category: 'sorbets' }
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
    description: '50cl',
    price: 3.90,
    category: 'Boissons',
    image: "/images/menu/eau.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'vittel', name: 'Vittel', category: 'eau' },
        { id: 'san-pellegrino', name: 'San Pellegrino', category: 'eau' }
      ]
    }
  },
  {
    id: 'soda',
    name: 'Soda',
    description: '33cl',
    price: 3.90,
    category: 'Boissons',
    image: "/images/menu/soda.png",
    options: {
      isComposed: true,
      requiredSelections: 1,
      availableChoices: [
        { id: 'coca-zero', name: 'Coca Zero', category: 'sodas' },
        { id: 'coca', name: 'Coca', category: 'sodas' },
        { id: 'lipton', name: 'Lipton', category: 'sodas' },
        { id: 'orangina', name: 'Orangina', category: 'sodas' },
        { id: 'fanta', name: 'Fanta', category: 'sodas' }
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