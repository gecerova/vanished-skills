const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const filterButtons = document.querySelectorAll('.filters button[data-filter]'); 

let allData = [];
const loadingMessage = document.getElementById('loading-message');
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('#itemModal .close-button');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const aboutUsModal = document.getElementById('aboutUsModal');
const openAboutUsModalButton = document.getElementById('openAboutUsModal');
const aboutUsCloseButton = document.getElementById('aboutUsCloseButton');

let currentCategoryFilter = 'all';
let currentSearchTerm = '';

filterButtons.forEach(btn => {
  btn.addEventListener('click', (event) => {
    console.log(`Filter button clicked: ${btn.dataset.filter}`);
    
    if (btn.id === 'openAboutUsModal') {
        event.preventDefault();
        return;
    }

    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategoryFilter = btn.dataset.filter;
    applyFiltersAndRender();
  });
});

searchInput.addEventListener('input', () => {
    currentSearchTerm = searchInput.value.toLowerCase().trim();
    applyFiltersAndRender();
});

loadingMessage.style.display = 'block';

fetch(API)
  .then(r => r.json())
  .then(data => {
    allData = data;
    allData.sort((a, b) => a.Entry.localeCompare(b.Entry)); 
    loadingMessage.style.display = 'none';
    applyFiltersAndRender(); 
  })
  .catch(e => {
    console.error('Fetch error:', e);
    loadingMessage.innerText = 'Failed to load professions. Please try again later.';
  });

function applyFiltersAndRender() {
    let filteredData = allData;

    if (currentCategoryFilter !== 'all') {
        filteredData = filteredData.filter(item => item.Category === currentCategoryFilter);
    }

    if (currentSearchTerm) {
        filteredData = filteredData.filter(item => 
            (item.Entry && item.Entry.toLowerCase().includes(currentSearchTerm)) ||
            (item.Description && item.Description.toLowerCase().includes(currentSearchTerm))
        );
    }

    render(filteredData);

    if (filteredData.length === 0 && (currentCategoryFilter !== 'all' || currentSearchTerm !== '')) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}

function openItemModal(item) {
    console.log("DEBUG: Entry clicked:", item.Entry);
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';

    let descriptionHTML = item.Description || 'No description available.';

    if (item.Entry === "Architectural Decorative Painting (Nakkaşlık)") {
        descriptionHTML += `
            <hr>
            <h3>📍 Notable Location: Nakkaşhane, Topkapı Palace (Istanbul)</h3>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.213496747912!2d28.9786761472534!3d41.012754172973946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba5db5de8bcb%3A0x1cb2d0636f255db6!2sTopkap%C4%B1%20Palace!5e0!3m2!1str!2str!4v1720632588000!5m2!1str!2str" 
                width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
            </iframe>
            <h3>👤 Famous Craftsman: Nakkaş Osman</h3>
            <p>
                Nakkaş Osman was the chief Ottoman court painter in the 16th century. 
                He is known for his work on imperial manuscripts such as the <em>Zafername</em> and <em>Siyer-i Nabi</em>. 
                His stylistic clarity and detailed architectural decoration left a lasting legacy in Ottoman miniature and palace design.
            </p>
        `;
    }

    modalDescription.innerHTML = descriptionHTML;
    itemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeItemModal() {
    itemModal.style.display = 'none';
    document.body.style.overflow = '';
}

if (closeButton) {
    closeButton.addEventListener('click', closeItemModal);
}
if (itemModal) {
    itemModal.addEventListener('click', (event) => {
        if (event.target === itemModal) {
            closeItemModal();
        }
    });
}

function render(itemsToRender) {
    grid.innerHTML = '';

    if (itemsToRender.length === 0) return;

    itemsToRender.forEach(item => {
        const div = document.createElement('div');
        div.className = 'entry';

        let descriptionContent = `<p>${item.Description || ''}</p>`;
        if (item.Description) {
            const words = item.Description.split(' ');
            const maxWords = 30;
            if (words.length > maxWords) {
                const truncatedText = words.slice(0, maxWords).join(' ') + '...';
                descriptionContent = `
                    <p class="truncated-desc">${truncatedText} <button class="read-more-btn">Read More</button></p>
                    <p class="full-desc" style="display: none;">${item.Description} <button class="read-less-btn">Read Less</button></p>
                `;
            }
        }

        div.innerHTML = `
            ${item.Image ? `<img src="${item.Image}" alt="${item.Entry || ''}">` : ''}
            <div class="content">
                <h2>${item.Entry || 'No Title'}</h2>
                <p><strong>Category:</strong> ${item.Category || 'Unknown'}</p>
                ${descriptionContent}
            </div>`;

        div.addEventListener('click', () => {
            openItemModal(item);
        });

        grid.appendChild(div);
    });

    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const parentContent = this.closest('.content');
            if (parentContent) {
                parentContent.querySelector('.truncated-desc').style.display = 'none';
                parentContent.querySelector('.full-desc').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.read-less-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const parentContent = this.closest('.content');
            if (parentContent) {
                parentContent.querySelector('.truncated-desc').style.display = 'block';
                parentContent.querySelector('.full-desc').style.display = 'none';
            }
        });
    });
}
