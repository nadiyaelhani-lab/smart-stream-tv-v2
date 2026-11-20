
import { getChannels, updateChannel, deleteChannel } from "./api.js";import { displayChannels } from "./ui/channels.js";
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
        let currentFilter = "all";
        blacklistBtn.addEventListener("click", function () {
    currentFilter = "blacklist";
const text = search.value.toLowerCase().trim();

const filtered = channels.filter(channel =>
    channel.isBlacklisted === true &&
    (
        channel.name.toLowerCase().includes(text) ||
        channel.channelNumber.includes(text) ||
        channel.category.toLowerCase().includes(text)
    )
);

    displayChannels(filtered, showPreview);
});
        favoritesBtn.addEventListener("click", function () {
    currentFilter = "favorites";

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

const activeChannels = channels.filter(channel =>
    channel.isBlacklisted !== true
);

displayChannels(activeChannels, showPreview);
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
