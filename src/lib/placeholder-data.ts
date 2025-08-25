
import type { SVGProps } from 'react';

export const learningTracks = [
  {
    title: 'Les Fondamentaux du Slam',
    description: 'Apprenez les bases du rythme, de la rime et de la performance.',
    duration: '4 semaines',
    level: 'Débutant',
    content: `
      <h4>Semaine 1 : L'écriture</h4>
      <p>Trouver sa voix, choisir un thème, structurer son texte.</p>
      <h4>Semaine 2 : Le Rythme</h4>
      <p>Jouer avec les sonorités, les pauses et le débit.</p>
      <h4>Semaine 3 : La Voix</h4>
      <p>Apprendre à projeter sa voix, travailler l'articulation.</p>
       <h4>Semaine 4 : La Scène</h4>
      <p>Gérer le trac, occuper l'espace, interagir avec le public.</p>
    `
  },
  {
    title: 'Maîtriser le Storytelling en Rap',
    description: 'Transformez vos expériences en récits captivants.',
    duration: '6 semaines',
    level: 'Intermédiaire',
    content: `
      <p>Ce cours vous apprendra à construire une narration forte dans vos morceaux de rap, en créant des personnages, des arcs narratifs et des images puissantes.</p>
    `
  },
  {
    title: 'Figures de Style Avancées',
    description: 'Explorez métaphores, allitérations et assonances pour enrichir vos textes.',
    duration: '3 semaines',
    level: 'Avancé',
    content: `
      <p>Plongez au coeur de la langue française pour donner plus de relief et de profondeur à vos écrits. Un voyage au pays des mots pour les amoureux de la technique.</p>
    `
  },
  {
    title: 'Défi Quotidien : Le Mot du Jour',
    description: 'Un nouveau mot chaque jour pour inspirer un court poème ou une punchline.',
    duration: 'Quotidien',
    level: 'Tous niveaux',
    content: `
      <p>Chaque jour, un nouveau défi. L'exercice parfait pour entretenir sa créativité, expérimenter sans pression et enrichir son vocabulaire.</p>
    `
  },
];

export const communityPosts = [
  {
    id: 1,
    author: 'Lyric_Leo',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 2 heures',
    text: "Premier jet d'un texte sur le temps qui passe. Qu'en pensez-vous ?\n\n'Les horloges se moquent de nos prières,\ngoutte à goutte, le sablier s'égrène.\nHier n'est qu'un souvenir dans la bruine,\ndemain, une promesse qu'on dessine.'",
    likes: 12,
    commentsCount: 4,
    comments: [
        { author: 'Slam_Sofia', text: "J'adore la dernière phrase, très poétique !" },
        { author: 'Rap_Ryad', text: "Puissant. La métaphore du sablier est bien trouvée." },
        { author: 'MuseUrbaine', text: "Très inspirant, ça donne envie d'écrire sur ce thème." },
        { author: 'PlumeDeNuit', text: "Le rythme est excellent. Continue comme ça." }
    ]
  },
  {
    id: 2,
    author: 'Slam_Sofia',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 5 heures',
    text: "Besoin de feedback sur ce passage, je trouve que le rythme n'est pas encore parfait.\n\n'La ville respire le béton, une jungle de verre et d'acier / Où les rêves se perdent dans le bruit des klaxons pressés.'",
    likes: 25,
    commentsCount: 3,
    comments: [
        { author: 'Lyric_Leo', text: "Le rythme est bon, peut-être juste marquer une pause après 'béton' ?" },
        { author: 'Rap_Ryad', text: "L'image de la jungle de verre est forte. J'aime beaucoup." },
        { author: 'PoeteAnonyme', text: "Essaye de lire la deuxième phrase plus lentement pour voir." }
    ]
  },
  {
    id: 3,
    author: 'Rap_Ryad',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 1 jour',
    text: 'Cherche un(e) artiste pour une collaboration sur un morceau. Thème : la résilience. Envoyez-moi vos textes !',
    likes: 8,
    commentsCount: 3,
    comments: [
      { author: 'PoeteAnonyme', text: "Super initiative, je t'envoie un MP." },
      { author: 'Slam_Sofia', text: "Très intéressée ! Je prépare quelque chose." },
      { author: 'Lyric_Leo', text: "Bonne idée, le thème est super." }
    ]
  },
   {
    id: 4,
    author: 'MuseUrbaine',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 2 jours',
    text: "Je sèche sur un thème... des idées ? J'ai envie d'écrire sur quelque chose de puissant, de viscéral.",
    likes: 15,
    commentsCount: 4,
    comments: [
        { author: 'Lyric_Leo', text: "La nostalgie de l'enfance ?" },
        { author: 'Slam_Sofia', text: "La colère face à l'injustice, ça marche toujours." },
        { author: 'Rap_Ryad', text: "L'ambition dévorante." },
        { author: 'PlumeDeNuit', text: "Le sentiment d'être un imposteur. C'est très puissant." }
    ]
  },
   {
    id: 5,
    author: 'PlumeDeNuit',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 3 jours',
    text: "Petit poème du soir :\n\n'La lune est un projecteur blafard\nSur la scène de nos boulevards\nOù chaque ombre danse un ballet\nSilencieux et désolé.'",
    likes: 42,
    commentsCount: 3,
    comments: [
        { author: 'Slam_Sofia', text: 'Magnifique et mélancolique. Bravo.' },
        { author: 'MuseUrbaine', text: 'Très belle image !' },
        { author: 'Lyric_Leo', text: "J'aime beaucoup l'atmosphère qui se dégage." }
    ]
  },
   {
    id: 6,
    author: 'PoeteAnonyme',
    avatar: 'https://placehold.co/40x40.png',
    time: 'il y a 4 jours',
    text: "Comment faites-vous pour trouver votre flow en rap ? Des conseils pour un débutant ?",
    likes: 5,
    commentsCount: 2,
    comments: [
        { author: 'Rap_Ryad', text: "Écoute beaucoup de sons, essaie d'imiter les flows que tu aimes, et après trouve le tien. C'est beaucoup de pratique." },
        { author: 'Lyric_Leo', text: "Ne te concentre pas que sur la rime, le rythme des mots est tout aussi important. Lis tes textes à voix haute." }
    ]
  }
];

