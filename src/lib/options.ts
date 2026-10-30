/**
 * Listes de valeurs partagées entre l'admin (formulaires) et le site (filtres, affichage).
 * Pour ajouter une valeur : ajoute une ligne ici, c'est tout.
 * `value` = identifiant stocké en base (ne jamais le modifier une fois utilisé)
 * `label` = texte affiché sur le site (anglais) ; `fr` = texte affiché dans l'admin
 */

export type Option = { value: string; label: string; fr: string }

export const YACHT_TYPES: Option[] = [
  { value: 'motor-yacht', label: 'Motor yacht', fr: 'Yacht à moteur' },
  { value: 'flybridge', label: 'Flybridge', fr: 'Flybridge' },
  { value: 'sport-cruiser', label: 'Sport / open cruiser', fr: 'Open / sport cruiser' },
  { value: 'day-cruiser', label: 'Day cruiser', fr: 'Day cruiser' },
  { value: 'explorer', label: 'Explorer', fr: 'Explorer' },
  { value: 'superyacht', label: 'Superyacht', fr: 'Superyacht' },
  { value: 'power-catamaran', label: 'Power catamaran', fr: 'Catamaran à moteur' },
  { value: 'sailing-catamaran', label: 'Sailing catamaran', fr: 'Catamaran à voile' },
  { value: 'sailing-yacht', label: 'Sailing yacht', fr: 'Voilier' },
  { value: 'rib-tender', label: 'RIB / tender', fr: 'Semi-rigide / tender' },
]

export const PRODUCTION_STATUS: Option[] = [
  { value: 'in-production', label: 'In production', fr: 'En production' },
  { value: 'announced', label: 'Announced', fr: 'Annoncé' },
  { value: 'discontinued', label: 'Discontinued', fr: 'Plus produit' },
  { value: 'one-off', label: 'One-off / custom', fr: 'Unité unique / custom' },
]

export const HULL_MATERIALS: Option[] = [
  { value: 'grp', label: 'GRP (fibreglass)', fr: 'Polyester / fibre de verre' },
  { value: 'composite', label: 'Composite / vacuum infusion', fr: 'Composite / infusion' },
  { value: 'carbon', label: 'Carbon', fr: 'Carbone' },
  { value: 'aluminium', label: 'Aluminium', fr: 'Aluminium' },
  { value: 'steel', label: 'Steel', fr: 'Acier' },
  { value: 'steel-aluminium', label: 'Steel hull / aluminium superstructure', fr: 'Coque acier / superstructure alu' },
  { value: 'wood', label: 'Wood', fr: 'Bois' },
]

export const HULL_TYPES: Option[] = [
  { value: 'planing', label: 'Planing', fr: 'Planante' },
  { value: 'semi-displacement', label: 'Semi-displacement', fr: 'Semi-planante' },
  { value: 'displacement', label: 'Displacement', fr: 'Déplacement' },
  { value: 'catamaran', label: 'Catamaran', fr: 'Catamaran' },
  { value: 'trimaran', label: 'Trimaran', fr: 'Trimaran' },
]

export const FUELS: Option[] = [
  { value: 'diesel', label: 'Diesel', fr: 'Diesel' },
  { value: 'petrol', label: 'Petrol', fr: 'Essence' },
  { value: 'hybrid', label: 'Hybrid', fr: 'Hybride' },
  { value: 'electric', label: 'Electric', fr: 'Électrique' },
  { value: 'hvo', label: 'HVO / biofuel', fr: 'HVO / biocarburant' },
]

export const DRIVES: Option[] = [
  { value: 'shaft', label: 'Shaft', fr: 'Arbre (ligne d\'arbre)' },
  { value: 'v-drive', label: 'V-drive', fr: 'V-drive' },
  { value: 'ips', label: 'Volvo Penta IPS', fr: 'Volvo Penta IPS' },
  { value: 'zeus', label: 'Cummins Zeus', fr: 'Cummins Zeus' },
  { value: 'surface', label: 'Surface drive', fr: 'Transmission de surface' },
  { value: 'sterndrive', label: 'Sterndrive', fr: 'Embase / Z-drive' },
  { value: 'outboard', label: 'Outboard', fr: 'Hors-bord' },
  { value: 'waterjet', label: 'Waterjet', fr: 'Hydrojet' },
  { value: 'pod-other', label: 'Other pods', fr: 'Autres pods' },
]

export const GALLEY_POSITIONS: Option[] = [
  { value: 'up', label: 'Galley up (main deck)', fr: 'Cuisine en haut (pont principal)' },
  { value: 'down', label: 'Galley down (lower deck)', fr: 'Cuisine en bas (pont inférieur)' },
  { value: 'cockpit', label: 'Cockpit / outdoor galley', fr: 'Cuisine de cockpit / extérieure' },
  { value: 'separate', label: 'Separate crew galley', fr: 'Cuisine séparée (équipage)' },
]

