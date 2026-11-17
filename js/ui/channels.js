
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
        const favorite = document.createElement("button");

favorite.dataset.action = "favorite";

favorite.textContent = channel.isFavorite ? "\u2605" : "\u2606";

favorite.className = "ml-auto text-yellow-400 text-2xl";

button.appendChild(favorite);
        
        list.appendChild(button);
    });
});
}
