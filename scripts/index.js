// === DIALOGS ===

// DOM nodes
const newBookmarkModal = document.querySelector('#new-bookmark-modal');
const manageBookmarksModal = document.querySelector('#manage-bookmarks-modal');
const settingsModal = document.querySelector('#settings-modal');
const editBookmarkModal = document.querySelector('#edit-bookmark-modal');
// const wipeAllBookmarksModal = document.querySelector(".wipe-bookmarks-modal");

function openModal(modal) {
    closeAllModals();
    modal.showModal();
}

function closeModal(modal) {
    modal.close();
}

// So that dialogs don't overlap each other in case of opening a modal from another one
function closeAllModals() {
    document.querySelectorAll('.app-modal').forEach(dialog => {
        dialog.close();
    })
}

// Event listeners

document.querySelectorAll('.modal-open-btn').forEach(e => {
    e.addEventListener('click', () => {
        openModal(document.getElementById(e.dataset.modal))
    })
})

document.querySelectorAll('.modal-close-btn').forEach(e => {
    e.addEventListener('click', () => {
        closeModal(document.getElementById(e.dataset.modal))
    })
})

// === MAIN SECTION ===

const bookmarksContainer = document.querySelector('#bookmarks-container');
const bookmarksList = document.querySelector('#bookmarks-list');

let bookmarksArray = [];
let localStorageBookmarks = JSON.parse(localStorage.getItem("blockBookmarks"));

if (localStorageBookmarks) {
    bookmarksArray = localStorageBookmarks;
}

// Adding a new bookmark

const newBookmarkForm = document.querySelector('#new-bookmark-form');

newBookmarkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newBookmarkFormData = new FormData(newBookmarkForm);

    let newBookmark = {};

    const bookmarkUrl = newBookmarkFormData.get('bookmark-url');
    const bookmarkTitle = newBookmarkFormData.get('bookmark-title');

    if (bookmarkTitle === "") {
        newBookmark.url = bookmarkUrl.split('https://').pop();
        newBookmark.title = newBookmark.url;
    } else {
        newBookmark.url = bookmarkUrl.split('https://').pop();
        newBookmark.title = bookmarkTitle;
    }

    bookmarksArray.push(newBookmark);
    localStorage.setItem('blockBookmarks', JSON.stringify(bookmarksArray));
    renderBookmarks(bookmarksContainer, bookmarksList, bookmarksArray);

    newBookmarkForm.reset();
    closeModal(newBookmarkModal);
});

// Editing a bookmark 

function editBookmark(index) {
    closeModal(manageBookmarksModal);
    openModal(editBookmarkModal);

    document.querySelector('#edit-bookmark-modal-bookmark-id').textContent = `Editing bookmark #${index+1}`

    const editBookmarkForm = document.querySelector('#edit-bookmark-form');

    document.querySelector('#edit-bookmark-form-url-input').value = bookmarksArray[index].url;
    document.querySelector('#edit-bookmark-form-title-input').value = bookmarksArray[index].title;

    editBookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const editBookmarkFormData = new FormData(editBookmarkForm);

        const bookmarkUrl = editBookmarkFormData.get('bookmark-url');
        const bookmarkTitle = editBookmarkFormData.get('bookmark-title');

        if (bookmarkTitle === "") {
            bookmarksArray[index].url = bookmarkUrl.split('https://').pop();
            bookmarksArray[index].title = bookmarksArray[index].url;
        } else {
            bookmarksArray[index].url = bookmarkUrl.split('https://').pop();
            bookmarksArray[index].title = bookmarkTitle;
        }

        localStorage.setItem('blockBookmarks', JSON.stringify(bookmarksArray));
        renderBookmarks(bookmarksContainer, bookmarksList, bookmarksArray);

        editBookmarkForm.reset();
        closeModal(editBookmarkModal);
        openModal(manageBookmarksModal);

    })

}

// Removing a bookmark

function removeBookmark(index) {
    bookmarksArray.splice(index, 1);
    localStorage.setItem('blockBookmarks', JSON.stringify(bookmarksArray));
    renderBookmarks(bookmarksContainer, bookmarksList, bookmarksArray);
}

// Rendering the bookmarks

function loadBlackAltIcon(e) {
    e.src = "./images/desktop-icon-black.svg";
}

function loadWhiteAltIcon(e) {
    e.src = "./images/desktop-icon-white.svg";
}

function getFavicon(url) {
    return 'https://' + url.split("/")[0] + "/favicon.ico";
}

function renderBookmarks(container, list, array) {

    container.innerHTML = '';
    list.innerHTML = '';

    if (array.length > 0) {

        array.forEach((bookmark, index) => {
            container.innerHTML +=
            `
                <a class="bookmark-block" href="https://${bookmark.url}">
                    <h1>${bookmark.title}</h1>
                    <img class="bookmark-block-icon" src="${getFavicon(bookmark.url)}" onerror="loadWhiteAltIcon(this)" aria-hidden="true">
                </a>
            `;

            list.innerHTML +=
            `
                <li class="bookmarks-list-item">
                    <div class="bookmarks-list-item-meta">
                        <img class="bookmarks-list-item-icon" src="${getFavicon(bookmark.url)}" onerror="loadBlackAltIcon(this)" aria-hidden="true">
                        <p class="bookmarks-list-item-title">${bookmark.title}</p>
                    </div>
                    <div class="bookmarks-list-item-actions">
                        <button class="bookmarks-list-item-remove-btn" onclick="removeBookmark(${index})"><i class="fa-solid fa-trash" aria-hidden="true"></i>Remove</button>
                        <button class="bookmarks-list-item-edit-btn" onclick="editBookmark(${index})"><i class="fa-solid fa-pencil" aria-hidden="true"></i>Edit</button>
                    </div>
                </li>
            `
        })
    } else {
        container.innerHTML = 
        `
            <div class="bookmark-block bookmark-block-placeholder" onclick="openModal(newBookmarkModal)">
                <h1>You don't have any bookmarks</h1>
                <p>Click here to add a new one</p>
            </div>
        `;
        list.innerHTML = `<p>You don't have any bookmarks. Add one with the button below.</p>`
    }

}

renderBookmarks(bookmarksContainer, bookmarksList, bookmarksArray);