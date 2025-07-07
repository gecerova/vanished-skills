const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const filterButtons = document.querySelectorAll('.filters button');

let allData = []; // Stores all fetched data
const loadingMessage = document.getElementById('loading-message');

// Search Bar & No Results Elements
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

// Item Modal DOM Elements
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('.close-button'); // Primary close button for itemModal
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');

// NEW: About Us Modal DOM Elements
const aboutUsModal = document.getElementById('aboutUsModal');
const openAboutUsModalButton = document.getElementById('openAboutUsModal'); // The 'About Us' button in the header
const aboutUsCloseButton = document.getElementById('aboutUsCloseButton'); // Close button specific to About Us modal


// State Variables for current filters
let currentCategoryFilter = 'all'; // Default to 'all'
let currentSearchTerm = ''; // Default to empty search

// Event listeners for filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategoryFilter = btn.dataset.filter; // Update current category filter
    applyFiltersAndRender(); // Re-render with new category filter and existing search term
  });
});

// Event listener for search input
searchInput.addEventListener('input', () => {
    currentSearchTerm = searchInput.value.toLowerCase().trim(); // Update current search term
    applyFiltersAndRender(); // Re-render with existing category filter and new search term
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
    
    // Initial render with current filters (which are 'all' and '')
    applyFiltersAndRender(); 
  })
  .catch(e => {
    console.error('Fetch error:', e);
    // Display an error message if fetch fails
    loadingMessage.innerText = 'Failed to load professions. Please try again later.';
  });


// Central function to apply all filters and render
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
    // Only show if filteredData.length is 0 AND there's an active filter or search term
    if (filteredData.length === 0 && (currentCategoryFilter !== 'all' || currentSearchTerm !== '')) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}


// Item Modal Functions
function openItemModal(item) { // Renamed for clarity
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';
    modalDescription.innerText = item.Description || 'No description available.';
    
    itemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeItemModal() { // Renamed for clarity
    itemModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore background scrolling
}

// Event listeners for close button and clicking outside the item modal
closeButton.addEventListener('click', closeItemModal);
itemModal.addEventListener('click', (event) => {
    if (event.target === itemModal) { // If clicked directly on the modal overlay
        closeItemModal();
    }
});


// Render function now accepts pre-filtered items
function render(itemsToRender) {
    grid.innerHTML = ''; // Clear the grid

    if (itemsToRender.length === 0) {
        // The noResultsMessage visibility is handled by applyFiltersAndRender()
        return; 
    }

    itemsToRender.forEach(item => {
        const div = document.createElement('div');
        div.className = 'entry';

        let descriptionContent = `<p>${item.Description || ''}</p>`; // Default: full description, handle undefined
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
            ${item.Image ? `<img src="${item.Image}" alt="${item.Entry || ''}">` : ''}
            <div class="content">
                <h2>${item.Entry || 'No Title'}</h2>
                <p><strong>Category:</strong> ${item.Category || 'Unknown'}</p>
                ${descriptionContent}
            </div>`;
        
        // Add click listener to each entry card to open the item modal
        div.addEventListener('click', () => {
            openItemModal(item); // Call the specific item modal function
        });

        grid.appendChild(div);
    });

    // Add event listeners for Read More/Read Less buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from triggering modal
            const parentContent = this.closest('.content');
            if (parentContent) {
                parentContent.querySelector('.truncated-desc').style.display = 'none';
                parentContent.querySelector('.full-desc').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.read-less-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent card click from triggering modal
            const parentContent = this.closest('.content');
            if (parentContent) {
                parentContent.querySelector('.truncated-desc').style.display = 'block';
                parentContent.querySelector('.full-desc').style.display = 'none';
            }
        });
    });
}


// Feedback Modal JS
const feedbackModal = document.getElementById('feedbackModal');
const openFeedbackModalBtn = document.getElementById('openFeedbackModal');
const feedbackCloseButton = document.querySelector('.feedback-close-button');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');

if (openFeedbackModalBtn) {
    openFeedbackModalBtn.addEventListener('click', () => {
        feedbackModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

if (feedbackCloseButton) {
    feedbackCloseButton.addEventListener('click', () => {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore background scrolling
    });
}

if (feedbackModal) {
    feedbackModal.addEventListener('click', (event) => {
        if (event.target === feedbackModal) {
            feedbackModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Handle Form Submission (requires your specific Sheet.Best API URL for feedback)
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const feedback = document.getElementById('feedback').value;

        // !! IMPORTANT: Ensure this is your actual Sheet.Best API URL for the feedback sheet.
        const feedbackAPI = 'https://api.sheetbest.com/sheets/b49560c6-2bdb-469d-a297-2bc2398ebd96'; 

        try {
            const response = await fetch(feedbackAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, feedback, timestamp: new Date().toISOString() }),
            });

            if (response.ok) {
                feedbackMessage.style.display = 'block';
                feedbackMessage.style.color = 'green';
                feedbackMessage.innerText = 'Your feedback was sent successfully!';
                feedbackForm.reset(); // Clear the form
                
                // Hide message and close modal after a few seconds
                setTimeout(() => {
                    feedbackMessage.style.display = 'none';
                    feedbackModal.style.display = 'none'; // Close modal after submission
                    document.body.style.overflow = '';
                }, 2000); 
            } else {
                throw new Error('Failed to send feedback');
            }
        } catch (error) {
            feedbackMessage.style.display = 'block';
            feedbackMessage.style.color = 'red';
            feedbackMessage.innerText = 'An error occurred while sending feedback. Please try again.';
            console.error('Feedback error:', error);
        }
    });
}

// NEW: About Us Modal Logic
if (openAboutUsModalButton) {
    openAboutUsModalButton.addEventListener('click', () => {
        aboutUsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

if (aboutUsCloseButton) {
    aboutUsCloseButton.addEventListener('click', () => {
        aboutUsModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore background scrolling
    });
}

if (aboutUsModal) {
    aboutUsModal.addEventListener('click', (event) => {
        if (event.target === aboutUsModal) {
            aboutUsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}
