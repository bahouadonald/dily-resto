export interface Zone {
  id: string;
  nom: string;
  rayon_km: number;
  centre_latitude: number;
  centre_longitude: number;
}

export interface Restaurant {
  id: string;
  nom: string;
  description: string | null;
  photo_url: string | null;
  zone_id: string | null;
  latitude: number | null;
  longitude: number | null;
  certifie_hygiene: boolean;
  statut: "en_attente" | "actif" | "suspendu";
  commission_taux: number;
}

export interface Plat {
  id: string;
  restaurant_id: string;
  nom: string;
  description: string | null;
  prix: number;
  categorie: string | null;
  photo_url: string | null;
  disponible: boolean;
  restaurants?: Restaurant;
}

export interface Travailleur {
  id: string;
  nom: string;
  telephone: string | null;
  entreprise: string | null;
  zone_id: string | null;
  lieu_travail: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Livreur {
  id: string;
  nom: string;
  telephone: string | null;
  moyen_transport: string | null;
  zone_id: string | null;
  statut: "disponible" | "en_course" | "hors_ligne";
  latitude_actuelle?: number | null;
  longitude_actuelle?: number | null;
}

export interface Commande {
  id: string;
  travailleur_id: string;
  restaurant_id: string;
  livreur_id: string | null;
  statut:
    | "en_attente"
    | "hors_fenetre"
    | "confirmee"
    | "en_preparation"
    | "prete"
    | "en_livraison"
    | "livree"
    | "annulee";
  montant_total: number;
  frais_livraison: number;
  commission_montant: number;
}
