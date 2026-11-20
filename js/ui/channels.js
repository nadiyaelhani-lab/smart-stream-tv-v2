
export function displayChannels(channels, onSelect) {
    const list = document.querySelector("#channels-list");

    list.innerHTML = "";

const categories = [...new Set(channels.map(channel => channel.category))];

categories.forEach(category => {
    const heading = document.createElement("h3");
    heading.textContent = category;
    heading.className = "text-purple-400 font-bold mt-4 mb-2";
    list.appendChild(heading);

    channels.filter(channel => channel.category === category)
        .forEach(channel => {
const button = document.createElement("div");
button.dataset.id = channel.id;
        button.className =
            "w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-left";

        const logo = document.createElement("img");
        logo.src = channel.logo;
        logo.alt = channel.name;
        logo.className = "w-10 h-10 rounded";

        const title = document.createElement("span");
        title.textContent =
            `${channel.channelNumber} — ${channel.name}`;

        button.appendChild(logo);
        button.appendChild(title);
if (channel.isBlacklisted === true) {
    const restoreBtn = document.createElement("button");
restoreBtn.dataset.action = "restore";
restoreBtn.textContent = "Restaurer";
restoreBtn.className = "ml-auto text-green-400 text-sm";

button.appendChild(restoreBtn);
const deleteBtn = document.createElement("button");
deleteBtn.dataset.action = "delete";
deleteBtn.textContent = "Supprimer";
deleteBtn.className = "text-red-400 text-sm";

button.appendChild(deleteBtn);
} else {
    const favorite = document.createElement("button");

favorite.dataset.action = "favorite";

favorite.textContent = channel.isFavorite ? "\u2605" : "\u2606";

favorite.className = "ml-auto text-yellow-400 text-2xl";

button.appendChild(favorite);
const blacklistButton = document.createElement("button");
blacklistButton.dataset.action = "blacklist";
blacklistButton.textContent = "Bloquer";
blacklistButton.className = "text-red-400 text-sm";
button.appendChild(blacklistButton);
}

list.appendChild(button);

    });
});
}
