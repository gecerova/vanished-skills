const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const filterButtons = document.querySelectorAll('.filters button'); // Renamed to filterButtons for clarity

let allData = [];
const loadingMessage = document.getElementById('loading-message');

// --- NEW: Modal DOM Elements ---
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('.close-button');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
// --- END NEW ---

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});

// Show loading message before fetching data
loadingMessage.style.display = 'block';

fetch(API)
  .then(r => r.json())
  .then(data => {
    allData = data;
    // Sort data by Entry (Profession Name) alphabetically after fetching
    allData.sort((a, b) => a.Entry.localeCompare(b.Entry)); 

    // Hide loading message after data is successfully loaded
    loadingMessage.style.display = 'none';
    render('all'); // Render all items initially
  })
  .catch(e => {
    console.error('Fetch error:', e);
    // Display an error message if fetch fails
    loadingMessage.innerText = 'Failed to load professions. Please try again later.';
  });


// --- NEW: Modal Functions ---
function openModal(item) {
    modalImage.src = item.Image || ''; // Use empty string if no image to avoid broken icon
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';
    modalCategory.innerText = item.Category || 'Unknown';
    modalDescription.innerText = item.Description || 'No description available.';
    
    itemModal.style.display = 'flex'; // Use 'flex' to enable centering via CSS
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    itemModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore background scrolling
}

// Event listeners for close button and clicking outside the modal
closeButton.addEventListener('click', closeModal);
itemModal.addEventListener('click', (event) => {
    // If clicked directly on the modal overlay (not inside modal-content)
    if (event.target === itemModal) {
        closeModal();
    }
});
// --- END NEW ---


function render(filter) {
    // Clear the grid before rendering new items (this will also clear the loading message if it's there)
    grid.innerHTML = '';
    
    // Filter the data based on the selected category
    allData
        .filter(item => filter === 'all' || item.Category === filter)
        .forEach(item => {
            const div = document.createElement('div');
            div.className = 'entry';

            let descriptionContent = `<p>${item.Description}</p>`; // Default: full description
            if (item.Description) {
                const words = item.Description.split(' ');
                const maxWords = 30; // Adjust this number for shorter/longer snippets
                if (words.length > maxWords) {
                    const truncatedText = words.slice(0, maxWords).join(' ') + '...';
                    descriptionContent = `
                        <p class="truncated-desc">${truncatedText} <button class="read-more-btn">Read More</button></p>
                        <p class="full-desc" style="display: none;">${item.Description} <button class="read-less-btn">Read Less</button></p>
                    `;
                }
            }

            div.innerHTML = `
                ${item.Image ? `<img src="${item.Image}" alt="${item.Entry}">` : ''}
                <div class="content">
                    <h2>${item.Entry}</h2>
                    <p><strong>Category:</strong> ${item.Category}</p>
                    ${descriptionContent}
                </div>`;
            
            // --- NEW: Add click listener to each entry card to open the modal ---
            div.addEventListener('click', () => {
                openModal(item); // Pass the entire item object to openModal
            });
            // --- END NEW ---

            grid.appendChild(div);
        });

    // Add event listeners for Read More/Read Less buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from triggering modal
            const parentContent = this.closest('.content');
            if (parentContent) { // Ensure parentContent exists
                parentContent.querySelector('.truncated-desc').style.display = 'none';
                parentContent.querySelector('.full-desc').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.read-less-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from triggering modal
            const parentContent = this.closest('.content');
            if (parentContent) { // Ensure parentContent exists
                parentContent.querySelector('.truncated-desc').style.display = 'block';
                parentContent.querySelector('.full-desc').style.display = 'none';
            }
        });
    });
}


const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const name = card.querySelector('h2').textContent.toLowerCase();

    if (name.includes(filter)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
