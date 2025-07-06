const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const filterButtons = document.querySelectorAll('.filters button');
const searchInput = document.getElementById('searchInput');
const loadingMessage = document.getElementById('loading-message');

// Modal DOM Elements
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('.close-button');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');

let allData = [];

// Ensure modal is hidden on page load
document.addEventListener('DOMContentLoaded', () => {
    itemModal.style.display = 'none';
});

// Filter button event listeners
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.filter);
    });
});

// Fetch data
loadingMessage.style.display = 'block';
fetch(API)
    .then(r => r.json())
    .then(data => {
        allData = data;
        allData.sort((a, b) => a.Entry.localeCompare(b.Entry));
        loadingMessage.style.display = 'none';
        render('all');
    })
    .catch(e => {
        console.error('Fetch error:', e);
        loadingMessage.innerText = 'Failed to load professions. Please try again later.';
    });

// Modal Functions
function openModal(item) {
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';
    modalCategory.innerText = item.Category || 'Unknown';
    modalDescription.innerText = item.Description || 'No description available.';
    itemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    itemModal.style.display = 'none';
    document.body.style.overflow = '';
}

closeButton.addEventListener('click', closeModal);
itemModal.addEventListener('click', (event) => {
    if (event.target === itemModal) {
        closeModal();
    }
});

// Render function
function render(filter) {
    grid.innerHTML = '';
    allData
        .filter(item => filter === 'all' || item.Category === filter)
        .forEach(item => {
            const div = document.createElement('div');
            div.className = 'entry';

            let descriptionContent = `<p>${item.Description}</p>`;
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
                ${item.Image ? `<img src="${item.Image}" alt="${item.Entry}">` : ''}
                <div class="content">
                    <h2>${item.Entry}</h2>
                    <p><strong>Category:</strong> ${item.Category}</p>
                    ${descriptionContent}
                </div>`;
            
            div.addEventListener('click', () => {
                openModal(item);
            });

            grid.appendChild(div);
        });

    // Add event listeners for Read More/Read Less buttons
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

// Search functionality
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const entries = document.querySelectorAll('.entry');

    entries.forEach(entry => {
        const name = entry.querySelector('h2').textContent.toLowerCase();
        if (name.includes(filter)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
});

});

// Feedback Modal Elements
const feedbackModal = document.getElementById('feedbackModal');
const openFeedbackModal = document.getElementById('openFeedbackModal');
const feedbackCloseButton = document.querySelector('.feedback-close-button');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');

// Open Feedback Modal
openFeedbackModal.addEventListener('click', () => {
  feedbackModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

// Close Feedback Modal
feedbackCloseButton.addEventListener('click', () => {
  feedbackModal.style.display = 'none';
  document.body.style.overflow = '';
});

// Close modal when clicking outside
feedbackModal.addEventListener('click', (event) => {
  if (event.target === feedbackModal) {
    feedbackModal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// Handle Form Submission
feedbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const feedback = document.getElementById('feedback').value;

  const feedbackAPI = 'YOUR_SHEETBEST_API_URL'; // https://api.sheetbest.com/sheets/b49560c6-2bdb-469d-a297-2bc2398ebd96

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
      feedbackForm.reset();
      setTimeout(() => {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = '';
        feedbackMessage.style.display = 'none';
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