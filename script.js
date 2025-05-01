let addNewMeet = document.getElementById("addNewMeet");
let shadowModal = document.getElementById("shadowModal");
let closeModal = document.getElementById("closeModal");
let creatNewMeet = document.getElementById("creatNewMeet");
let mainBlock = document.getElementById("main");
let allInputMeet = document.querySelectorAll("#modalMeet .meets-form input");

let count = 0;

window.onload = function () {
    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    meets.forEach(renderMeet);

    if (meets.length > 0) {
        count = meets[meets.length - 1].id;
    }
};

addNewMeet.onclick = function () {
    shadowModal.style.display = "flex";
    addNewMeet.style.display = "none";
    creatNewMeet.style.display = "block";
};


closeModal.onclick = closeModalFunction;

function closeModalFunction() {
    shadowModal.style.display = "none";
    addNewMeet.style.display = "block";
    creatNewMeet.style.display = "none";
}

creatNewMeet.onclick = function (e) {
    e.preventDefault();
    count++;

    let title = allInputMeet[0].value;
    let client = allInputMeet[1].value;
    let dateValue = allInputMeet[2].value;
    let timeValue = allInputMeet[3].value || "Не указано";

    let today = new Date();
    let selectedDate = new Date(dateValue);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    let statusClass = "";
    if (selectedDate < today) {
        statusClass = "expired";
    } else if (selectedDate.getTime() === today.getTime()) {
        statusClass = "today";
    } else {
        statusClass = "upcoming";
    }
    let meet = {
        id: count,
        title: title,
        client: client,
        date: dateValue,
        status: statusClass
    };
    
    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    meets.push(meet);
    localStorage.setItem("meets", JSON.stringify(meets));


    mainBlock.innerHTML += `
        <div class="meets ${statusClass}">
            <strong>Meet №${count}</strong><br><br>
            <b>Meet name:</b> ${title}<br>
            <b>Client:</b> ${client}<br>
            <b>Date:</b> ${dateValue}<br>
            <b>Time:</b> ${timeValue}<br>
            <button class="details-btn">More...</button>
        </div>
    `;

    allInputMeet.forEach(input => input.value = '');
    closeModalFunction();
};
function renderMeet(meet) {
    mainBlock.innerHTML += `
        <div class="meets ${meet.status}" data-id="${meet.id}">
            <strong>Meet №${meet.id}</strong><br><br>
            <b>Meet name:</b> ${meet.title}<br><br>
            <b>Client:</b> ${meet.client}<br><br>
            <b>Date:</b> ${meet.date}<br><br>
            <button class="details-btn">More...</button>
        </div>
    `;
}

document.getElementById("sortMeets").onclick = function () {
    let cards = Array.from(document.querySelectorAll(".meets"));

    cards.sort((a, b) => {
        let dateA = new Date(a.querySelector("b:nth-of-type(3)").nextSibling.textContent.trim());
        let dateB = new Date(b.querySelector("b:nth-of-type(3)").nextSibling.textContent.trim());
        return dateA - dateB;
    });

    mainBlock.innerHTML = "";
    cards.forEach(card => mainBlock.appendChild(card));
};   

let editModal = document.getElementById("editModal");
let closeEditModal = document.getElementById("closeEditModal");
let editForm = document.getElementById("editForm");
let editTitle = document.getElementById("editTitle");
let editClient = document.getElementById("editClient");
let editDate = document.getElementById("editDate");
let editTime = document.getElementById("editTime");

let selectedCard = null;

editForm.onsubmit = function (e) {
    e.preventDefault();

    if (!selectedCard) return;

    let updatedTitle = editTitle.value;
    let updatedClient = editClient.value;
    let updatedDate = editDate.value;
    let updatedTime = editTime.value || "Не указано";
    let updatedStatus = getStatusClass(updatedDate);

    selectedCard.className = "meets " + updatedStatus;
    selectedCard.innerHTML = `
        <strong>Meet №${selectedCard.dataset.id}</strong><br><br>
        <b>Meet name:</b> ${updatedTitle}<br><br>
        <b>Client:</b> ${updatedClient}<br><br>
        <b>Date:</b> ${updatedDate}<br><br>
        <b>Time:</b> ${updatedTime}<br><br>
        <button class="details-btn">More...</button>
    `;

    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    let index = meets.findIndex(meet => meet.id == selectedCard.dataset.id);
    if (index !== -1) {
        meets[index] = {
            id: Number(selectedCard.dataset.id),
            title: updatedTitle,
            client: updatedClient,
            date: updatedDate,
            status: updatedStatus
        };
        localStorage.setItem("meets", JSON.stringify(meets));
    }

    editModal.style.display = "none";
};

