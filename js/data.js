/* Netflix World — contenu (projet conceptuel : informations et prix fictifs) */
window.NW = {
  universes: [
    { slug: 'stranger', name: 'Stranger Things', place: "Hawkins & le Monde à l'envers", img: 'stranger', alt: 'stranger-door', accent: '#e50914',
      desc: "Le laboratoire d'Hawkins a ouvert un passage. Derrière la façade envahie de lianes, une forêt inquiétante mène tout droit au Monde à l'envers." },
    { slug: 'witcher', name: 'The Witcher', place: 'Le Continent', img: 'witcher', alt: 'witcher-fire', accent: '#ff6a1a',
      desc: "Une forteresse en flammes, des monstres tapis dans le brouillard et des montagnes russes qui traversent un royaume de magie noire." },
    { slug: 'squid', name: 'Squid Game', place: 'Les Jeux', img: 'squid', alt: 'squid-doll', accent: '#ff2e88',
      desc: "Rond, triangle, carré : entrez dans l'arène et affrontez les épreuves les plus célèbres de la série, sans élimination réelle !" },
    { slug: 'lupin', name: 'Lupin', place: 'Le Musée', img: 'lupin', alt: 'lupin', accent: '#d4a64a',
      desc: "Un diamant légendaire, un musée sous haute surveillance et une seule nuit pour réussir le casse du siècle, comme Assane Diop." },
    { slug: 'outerbanks', name: 'Outer Banks', place: 'Les Outer Banks', img: 'outerbanks', alt: 'outerbanks', accent: '#ff8a3d',
      desc: "Soleil couchant, planches de surf et rouleaux gigantesques : prenez la vague des Pogues grâce à la réalité virtuelle." },
    { slug: 'onepiece', name: 'One Piece', place: 'Grand Line', img: 'onepiece', alt: 'onepiece-splash', accent: '#1aa6e8',
      desc: "Hissez le drapeau de l'équipage au chapeau de paille et partez à la recherche du trésor de Luffy, cascades comprises." },
    { slug: 'bridgerton', name: 'La Chronique des Bridgerton', place: 'Londres & jardins royaux', img: 'bridgerton', alt: 'labyrinthe', accent: '#b78cff',
      desc: "Bals, scandales et carrosses : la haute société londonienne vous ouvre ses salons, ses rues pavées et ses jardins à la française." }
  ],

  attractions: [
    { slug: 'stranger-things', universe: 'stranger', name: 'Stranger Things', sub: 'La maison hantée', type: 'Maison hantée', cat: 'sensations', img: 'stranger',
      x: 175, y: 160, rank: 1, height: 0, age: 'Dès 10 ans', duration: '12 min', thrill: 4,
      desc: "Traversez le laboratoire d'Hawkins, une forêt inquiétante puis le Monde à l'envers.",
      long: "Une maison hantée en trois actes : les couloirs du laboratoire d'Hawkins, une forêt plongée dans la brume, puis le Monde à l'envers. Projections à 360°, créatures robotisées et effets spéciaux vous attendent à chaque pas.",
      features: ['Projections à 360°', 'Créatures robotisées', 'Effets spéciaux'] },
    { slug: 'the-witcher', universe: 'witcher', name: 'The Witcher', sub: 'Les montagnes russes', type: 'Montagnes russes', cat: 'sensations', img: 'witcher',
      x: 545, y: 170, rank: 2, height: 130, age: 'Dès 1,30 m', duration: '2 min 30', thrill: 5,
      desc: "Plongez dans un royaume fantastique rempli de monstres et de magie.",
      long: "Des montagnes russes qui s'enroulent autour d'une forteresse assiégée par une créature colossale. Jets de feu, nappes de brouillard et jeux de lumière accompagnent chaque looping.",
      features: ['Effets de feu', 'Brouillard', 'Effets lumineux'] },
    { slug: 'one-piece', universe: 'onepiece', name: 'One Piece', sub: 'La chasse au trésor de Luffy', type: 'Montagnes russes aquatiques', cat: 'aquatique', img: 'onepiece',
      x: 385, y: 440, rank: 3, height: 110, age: 'Dès 1,10 m', duration: '4 min', thrill: 4,
      desc: "Des montagnes russes aquatiques qui se terminent par une grande descente.",
      long: "À bord d'un bateau de l'équipage au chapeau de paille, suivez la carte du trésor de Luffy à travers la Grand Line. Le final : une immense descente aquatique. Vous serez mouillés !",
      features: ['Montagnes russes aquatiques', 'Grande descente finale', 'Vous serez mouillés'] },
    { slug: 'squid-game-soleil', universe: 'squid', name: 'Squid Game', sub: '1, 2, 3 Soleil', type: 'Épreuve interactive', cat: 'famille', img: 'squid-doll',
      x: 1390, y: 175, rank: 4, height: 0, age: 'Tous âges', duration: '8 min', thrill: 2,
      desc: "Avancez quand la poupée a le dos tourné : des capteurs détectent le moindre mouvement.",
      long: "La célèbre épreuve du 1, 2, 3 Soleil, version Netflix World. Des capteurs détectent vos mouvements et déclenchent effets sonores et lumineux si vous bougez au mauvais moment.",
      features: ['Capteurs de mouvement', 'Effets sonores', 'Effets lumineux'] },
    { slug: 'squid-game-pont', universe: 'squid', name: 'Squid Game', sub: 'Le pont de verre', type: 'Épreuve à sensations', cat: 'sensations', img: 'squid',
      x: 1530, y: 285, rank: 5, height: 120, age: 'Dès 1,20 m', duration: '6 min', thrill: 3,
      desc: "Choisissez la bonne plaque… ou voyez-la se fissurer et exploser sous vos pieds.",
      long: "Quand un visiteur pose le pied sur une mauvaise plaque, elle s'illumine, affiche des fissures numériques et déclenche un effet de verre qui explose. Le pont bouge légèrement pour plus de sensations.",
      features: ['Plaques lumineuses', 'Fissures numériques', 'Pont mobile'] },
    { slug: 'lupin', universe: 'lupin', name: 'Lupin', sub: 'Le casse du musée', type: 'Escape game', cat: 'famille', img: 'lupin',
      x: 1170, y: 260, rank: 6, height: 0, age: 'Dès 8 ans', duration: '20 min', thrill: 2,
      desc: "Incarnez des voleurs et récupérez le diamant avant la fin du temps imparti.",
      long: "Les visiteurs incarnent des voleurs qui doivent récupérer un diamant dans un musée fictif : lasers à éviter, codes secrets à déchiffrer et compte à rebours pour s'échapper.",
      features: ['Lasers à éviter', 'Codes secrets', 'Temps limité'] },
    { slug: 'bridgerton', universe: 'bridgerton', name: 'La Chronique des Bridgerton', sub: 'La fuite en calèche', type: 'Réalité virtuelle & sensations', cat: 'sensations', img: 'bridgerton',
      x: 470, y: 600, rank: 7, height: 120, age: 'Dès 1,20 m', duration: '7 min', thrill: 4,
      desc: "Le bal tourne au scandale : fuyez les gardes de la reine en calèche.",
      long: "Le bal tourne au scandale : Lady Whistledown révèle un secret et les gardes de la reine se lancent à votre poursuite. Fuite en calèche à travers les jardins royaux et les rues londoniennes, avec une descente vertigineuse, jusqu'à rentrer chez vous avant que la reine ne vous retrouve.",
      features: ['Réalité virtuelle', 'Calèche mobile', 'Descente vertigineuse'] },
    { slug: 'outer-banks', universe: 'outerbanks', name: 'Outer Banks', sub: 'Surf en réalité virtuelle', type: 'Réalité virtuelle', cat: 'aquatique', img: 'outerbanks',
      x: 960, y: 225, rank: 8, height: 120, age: 'Dès 10 ans', duration: '6 min', thrill: 3,
      desc: "Debout sur une planche, surfez les vagues des Outer Banks en réalité virtuelle.",
      long: "Un simulateur de surf en réalité virtuelle : debout sur une planche mobile, vous prenez les rouleaux des Outer Banks au coucher du soleil.",
      features: ['Réalité virtuelle', 'Planche mobile', 'Coucher de soleil'] },
    { slug: 'labyrinthe', universe: 'bridgerton', name: 'Les Jardins Bridgerton', sub: 'Le labyrinthe végétal', type: 'Promenade', cat: 'famille', img: 'labyrinthe',
      x: 655, y: 545, rank: 9, height: 0, age: 'Tous âges', duration: 'Libre', thrill: 1,
      desc: "Un grand jardin végétal et son labyrinthe, pour se promener entre deux attractions.",
      long: "Un grand jardin à la française et son labyrinthe de buis, à côté de l'attraction Bridgerton. Idéal pour une pause, avant un passage au restaurant des jardins.",
      features: ['Labyrinthe', 'Kiosque', 'Restaurant à côté'] }
  ],

  restaurants: [
    { id: 'hawkins', name: 'Hawkins Diner', kind: 'Fast-food · burgers', img: 'restaurant', x: 190, y: 315, universe: 'stranger', desc: "Le diner des années 80 : burgers, frites, milkshakes et néons." },
    { id: 'tavern', name: 'The Witcher Tavern', kind: 'Restaurant médiéval', img: 'witcher-fire', x: 745, y: 238, universe: 'witcher', desc: "Grillades, viandes rôties et ambiance de taverne médiévale." },
    { id: 'island', name: 'One Piece Island', kind: 'Poisson · pizza · glaces', img: 'onepiece-splash', x: 625, y: 425, universe: 'onepiece', desc: "Poisson, pizzas, boissons fraîches et glaces au bord de la lagune." },
    { id: 'cercle', name: 'Le Cercle Secret', kind: 'Cuisine asiatique', img: 'squid-doll', x: 1265, y: 390, universe: 'squid', desc: "Un restaurant élégant à l'ambiance mystérieuse, autour de la cuisine asiatique." },
    { id: 'jardins', name: 'Le Restaurant des Jardins', kind: 'Cuisine française · pâtisseries', img: 'garden-castle', x: 850, y: 540, universe: 'bridgerton', desc: "Restaurant chic à côté du labyrinthe : plats français, pâtisseries et desserts." }
  ],

  hotelFloors: [
    { n: 1, name: 'Le monde des mystères et de l’aventure', mix: 'Stranger Things × One Piece', imgs: ['stranger', 'onepiece'] },
    { n: 2, name: 'Le monde des palais', mix: 'Bridgerton × The Witcher', imgs: ['bridgerton', 'witcher'] },
    { n: 3, name: 'Le monde des défis', mix: 'Squid Game × Lupin', imgs: ['squid', 'lupin'] },
    { n: 4, name: 'La salle de cinéma', mix: 'Films et séries Netflix', imgs: ['hotel-tall'] }
  ],

  soon: [
    { id: 'racing', name: 'Zone Racing', when: 'Bientôt', img: 'speedway', x: 850, y: 70, r: 70, desc: "Une zone dédiée à la vitesse dans la grande prairie nord : montagnes russes à lancement et simulateurs." },
    { id: 'kids', name: 'Kids Zone', when: 'Ouverture 2027', img: 'kids', x: 1115, y: 495, r: 80, desc: "Manèges, montgolfières et aires de jeux pour les plus petits, à côté de la Boutique." },
    { id: 'extension', name: 'Nouvel univers', when: 'Projet 2028', img: 'manor', x: 300, y: 800, r: 110, desc: "Un nouvel univers est en préparation dans la forêt sud-ouest. Son thème sera révélé prochainement." }
  ],

  pois: [
    { id: 'entree', cat: 'service', name: 'Entrée & accueil', x: 850, y: 760, desc: "Portique NW, contrôle des billets, plans, location de poussettes." },
    { id: 'show', cat: 'show', name: 'Le Grand Spectacle du Soir', x: 850, y: 425, img: 'aerial', desc: "Spectacle son et lumière sur la place centrale, chaque soir à la fermeture." },
    { id: 'boutique', cat: 'shop', name: 'La Boutique Netflix World', x: 1205, y: 690, img: 'boutique', desc: "Tous les produits dérivés des univers du parc." },
    { id: 'hotel', cat: 'hotel', name: 'Hôtel Netflix', x: 1430, y: 520, img: 'hotel', desc: "4 étages thématiques, atrium doré et rouge, écrans géants." },
    { id: 'secours', cat: 'service', name: 'Premiers secours', x: 1010, y: 690, desc: "Poste médical ouvert pendant toute la journée." },
    { id: 'wc1', cat: 'service', name: 'Toilettes', x: 610, y: 300, desc: "Toilettes et table à langer." },
    { id: 'wc2', cat: 'service', name: 'Toilettes', x: 1060, y: 420, desc: "Toilettes et table à langer." },
    { id: 'consignes', cat: 'service', name: 'Consignes', x: 740, y: 700, desc: "Consignes automatiques, 2 € la journée." }
  ],

  offers: [
    { id: '1jour', name: 'Billet 1 jour', img: 'arch', price: 59, child: 52, unit: '/ adulte', badge: 'Le plus choisi', perks: ['Toutes les attractions', 'Spectacle du soir inclus', 'Date modifiable'] },
    { id: '2jours', name: 'Billet 2 jours', img: 'aerial', price: 99, child: 88, unit: '/ adulte', badge: '-16 %', perks: ['2 jours consécutifs', 'Spectacle deux soirs', 'Jusqu’à -16 %'] },
    { id: 'famille', name: 'Pass Famille', img: 'playground', price: 199, child: 0, unit: '/ 4 personnes', badge: 'Famille', perks: ['2 adultes + 2 enfants', 'Photo souvenir', 'Accès prioritaire Kids Zone (2027)'] },
    { id: 'special', name: 'Soirée Monde à l’envers', img: 'stranger-door', price: 39, child: 35, unit: '/ personne', badge: 'Halloween', perks: ['Entrée dès 17 h', 'Stranger Things dans le noir', 'Du 3 oct. au 2 nov.'] },
    { id: 'sejour', name: 'Séjour Hôtel Netflix', img: 'hotel', price: 189, child: 119, unit: '/ pers. / nuit', badge: 'Séjour', perks: ['Hôtel + 2 jours de parc', 'Petit-déjeuner', 'Accès anticipé'] }
  ],

  faq: [
    ["Faut-il réserver ses billets à l'avance ?", "C'est conseillé : les billets datés en ligne garantissent l'entrée les jours d'affluence (week-ends, vacances scolaires, Halloween)."],
    ['Les enfants paient-ils ?', "L'entrée est gratuite pour les moins de 3 ans. Le tarif enfant s'applique de 3 à 11 ans inclus."],
    ['Les attractions en réalité virtuelle sont-elles accessibles à tous ?', "Outer Banks et Bridgerton sont accessibles dès 1,20 m. Les casques sont désinfectés entre chaque passage ; ils sont déconseillés aux personnes sujettes au mal des transports."],
    ['Stranger Things fait-il vraiment peur ?', "Oui : la maison hantée est déconseillée aux moins de 10 ans. Une sortie de secours est accessible à tout moment."],
    ['Le parc est-il accessible aux personnes à mobilité réduite ?', "Oui. Toutes les allées sont accessibles et un pass d'accès facilité est délivré à l'accueil."],
    ['Où ranger mes affaires pendant les attractions ?', "Des consignes automatiques se trouvent près de l'entrée (2 € la journée). Prévoyez une tenue de rechange pour One Piece !"]
  ]
};
