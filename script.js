const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const filterButtons = document.querySelectorAll('.filters button');

let allData = []; // Stores all fetched data
const loadingMessage = document.getElementById('loading-message');

// --- NEW: Search Bar & No Results Elements ---
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

// --- NEW: Modal DOM Elements ---
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('.close-button');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
// modalCategory is removed from HTML, so we don't need its JS reference
const modalDescription = document.getElementById('modalDescription');
// --- END NEW ---

// --- NEW: State Variables for current filters ---
let currentCategoryFilter = 'all'; // Default to 'all'
let currentSearchTerm = ''; // Default to empty search
// --- END NEW ---


// Event listeners for filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategoryFilter = btn.dataset.filter; // Update current category filter
    applyFiltersAndRender(); // Re-render with new category filter and existing search term
  });
});

// --- NEW: Event listener for search input ---
searchInput.addEventListener('input', () => {
    currentSearchTerm = searchInput.value.toLowerCase().trim(); // Update current search term
    applyFiltersAndRender(); // Re-render with existing category filter and new search term
});
// --- END NEW ---


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
    
    // Initial render with current filters (which are 'all' and '')
    applyFiltersAndRender(); 
  })
  .catch(e => {
    console.error('Fetch error:', e);
    // Display an error message if fetch fails
    loadingMessage.innerText = 'Failed to load professions. Please try again later.';
  });


// --- NEW: Central function to apply all filters and render ---
function applyFiltersAndRender() {
    let filteredData = allData;

    // 1. Apply category filter
    if (currentCategoryFilter !== 'all') {
        filteredData = filteredData.filter(item => item.Category === currentCategoryFilter);
    }

    // 2. Apply search filter
    if (currentSearchTerm) {
        filteredData = filteredData.filter(item => 
            (item.Entry && item.Entry.toLowerCase().includes(currentSearchTerm)) ||
            (item.Description && item.Description.toLowerCase().includes(currentSearchTerm))
        );
    }

    // Render the filtered data
    render(filteredData);

    // Show/hide no results message
    if (filteredData.length === 0 && (currentCategoryFilter !== 'all' || currentSearchTerm !== '')) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}
// --- END NEW ---


// --- NEW: Modal Functions ---
function openModal(item) {
    modalImage.src = item.Image || ''; // Use empty string if no image to avoid broken icon
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';
    // modalCategory.innerText = item.Category || 'Unknown'; // This line is removed as per request
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


// --- MODIFIED: Render function now accepts pre-filtered items ---
function render(itemsToRender) {
    // Clear the grid before rendering new items
    grid.innerHTML = '';
    
    // Check if there are items to render
    if (itemsToRender.length === 0) {
        // The noResultsMessage visibility is handled by applyFiltersAndRender()
        return; 
    }

    itemsToRender.forEach(item => {
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
                <p><strong>Category:</strong> ${item.Category}</p> ${descriptionContent}
            </div>`;
        
        // Add click listener to each entry card to open the modal
        div.addEventListener('click', () => {
            openModal(item); // Pass the entire item object to openModal
        });

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