closeEditModal.onclick = () => {
    editModal.style.display = "none";
};

document.getElementById("deleteMeet").onclick = function () {
    if (!selectedCard) return;

    selectedCard.remove();

    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    let index = meets.findIndex(meet => meet.id == selectedCard.dataset.id);
    if (index !== -1) {
        meets.splice(index, 1);
        localStorage.setItem("meets", JSON.stringify(meets));
    }

    editModal.style.display = "none";
};

mainBlock.addEventListener("click", function (e) {
    let card = e.target.closest(".meets");
    if (!card) return;

    if (e.target.classList.contains("details-btn")) {
        detailTitle.textContent = card.querySelector("b:nth-of-type(1)").nextSibling.textContent.trim() || "Не указано";
        detailClient.textContent = card.querySelector("b:nth-of-type(2)").nextSibling.textContent.trim() || "Не указано";
        detailDate.textContent = card.querySelector("b:nth-of-type(3)").nextSibling.textContent.trim() || "Не указано";
        detailTime.textContent = card.querySelector("b:nth-of-type(4)")?.nextSibling?.textContent.trim() || "Не указано";
        detailPlace.textContent = "Офис №3, каб. 205";
        detailManager.textContent = "Александр Иванов";
        detailComment.textContent = "Не забудьте принести все документы.";
        detailsModal.style.display = "flex";
        return; 
    }

    selectedCard = card;
    editTitle.value = card.querySelector("b:nth-of-type(1)").nextSibling.textContent.trim();
    editClient.value = card.querySelector("b:nth-of-type(2)").nextSibling.textContent.trim();
    editDate.value = card.querySelector("b:nth-of-type(3)").nextSibling.textContent.trim();
    editTime.value = card.querySelector("b:nth-of-type(4)")?.nextSibling?.textContent.trim() || "";
    editModal.style.display = "flex";
});

function getStatusClass(dateValue) {
    const today = new Date();
    const selectedDate = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return "expired";
    } else if (selectedDate.getTime() === today.getTime()) {
        return "today";
    } else {
        return "upcoming";
    }
}

function saveMeet(meet) {
    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    meets.push(meet);
    localStorage.setItem("meets", JSON.stringify(meets));
}

function loadMeets() {
    let meets = JSON.parse(localStorage.getItem("meets")) || [];
    meets.forEach(meet => {
        renderMeet(meet);
        count = Math.max(count, meet.id);
    });
}

let detailsModal = document.getElementById("detailsModal");
let closeDetailsModal = document.getElementById("closeDetailsModal");
let detailTitle = document.getElementById("detailTitle");
let detailClient = document.getElementById("detailClient");
let detailDate = document.getElementById("detailDate");
let detailTime = document.getElementById("detailTime");
let detailPlace = document.getElementById("detailPlace");
let detailManager = document.getElementById("detailManager");
let detailComment = document.getElementById("detailComment");

closeDetailsModal.onclick = () => {
    detailsModal.style.display = "none";
};

let burgerToggle = document.getElementById('burger-toggle');
let navMenu = document.getElementById('nav-menu');
let navLinks = navMenu.querySelectorAll('a');

    navLinks.forEach(link => {
    link.addEventListener('click', () => {
    burgerToggle.checked = false; 
    });
})

let contactBtn = document.getElementById('contactBtn');
let contactModal = document.getElementById('contactModal');
let modalClose = document.getElementById('modalClose');

contactBtn.addEventListener('click', function (e) {
    e.preventDefault(); 
    contactModal.style.display = 'flex';  

    if (burgerToggle) {
        burgerToggle.checked = false; 
    }
});

modalClose.addEventListener('click', function () {
    contactModal.style.display = 'none';  
});

window.addEventListener('click', function (e) {
    if (e.target === contactModal) { 
        contactModal.style.display = 'none'; 
    }
});
console.log();
