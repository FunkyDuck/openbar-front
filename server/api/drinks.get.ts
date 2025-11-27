import PocketBase from 'pocketbase';
import type { Drink } from "~/types/drink";

export default defineEventHandler(async (event): Promise<Drink[]> => {
    const URL = "https://api.open-bar.ovh"
    const pb = new PocketBase(URL);

    const resultList = await pb.collection('drinks').getFullList({ sort: '-created' });

    return resultList.map((res) => {
        let imageUrl = undefined;
        if(res.image) {
            // Patern: URL_PB / api / files / COLLECTION / ID / FILENAME
            imageUrl = `${URL}/api/files/${res.collectionId}/${res.id}/${res.image}`;
        }

        return {
            id: res.id,
            name: res.name,
            type: res.type as Drink['type'],
            country: res.country,
            region: res.region,
            countryCode: res.countrycode,
            flag: res.flag,
            degree: res.degree,
            tags: res.tags || [],
            description: res.description,
            imageUrl: imageUrl
        };
    });
});


// export default defineEventHandler((event) => {
//     return [
//         {
//             id: '1',
//             name: 'Pálinka Prune (Szilva)',
//             type: 'FruitBrandy',
//             country: 'Hongrie',
//             flag: '🇭🇺',
//             degree: 50,
//             tags: ['Prune', 'Fruit', 'Puissant', 'Traditionnel'],
//             description: 'L\'âme de la Hongrie. Une eau-de-vie de prune pure, sans sucre ajouté. Le goût du fruit est intense, la brûlure est propre.',
//             imageUrl: '/images/hungarian-palinka.jpg'
//         },
//         {
//             id: '2',
//             name: 'Pelinkovac Antique',
//             type: 'Liqueur',
//             country: 'Croatie',
//             flag: '🇭🇷',
//             degree: 35,
//             tags: ['Herbacé', 'Amer', 'Absinthe', 'Digestif'],
//             description: 'La plus ancienne liqueur aux herbes de Croatie. Dominée par l\'absinthe (pelin), elle offre une amertume rafraîchissante.',
//             imageUrl: '/images/pelinkovac.jpg'
//         },
//         {
//             id: '3',
//             name: 'Riga Black Balsam',
//             type: 'Liqueur',
//             country: 'Lettonie',
//             flag: '🇱🇻',
//             degree: 45,
//             tags: ['Herbes', 'Médicinal', 'Dense', 'Amer'],
//             description: 'Le fameux Baume Noir. Une recette de 1752 composée de 24 ingrédients (valériane, gingembre, poivre...). On dit qu\'il soigne tout.',
//             imageUrl: '/images/black_balsam.jpg'
//         },
//         {
//             id: '4',
//             name: 'Țuică de Prune',
//             type: 'FruitBrandy',
//             country: 'Roumanie',
//             flag: '🇷🇴',
//             degree: 40,
//             tags: ['Prune', 'Double Distillation', 'Artisanal'],
//             description: 'Symbole de l\'hospitalité roumaine. Traditionnellement servie avant le repas pour ouvrir l\'appétit.',
//             imageUrl: '/images/tuica.jpg'
//         },
//         {
//             id: '5',
//             name: 'Medica Istriana',
//             type: 'Liqueur',
//             country: 'Croatie',
//             flag: '🇭🇷',
//             degree: 28,
//             tags: ['Miel', 'Douceur', 'Istrie'],
//             description: 'Une grappa locale (Komovica) infusée avec du miel d\'acacia. La douceur liquide de l\'Istrie.',
//             imageUrl: '/images/medica.jpg'
//         }
//     ];
// });