export const inspirationQuotes = [
  { quote: 'La poésie est cette musique que tout homme porte en soi.', author: 'William Shakespeare' },
  { quote: 'Le slam, ce n’est rien d’autre que de la poésie dite.', author: 'Grand Corps Malade' },
  { quote: "Le rap, c'est la poésie de la rue.", author: 'Kery James' },
  { quote: "L'inspiration existe, mais elle doit vous trouver au travail.", author: 'Pablo Picasso' },
];

export const inspirationTexts = [
  {
    title: "Demain, dès l'aube...",
    author: 'Victor Hugo',
    genre: 'Poésie',
    content: `Demain, dès l'aube, à l'heure où blanchit la campagne,
Je partirai. Vois-tu, je sais que tu m'attends.
J'irai par la forêt, j'irai par la montagne.
Je ne puis demeurer loin de toi plus longtemps.

Je marcherai les yeux fixés sur mes pensées,
Sans rien voir au dehors, sans entendre aucun bruit,
Seul, inconnu, le dos courbé, les mains croisées,
Triste, et le jour pour moi sera comme la nuit.

Je ne regarderai ni l'or du soir qui tombe,
Ni les voiles au loin descendant vers Harfleur,
Et quand j'arriverai, je mettrai sur ta tombe
Un bouquet de houx vert et de bruyère en fleur.`,
  },
  {
    title: 'Je me souviens',
    author: 'Georges Perec',
    genre: 'Prose (Extrait)',
    content: `Je me souviens des Rubik's Cubes.
Je me souviens que les disques de l'Europe, le midi, commençaient par l'indicatif de "La Chanson de Malbrough".
Je me souviens que lorsque j'étais en sixième ou en cinquième, mes parents m'emmenèrent voir "Le Pont de la rivière Kwaï" et qu'à la fin du film, comme tout le monde sanglotait, mon père s'exclama d'une voix forte : "Ce n'est qu'un film !"
Je me souviens que la première fois que j'ai triché dans un examen (c'était en troisième, en composition d'anglais), j'ai eu zéro (le professeur s'était aperçu que j'avais glissé ma grammaire anglaise dans mon dictionnaire).`,
  },
  {
    title: "L'art de la chute",
    author: 'MC Solaar',
    genre: 'Rap (Extrait)',
    content: `Tomber sept fois, se relever huit, voilà la devise des acrobates de la vie,
Ceux qui, malgré les croche-pattes, les revers et les avanies,
Transforment chaque faux pas en une figure de style,
Et de leurs cicatrices, se font un habit de lumière, habile.

L'art de la chute, c'est de savoir rebondir plus haut,
De faire de chaque échec un tremplin, un nouvel assaut,
C'est la grâce du funambule qui perd l'équilibre,
Mais dans son vertige, invente une danse et se sent vivre.`,
  },
];

export const instrumentalTracks = [
  {
    title: 'Pluie légère',
    src: 'https://storage.googleapis.com/studiopaas-assets/sound-effects/light-rain.mp3',
  },
  {
    title: 'Nuit étoilée',
    src: 'https://storage.googleapis.com/studiopaas-assets/sound-effects/starry-night.mp3',
  },
  {
    title: 'Piano mélancolique',
    src: 'https://storage.googleapis.com/studiopaas-assets/sound-effects/melancholic-piano.mp3',
  },
  {
    title: 'Forêt paisible',
    src: 'https://storage.googleapis.com/studiopaas-assets/sound-effects/peaceful-forest.mp3',
  },
];
