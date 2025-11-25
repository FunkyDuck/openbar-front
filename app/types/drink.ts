export interface Drink {
    id: string;
    name: string;
    type: 'Beer' | 'Wine' | 'Spirit' | 'FruitBrandy' | 'Liqueur' | 'CiderAndFermented' | 'Other';
    country: string;
    region: string;
    flag: string;
    degree: number;
    tags: string[];
    description: string;
    imageUrl?: string;
}