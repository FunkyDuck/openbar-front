import PocketBase from 'pocketbase';
import type { Drink } from '~/types/drink';

export default defineEventHandler(async (event): Promise<Drink> => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID manquant' });
    }

    console.log('-------------------------------------------');
    console.log('🔍 RECHERCHE BOISSON ID :', id);

    const URL = "https://api.open-bar.ovh";
    const pb = new PocketBase(URL);

    pb.autoCancellation(false);

    try {
        const record = await pb.collection('drinks').getOne(id);

        console.log('✅ TROUVÉ :', record.name);

        let imageUrl = undefined;
        if(record.image) {
            imageUrl = `${URL}/api/files/${record.collectionId}/${record.id}/${record.image}`;
        }

        return {
            id: record.id,
            name: record.name,
            region: record.region,

            type: record.type as Drink['type'],
            country: record.country,
            countryCode: record.countrycode,
            flag: record.flag,
            degree: record.degree,
            tags: record.tags || [],
            description: record.description,
            imageUrl: imageUrl
        };

    } catch (error: any) {
        console.error('❌ ERREUR :', error.message);

        if (error.status === 404) {
            throw createError({ statusCode: 404, statusMessage: 'Boisson introuvable' });
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur PocketBase',
            message: error.message
        });
    }
});