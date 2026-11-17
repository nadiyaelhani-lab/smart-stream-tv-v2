
import { getChannels, updateChannel } from "./api.js";
import { displayChannels } from "./ui/channels.js";
import { showPreview } from "./ui/preview.js";

const search = document.querySelector("#search");
const allBtn = document.querySelector("#all-btn");
const favoritesBtn = document.querySelector("#favorites-btn");

async function initApp() {
    document.querySelector("#loading").classList.remove("hidden");

    try {
        const channels = await getChannels();
        console.log(channels);
        let currentFilter = "all";
        favoritesBtn.addEventListener("click", function () {
    currentFilter = "favorites";

const text = search.value.toLowerCase().trim();
  const filtered = channels.filter(channel =>
        channel.isFavorite === true &&
        channel.name.toLowerCase().includes(text)
    );

    displayChannels(filtered, showPreview);
});
     allBtn.addEventListener("click", function () {
    currentFilter = "all";

    const text = search.value.toLowerCase().trim();

    const filtered = channels.filter(channel =>
        channel.name.toLowerCase().includes(text) ||
        channel.channelNumber.includes(text) ||
        channel.category.toLowerCase().includes(text)
    );

    displayChannels(filtered, showPreview);
});

        displayChannels(channels, showPreview);

const list = document.querySelector("#channels-list");

list.addEventListener("click", async (event) => {
    const item = event.target.closest("[data-id]");
    if (!item) return;

    const id = item.dataset.id;
    const channel = channels.find(c => c.id === id);

    if (!channel) return;

    const button = event.target.closest("button");

    if (button?.dataset.action === "favorite") {
        try {
            const newValue = !channel.isFavorite;

            await updateChannel(id, { isFavorite: newValue });

            channel.isFavorite = newValue;

            const text = search.value.toLowerCase().trim();
const visibleChannels = currentFilter === "favorites"
    ? channels.filter(c => c.isFavorite === true)
    : channels;
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

 const visibleChannels = currentFilter === "favorites"
        ? channels.filter(channel => channel.isFavorite === true)
        : channels;

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
