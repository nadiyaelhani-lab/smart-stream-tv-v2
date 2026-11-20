import {
    getChannels,
    updateChannel,
    deleteChannel,
    addChannel
} from "./api.js";

import { displayChannels } from "./ui/channels.js";
import { showPreview } from "./ui/preview.js";

const search = document.querySelector("#search");
const allBtn = document.querySelector("#all-btn");
const favoritesBtn = document.querySelector("#favorites-btn");
const blacklistBtn = document.querySelector("#blacklist-btn");

async function initApp() {
    
    document.querySelector("#loading").classList.remove("hidden");

    try {
        const channels = await getChannels();
        console.log(channels);
        let currentFilter = localStorage.getItem("selectedFilter") || "all";

if (!["all", "favorites"].includes(currentFilter)) {
    currentFilter = "all";
}
        function renderChannels() {
    const text = search.value.toLowerCase().trim();

    const filtered = channels.filter(channel => {
        let matchesFilter = false;

        if (currentFilter === "all") {
            matchesFilter = channel.isBlacklisted !== true;
        } else if (currentFilter === "favorites") {
            matchesFilter =
                channel.isFavorite === true &&
                channel.isBlacklisted !== true;
        } else if (currentFilter === "blacklist") {
            matchesFilter = channel.isBlacklisted === true;
        }

        const matchesSearch =
            channel.name.toLowerCase().includes(text) ||
            String(channel.channelNumber).includes(text) ||
            (channel.category || "").toLowerCase().includes(text);

        return matchesFilter && matchesSearch;
    });

    displayChannels(filtered, showPreview);
    
}

const form = document.querySelector("#add-channel-form");
const formError = document.querySelector("#form-error");
const formSuccess = document.querySelector("#form-success");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const number = document.querySelector("#channel-number").value.trim();
    const name = document.querySelector("#channel-name").value.trim();
    const category = document.querySelector("#channel-category").value.trim();
    const logo = document.querySelector("#channel-logo").value.trim();

    formError.classList.add("hidden");
    formSuccess.classList.add("hidden");

    // Validation obligatoire
    if (!number || !name || Number(number) < 1) {
        formError.textContent =
            "Le numéro et le nom sont obligatoires.";
        formError.classList.remove("hidden");
        return;
    }

    const newChannel = {
        channelNumber: number,
        name: name,
        category: category,
        logo: logo,
        previewImage: logo || "https://placehold.co/800x450?text=Smart+Stream+TV",
        isFavorite: false,
        isBlacklisted: false
    };

    try {
        const createdChannel = await addChannel(newChannel);

        channels.push(createdChannel);

        currentFilter = "all";
        search.value = "";

        renderChannels();
        form.reset();

        formSuccess.textContent = "Chaîne ajoutée avec succès !";
        formSuccess.classList.remove("hidden");

    } catch (error) {
        console.error("Erreur POST :", error);

        formError.textContent =
            "Impossible d'ajouter la chaîne.";
        formError.classList.remove("hidden");
    }
});

blacklistBtn.addEventListener("click", function () {
    currentFilter = "blacklist";
    renderChannels();
});
        favoritesBtn.addEventListener("click", function () {
    currentFilter = "favorites";
    localStorage.setItem("selectedFilter", "favorites");

const text = search.value.toLowerCase().trim();
  const filtered = channels.filter(channel =>
    channel.isFavorite === true &&
    channel.isBlacklisted !== true &&
    channel.name.toLowerCase().includes(text)
);

    displayChannels(filtered, showPreview);
});
     allBtn.addEventListener("click", function () {
    currentFilter = "all";
    localStorage.setItem("selectedFilter", "all");

    const text = search.value.toLowerCase().trim();
const filtered = channels.filter(channel =>
    channel.isBlacklisted !== true &&
    (
        channel.name.toLowerCase().includes(text) ||
        channel.channelNumber.includes(text) ||
        channel.category.toLowerCase().includes(text)
    )
);

    displayChannels(filtered, showPreview);
});
renderChannels();
const list = document.querySelector("#channels-list");

