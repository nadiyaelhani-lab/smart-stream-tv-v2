
export function displayChannels(channels, onSelect) {
    const list = document.querySelector("#channels-list");

    // Clear the previous channel list
    list.innerHTML = "";

    // Show a message if no channels are found
    if (channels.length === 0) {
        list.innerHTML = `
            <p class="text-slate-400 text-center py-6">
                Aucune chaîne trouvée.
            </p>
        `;
        return;
    }

    // Get unique categories
    const categories = [
        ...new Set(channels.map(channel =>
            channel.category || "Autres"
        ))
    ];

    categories.forEach(category => {
        // Category heading
        const heading = document.createElement("h3");
        heading.textContent = category;
        heading.className =
            "text-purple-400 font-bold mt-4 mb-2";

        list.appendChild(heading);

        // Display channels in this category
        channels
            .filter(channel =>
                (channel.category || "Autres") === category
            )
            .forEach(channel => {
                const card = document.createElement("div");

                card.dataset.id = channel.id;

                card.className =
                    "w-full flex items-center gap-3 p-3 " +
                    "rounded-lg bg-slate-800 hover:bg-slate-700 " +
                    "text-left cursor-pointer transition";

                // Channel logo
                const logo = document.createElement("img");

                logo.src = channel.logo ||
                    "https://placehold.co/80x80?text=TV";

                logo.alt = channel.name;
                logo.className =
                    "w-10 h-10 rounded object-contain shrink-0";

                logo.onerror = function () {
                    this.onerror = null;
                    this.src =
                        "https://placehold.co/80x80?text=TV";
                };

                // Channel number and name
                const title = document.createElement("span");

                title.textContent =
                    `${channel.channelNumber} — ${channel.name}`;

                title.className =
                    "flex-1 min-w-0 text-sm text-white break-words";

                card.appendChild(logo);
                card.appendChild(title);

                // BLACKLISTED CHANNELS
                if (channel.isBlacklisted === true) {

                    // Restore button
                    const restoreBtn =
                        document.createElement("button");

                    restoreBtn.type = "button";
                    restoreBtn.dataset.action = "restore";
                    restoreBtn.textContent = "Restaurer";

                    restoreBtn.className =
                        "text-green-400 hover:text-green-300 " +
                        "text-sm shrink-0";

                    card.appendChild(restoreBtn);

                    // Delete button
                    const deleteBtn =
                        document.createElement("button");

                    deleteBtn.type = "button";
                    deleteBtn.dataset.action = "delete";
                    deleteBtn.textContent = "Supprimer";

                    deleteBtn.className =
                        "text-red-400 hover:text-red-300 " +
                        "text-sm shrink-0";

                    card.appendChild(deleteBtn);

                } else {

                    // FAVORITES BUTTON
                    const favoriteBtn =
                        document.createElement("button");

                    favoriteBtn.type = "button";
                    favoriteBtn.dataset.action = "favorite";

                    favoriteBtn.textContent =
                        channel.isFavorite === true ? "★" : "☆";

                    favoriteBtn.className =
                        "text-yellow-400 text-2xl shrink-0";

                    favoriteBtn.setAttribute(
                        "aria-label",
                        channel.isFavorite
                            ? "Retirer des favoris"
                            : "Ajouter aux favoris"
                    );

                    card.appendChild(favoriteBtn);

                    // BLACKLIST BUTTON
                    const blacklistBtn =
                        document.createElement("button");

                    blacklistBtn.type = "button";
                    blacklistBtn.dataset.action = "blacklist";
                    blacklistBtn.textContent = "🚫";
                    blacklistBtn.title = "Bloquer la chaîne";

                    blacklistBtn.className =
                        "text-red-400 text-lg shrink-0";

                    card.appendChild(blacklistBtn);
                }

                // Select channel for preview
                // Action buttons are handled by main.js
                card.addEventListener("click", event => {
                    if (event.target.closest("button")) {
                        return;
                    }

                    // Avoid handling the same click twice
                    // when main.js uses event delegation.
                    if (event._smartStreamHandled) {
                        return;
                    }

                    event._smartStreamHandled = true;

                    if (typeof onSelect === "function") {
                        onSelect(channel);
                    }
                });

                list.appendChild(card);
            });
    });
}
