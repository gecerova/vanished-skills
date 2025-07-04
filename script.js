const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
const buttons = document.querySelectorAll('.filters button');

let allData = [];

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
});

fetch(API)
  .then(r => r.json())
  .then(data => {
    allData = data;
    render('all');
  })
  .catch(e => console.error('Fetch error:', e));

function render(filter) {
  grid.innerHTML = '';
  allData
    .filter(item => filter==='all' || item.Category === filter)
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