list.addEventListener("click", async (event) => {
    const item = event.target.closest("[data-id]");
    if (!item) return;

   const id = item.dataset.id;
const channel = channels.find(c => c.id === id);

if (!channel) return;

const button = event.target.closest("button");
if (button?.dataset.action === "restore") {
    try {
        await updateChannel(id, { isBlacklisted: false });
        channel.isBlacklisted = false;
        const remaining = channels.filter(c =>
    c.isBlacklisted === true
);

displayChannels(remaining, showPreview);
        console.log("Chaîne restaurée :", id);
    } catch (error) {
        console.error("Erreur restauration :", error.message);
    }
    return;
}
if (button?.dataset.action === "blacklist") {
    try {
        await updateChannel(id, { isBlacklisted: true });
        channel.isBlacklisted = true;
        const visibleChannels = channels.filter(c =>
    c.isBlacklisted !== true
);

displayChannels(visibleChannels, showPreview);

        console.log("Chaîne bloquée :", id);
    } catch (error) {
        console.error("Erreur blacklist :", error.message);
    }

    return;
}


if (button?.dataset.action === "delete") {
    const confirmation = confirm("Voulez-vous supprimer cette chaîne ?");

    if (!confirmation) return;

try {
    await deleteChannel(id);
    const index = channels.findIndex(c => c.id === id);
channels.splice(index, 1);
const remaining = channels.filter(c =>
    c.isBlacklisted === true
);

displayChannels(remaining, showPreview);
    console.log("Chaîne supprimée :", id);
} catch (error) {
    console.error("Erreur suppression :", error.message);
}
    return;
}

    if (button?.dataset.action === "favorite") {
        try {
            const newValue = !channel.isFavorite;

            await updateChannel(id, { isFavorite: newValue });

            channel.isFavorite = newValue;

            const text = search.value.toLowerCase().trim();
let visibleChannels = channels;

if (currentFilter === "favorites") {
    visibleChannels = channels.filter(channel =>
        channel.isFavorite === true &&
        channel.isBlacklisted !== true
    );
} else if (currentFilter === "blacklist") {
    visibleChannels = channels.filter(channel =>
        channel.isBlacklisted === true
    );
} else {
    visibleChannels = channels.filter(channel =>
        channel.isBlacklisted !== true
    );
}
    const filtered = visibleChannels.filter(c =>
                c.name.toLowerCase().includes(text) ||
                c.channelNumber.includes(text) ||
                c.category.toLowerCase().includes(text)
            );

            displayChannels(filtered, showPreview);
        } catch (error) {
            console.error("Erreur favori :", error.message);
        }
    } else {
        showPreview(channel);
        document.querySelectorAll("#channels-list [data-id]")
            .forEach(element => element.classList.remove("bg-purple-600"));

        item.classList.add("bg-purple-600");
    }
});

        search.addEventListener("input", function () {
            
            const text = search.value.toLowerCase().trim();

let visibleChannels = channels;

if (currentFilter === "favorites") {
    visibleChannels = channels.filter(c =>
        c.isFavorite === true && c.isBlacklisted !== true
    );
} else if (currentFilter === "blacklist") {
    visibleChannels = channels.filter(c =>
        c.isBlacklisted === true
    );
} else {
    visibleChannels = channels.filter(c =>
        c.isBlacklisted !== true
    );
}

    const filtered = visibleChannels.filter(channel =>
            channel.name.toLowerCase().includes(text) ||
                channel.channelNumber.includes(text) ||
                channel.category.toLowerCase().includes(text)

            );

            displayChannels(filtered, showPreview);
              if (filtered.length === 1) {
        showPreview(filtered[0]);
        }
        });

    } catch (error) {
    console.error("Erreur :", error.message);

    const errorMessage = document.querySelector("#error");
    errorMessage.textContent = "Impossible de charger les chaînes TV.";
    errorMessage.classList.remove("hidden");

    } finally {
        document.querySelector("#loading").classList.add("hidden");
    }
}

initApp();
