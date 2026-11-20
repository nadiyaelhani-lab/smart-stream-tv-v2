
 // Je stocke l'adresse de mon API pour la réutiliser.
const API_URL = "https://6af3a7e155a1de7dcf032482.mockapi.io/channels";

// GET : récupérer toutes les chaînes TV
// Je crée une fonction asynchrone utilisable dans les autres fichiers.
export const getChannels = async () => {

    // J'envoie une requête GET et j'attends la réponse du serveur.
    const response = await fetch(API_URL);

    // Si la requête échoue, je déclenche une erreur avec son code HTTP.
    if (!response.ok) throw new Error(`Erreur ${response.status}`);

    // Je transforme la réponse JSON en données JavaScript.
    return response.json();
};

// POST : ajouter une nouvelle chaîne TV
// Je crée une fonction asynchrone qui reçoit la chaîne à ajouter.
export const createChannel = async (channel) => {

    // J'envoie une requête POST au serveur.
    const response = await fetch(API_URL, {

        // Je précise que je veux créer une nouvelle ressource.
        method: "POST",

        // J'indique que les données envoyées sont au format JSON.
        headers: { "Content-Type": "application/json" },

        // Je convertis l'objet JavaScript en texte JSON.
        body: JSON.stringify(channel),
    });

    // Je vérifie si la requête a réussi.
    if (!response.ok) throw new Error(`Erreur ${response.status}`);

    // Je récupère la nouvelle chaîne enregistrée par le serveur.
    return response.json();
};

// PUT : modifier une chaîne existante
// Je crée une fonction qui reçoit l'identifiant et les modifications.
export const updateChannel = async (id, changes) => {

    // J'envoie une requête à l'adresse de la chaîne concernée.
    const response = await fetch(`${API_URL}/${id}`, {

        // PUT permet de modifier les données d'une chaîne.
        method: "PUT",

        // Je précise que j'envoie des données JSON.
        headers: { "Content-Type": "application/json" },

        // Je transforme les modifications en texte JSON.
        body: JSON.stringify(changes),
    });

    // Je vérifie si le serveur a accepté la modification.
    if (!response.ok) throw new Error(`Erreur ${response.status}`);

    // Je récupère la chaîne après modification.
    return response.json();
};

// DELETE : supprimer une chaîne
// Je crée une fonction asynchrone qui reçoit l'identifiant.
export const deleteChannel = async (id) => {

    // J'envoie une requête DELETE à la chaîne concernée.
    const response = await fetch(`${API_URL}/${id}`, {

        // Je demande au serveur de supprimer cette chaîne.
        method: "DELETE"
    });

    // Je vérifie si la suppression a réussi.
    if (!response.ok) throw new Error(`Erreur ${response.status}`);

    // Je récupère la réponse JSON du serveur.
    return response.json();
};
export async function addChannel(channel) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(channel)
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la chaîne");
    }

    return await response.json();
}
