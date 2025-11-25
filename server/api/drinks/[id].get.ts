import PocketBase from 'pocketbase';
import type { Drink } from '~/types/drink';

export default defineEventHandler(async (event): Promise<Drink> => {
    // On récupère l'ID depuis l'URL (ex: /api/drinks/pbc_12345)
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID manquant' });
    }

    console.log('-------------------------------------------');
    console.log('🔍 RECHERCHE BOISSON ID :', id);

    const URL = "https://api.open-bar.ovh";
    const pb = new PocketBase(URL);

    // 2. Vital pour éviter les crashs "autocancel"
    pb.autoCancellation(false);

    try {
        // 3. On utilise getOne() au lieu de getFullList()
        const record = await pb.collection('drinks').getOne(id);

        console.log('✅ TROUVÉ :', record.name);

        // Construction de l'image
        let imageUrl = undefined;
        if(record.image) {
            imageUrl = `${URL}/api/files/${record.collectionId}/${record.id}/${record.image}`;
        }

        // 4. Mapping propre (Avec le champ région qu'on a ajouté)
        return {
            id: record.id,
            name: record.name,
            region: record.region, // On garde la région

            type: record.type as Drink['type'],
            country: record.country,
            flag: record.flag,
            degree: record.degree,
            tags: record.tags || [],
            description: record.description,
            imageUrl: imageUrl
        };

    } catch (error: any) {
        console.error('❌ ERREUR :', error.message);

        // Si l'erreur est 404 (Not Found), on renvoie une 404 propre
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