export const MASTER_POSITIONS: Option[] = [
  { value: 'amidships-full-beam', label: 'Full-beam amidships', fr: 'Pleine largeur au centre' },
  { value: 'forward', label: 'Forward', fr: 'À l\'avant' },
  { value: 'main-deck', label: 'Main deck', fr: 'Sur le pont principal' },
  { value: 'aft', label: 'Aft', fr: 'À l\'arrière' },
  { value: 'upper-deck', label: 'Upper deck', fr: 'Pont supérieur' },
]

export const CE_CATEGORIES: Option[] = [
  { value: 'A', label: 'A — Ocean', fr: 'A — Océan' },
  { value: 'B', label: 'B — Offshore', fr: 'B — Au large' },
  { value: 'C', label: 'C — Inshore', fr: 'C — Côtier' },
  { value: 'D', label: 'D — Sheltered waters', fr: 'D — Eaux protégées' },
]

export const CONFIDENCE: Option[] = [
  { value: 'verified', label: 'Verified', fr: 'Vérifié (plusieurs sources)' },
  { value: 'manufacturer', label: 'Manufacturer data', fr: 'Données constructeur' },
  { value: 'partial', label: 'Partial', fr: 'Partiel / à compléter' },
  { value: 'estimated', label: 'Estimated', fr: 'Estimé' },
]

/**
 * Équipements oui/non. Chaque entrée devient automatiquement :
 *  - une case à cocher dans l'admin (onglet « Extérieur & jouets »)
 *  - un filtre sur la page /yachts
 *  - une ligne sur la fiche yacht
 */
export const FEATURES: { name: string; label: string; fr: string; group: string }[] = [
  { name: 'flybridge', label: 'Flybridge', fr: 'Flybridge', group: 'Decks' },
  { name: 'hardtop', label: 'Hardtop', fr: 'Hardtop', group: 'Decks' },
  { name: 'openingRoof', label: 'Opening roof / sunroof', fr: 'Toit ouvrant', group: 'Decks' },
  { name: 'bowSunpad', label: 'Bow sunpad', fr: 'Bain de soleil avant', group: 'Decks' },
  { name: 'aftSunpad', label: 'Aft sunpad', fr: 'Bain de soleil arrière', group: 'Decks' },
  { name: 'bowLounge', label: 'Bow lounge / seating', fr: 'Salon de proue', group: 'Decks' },
  { name: 'cockpitDining', label: 'Cockpit dining', fr: 'Table de cockpit', group: 'Decks' },
  { name: 'foldDownTerraces', label: 'Fold-down terraces', fr: 'Terrasses rabattables', group: 'Decks' },
  { name: 'beachClub', label: 'Beach club', fr: 'Beach club', group: 'Water access' },
  { name: 'hydraulicPlatform', label: 'Hydraulic swim platform', fr: 'Plateforme de bain hydraulique', group: 'Water access' },
  { name: 'jacuzzi', label: 'Jacuzzi', fr: 'Jacuzzi', group: 'Water access' },
  { name: 'pool', label: 'Pool', fr: 'Piscine', group: 'Water access' },
  { name: 'tenderGarage', label: 'Tender garage', fr: 'Garage à tender', group: 'Tender & toys' },
  { name: 'jetskiStorage', label: 'Jet-ski storage', fr: 'Rangement jet-ski', group: 'Tender & toys' },
  { name: 'crane', label: 'Crane / davit', fr: 'Grue / bossoir', group: 'Tender & toys' },
  { name: 'gyroStabilizer', label: 'Gyro stabiliser', fr: 'Stabilisateur gyroscopique', group: 'Comfort' },
  { name: 'zeroSpeedStabilizers', label: 'Zero-speed fin stabilisers', fr: 'Stabilisateurs à ailerons (à l\'arrêt)', group: 'Comfort' },
  { name: 'separateCrewAccess', label: 'Independent crew access', fr: 'Accès équipage indépendant', group: 'Layout' },
  { name: 'crewQuarters', label: 'Crew quarters', fr: 'Cabine équipage', group: 'Layout' },
  { name: 'joystick', label: 'Joystick docking', fr: 'Joystick d\'accostage', group: 'Handling' },
  { name: 'bowThruster', label: 'Bow thruster', fr: 'Propulseur d\'étrave', group: 'Handling' },
  { name: 'sternThruster', label: 'Stern thruster', fr: 'Propulseur de poupe', group: 'Handling' },
]

export const toAdminOptions = (opts: Option[]) => opts.map((o) => ({ value: o.value, label: o.fr }))

export const labelOf = (opts: Option[], value?: string | null) =>
  opts.find((o) => o.value === value)?.label ?? value ?? ''
