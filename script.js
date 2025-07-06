const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const buttons = document.querySelectorAll('.filters button');

let allData = [];
const loadingMessage = document.getElementById('loading-message'); 

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
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
    // Hide loading message after data is successfully loaded
    loadingMessage.style.display = 'none'; 
    render('all');
  })
  .catch(e => {
    console.error('Fetch error:', e);
    // Display an error message if fetch fails
    loadingMessage.innerText = 'Failed to load professions. Please try again later.'; 
  });


function render(filter) {
    // Clear the grid before rendering new items (this will also clear the loading message if it's there)
    grid.innerHTML = ''; 
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
                        <p class="truncated-desc">${truncatedText} <button class="read-more-btn" data-full-text="${encodeURIComponent(item.Description)}">Read More</button></p>
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
            grid.appendChild(div);
        });

    // Add event listeners for Read More/Read Less buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parentContent = this.closest('.content');
            if (parentContent) { // Ensure parentContent exists
                parentContent.querySelector('.truncated-desc').style.display = 'none';
                parentContent.querySelector('.full-desc').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.read-less-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parentContent = this.closest('.content');
            if (parentContent) { // Ensure parentContent exists
                parentContent.querySelector('.truncated-desc').style.display = 'block';
                parentContent.querySelector('.full-desc').style.display = 'none';
            }
        });
    });
}
