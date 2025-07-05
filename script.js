const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const buttons = document.querySelectorAll('.filters button');

let allData = [];
// --- START: Added for Loading Message ---
const loadingMessage = document.getElementById('loading-message'); 
// --- END: Added for Loading Message ---

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});

// --- START: Modified Fetch Block for Loading Message ---
// Show loading message before fetching data
loadingMessage.style.display = 'block'; 

fetch(API)
  .then(r => r.json())
  .then(data => {
    allData = data;
    // Hide loading message after data is successfully loaded
    loadingMessage.style.display = 'none'; 
    render('all');
  })
  .catch(e => {
    console.error('Fetch error:', e);
    // Display an error message if fetch fails
    loadingMessage.innerText = 'Failed to load professions. Please try again later.'; 
  });
// --- END: Modified Fetch Block for Loading Message ---


function render(filter) {
  // Clear the grid before rendering new items (this will also clear the loading message if it's there)
  grid.innerHTML = ''; 
  allData
    .filter(item => filter === 'all' || item.Category === filter)
    .forEach(item => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `
        ${item.Image ? `<img src="${item.Image}" alt="${item.Entry}">` : ''}
        <div class="content">
          <h2>${item.Entry}</h2>
          <p><strong>Category:</strong> ${item.Category}</p>
          ${item.Description ? `<p>${item.Description}</p>` : ''}
        </div>`;
      grid.appendChild(div);
    });
}
