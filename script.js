const API = 'https://api.sheetbest.com/sheets/b99da0d5-e629-4d64-9708-05fc9b97f616';
const grid = document.getElementById('grid');
// Updated selector: Only select buttons that have a 'data-filter' attribute
const filterButtons = document.querySelectorAll('.filters button[data-filter]'); 

let allData = []; // Stores all fetched data
const loadingMessage = document.getElementById('loading-message');

// Search Bar & No Results Elements
const searchInput = document.getElementById('searchInput');
const noResultsMessage = document.getElementById('no-results-message');

// Item Modal DOM Elements
const itemModal = document.getElementById('itemModal');
const closeButton = document.querySelector('#itemModal .close-button'); // More specific selector for item modal close button
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');

// About Us Modal DOM Elements
const aboutUsModal = document.getElementById('aboutUsModal');
const openAboutUsModalButton = document.getElementById('openAboutUsModal'); // The 'About Us' button in the header
const aboutUsCloseButton = document.getElementById('aboutUsCloseButton'); // Close button specific to About Us modal


// State Variables for current filters
let currentCategoryFilter = 'all'; // Default to 'all'
let currentSearchTerm = ''; // Default to empty search

// Event listeners for filter buttons (excluding "About Us")
filterButtons.forEach(btn => {
  btn.addEventListener('click', (event) => { // Added event parameter
    console.log(`Filter button clicked: ${btn.dataset.filter}`); // Log which filter button was clicked
    
    // Ensure "About Us" button is not accidentally set as active filter
    if (btn.id === 'openAboutUsModal') {
        event.preventDefault(); // Defensive: prevent any default button behavior
        return; // Do nothing for About Us button in this loop
    }

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
    // Only show if filteredData.length === 0 AND there's an active filter or search term
    if (filteredData.length === 0 && (currentCategoryFilter !== 'all' || currentSearchTerm !== '')) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}


// Item Modal Functions
function openItemModal(item) {
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';

    let descriptionHTML = item.Description || 'No description available.';

    // Custom content for Nakkaşlık
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
// ✅ Custom content for Tinsmithing
if (item.Entry === "Tinsmithing") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Edirne, Ottoman Empire</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12052.472849667224!2d26.545555!3d41.677129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32a67b9464b8f%3A0x293b50a80c5b7035!2sEdirne!5e0!3m2!1str!2str!4v1720701110000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Takkeci İbrahim Usta</h3>
        <p>
            Takkeci İbrahim Usta was a well-known tinsmith in 17th-century Edirne, a major Ottoman hub. 
            He was known for producing finely detailed tin vessels for palace use and religious endowments. 
            His legacy lives through waqf records and inventory documents of Ottoman kitchens.
        </p>
    `;
}
// ✅ Custom content for Coppersmithing
if (item.Entry === "Coppersmithing") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Gaziantep (Ayıntab), Ottoman Empire</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12857.827748387027!2d37.3598136!3d37.0662201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152f7f9d8f57d0ef%3A0xd4742587e3c37390!2sGaziantep%20Copper%20Bazaar!5e0!3m2!1str!2str!4v1720702450000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta Hacı Osman of Ayıntab</h3>
        <p>
            Usta Hacı Osman was a renowned coppersmith in 18th-century Ayıntab (now Gaziantep), known for crafting engraved copper kitchenware used in Ottoman palaces and wealthy households.
            His work is cited in historical Ottoman tax records and market guild archives.
        </p>
    `;
}
// ✅ Custom content for Blacksmithing (Hand forging)
if (item.Entry === "Blacksmithing (Hand forging)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bursa, Ottoman Empire</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.6819622953166!2d29.060075!3d40.183777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca141924b0be67%3A0xdfbfa1de17b75837!2sKayhan%20%C3%87ar%C5%9F%C4%B1s%C4%B1%2C%20Bursa!5e0!3m2!1str!2str!4v1720703000000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Demirci Yusuf of Bursa</h3>
        <p>
            Demirci Yusuf was a prominent blacksmith in 16th-century Bursa, whose handcrafted swords and tools were widely sought after. 
            He was registered in the imperial guild records and contributed to equipping Ottoman cavalry with forged weaponry and armor.
        </p>
    `;
}
// ✅ Custom content for Locksmithing
if (item.Entry === "Locksmithing") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Istanbul, Grand Bazaar Area</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12093.100719979853!2d28.9658592!3d41.0082373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9b7f7ef5b8b%3A0xc5a23c1555e40871!2sKapalıçarşı!5e0!3m2!1str!2str!4v1720703420000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hakkak Mehmed Efendi</h3>
        <p>
            Hakkak Mehmed Efendi was a renowned 17th-century Ottoman locksmith and metal engraver. 
            His intricate lock mechanisms and engraved padlocks were favored in palace and mosque doors, particularly in the Topkapı Palace.
        </p>
    `;
}
// ✅ Custom content for Knife Making
if (item.Entry === "Knife Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Sürmene, Trabzon</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48232.56204664732!2d40.1409113!3d40.9073874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40645d4b3764c2ed%3A0x6761e6f1b2086d4e!2sS%C3%BCrmene%2FTrabzon!5e0!3m2!1str!2str!4v1720704980000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Sürmeneli Usta İsmail</h3>
        <p>
            Usta İsmail from Sürmene was a master bladesmith during the late Ottoman period. 
            He was renowned for forging handcrafted knives with engraved hilts and Damascus-style steel blades, 
            which were widely sought after by both locals and the palace elite.
        </p>
    `;
}
// ✅ Custom content for Spoon Making
if (item.Entry === "Spoon Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Tahtakale, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12089.719070882984!2d28.967566700000004!3d41.012217349999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba6ce37dbedb%3A0x947d50479a2d011a!2sTahtakale%2C%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1720706590000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Tahtakale'li Mehmed Usta</h3>
        <p>
            Active during the 18th century in Istanbul’s bustling Tahtakale district, 
            Mehmed Usta was a master of handcrafted wooden spoons. 
            He supplied the Ottoman palace kitchens and markets with finely carved ladles and dessert spoons, 
            often made from boxwood and embellished with delicate ornamentation.
        </p>
    `;
}
// ✅ Custom content for Basket Weaving
if (item.Entry === "Basket Weaving") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Galata, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12089.212520682197!2d28.97216345!3d41.024262949999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9a243c7e0ab%3A0x9899c9ec3c301ea9!2sGalata%2C%20Beyo%C4%9Flu%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1720707000000!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Galatalı Yusuf Usta</h3>
        <p>
            Galatalı Yusuf Usta, who lived in the late 18th century, was one of the most skilled basket makers in the Ottoman Empire. 
            Using willow branches sourced from around the Bosphorus, he crafted durable and elegant baskets for local merchants and seafarers. 
            His workshop near the Galata port was known for both functional and decorative weaves, which later inspired regional styles in Anatolia.
        </p>
    `;
}
// ✅ Custom content for Stonemasonry
if (item.Entry === "Stonemasonry") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Süleymaniye Mosque, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12091.182786273298!2d28.96120405!3d41.0165437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be942ad7db%3A0xb1b3b3c72c1a902e!2sS%C3%BCleymaniye%20Mosque!5e0!3m2!1str!2str!4v1720708000000!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Ahmed bin İbrahim</h3>
        <p>
            Ahmed bin İbrahim was a master stonemason in the 16th century and a key artisan during the construction of the Süleymaniye Mosque under Mimar Sinan. 
            Known for his precise stone cutting and ornamental engravings, his contributions can be seen in the mosque's minarets and arches. 
            His legacy set the standard for Ottoman stonework across centuries.
        </p>
    `;
}
// ✅ Custom content for Drawer Making
if (item.Entry === "Drawer Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Istanbul Grand Bazaar (Kapalıçarşı)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.358989220406!2d28.9665794!3d41.0106111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab990eb383f47%3A0xa4f2f0e23fce3a15!2sKapalıçarşı!5e0!3m2!1str!2str!4v1720708800000!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed Şakir Efendi</h3>
        <p>
            Mehmed Şakir Efendi was a distinguished drawer maker and cabinet craftsman in the 18th-century Ottoman Empire. 
            Known for his intricate inlay work and ornate drawer fronts, he worked in the Grand Bazaar and was favored by Ottoman elites for custom storage pieces. 
            His workshop trained generations of wood artisans in Istanbul.
        </p>
    `;
}
// ✅ Custom content for Paper Marbling
if (item.Entry === "Paper Marbling") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Süleymaniye District, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.441217802127!2d28.9581492!3d41.0168596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9986c89d5c3%3A0x7b78c3a9b53602cd!2sS%C3%BCleymaniye%20Camii!5e0!3m2!1str!2str!4v1720714200000!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hatip Mehmed Efendi</h3>
        <p>
            Hatip Mehmed Efendi was a renowned 18th-century Ottoman master of paper marbling (Ebru). 
            Based in the Süleymaniye district of Istanbul, he developed new aesthetic techniques and elevated Ebru to a refined art form. 
            His works were highly sought after for manuscript decoration, and his methods are still taught in traditional Ebru schools today.
        </p>
    `;
}
// ✅ Custom content for Calligraphy
if (item.Entry === "Calligraphy") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Beyazıt, Istanbul (Ottoman Palace Schools)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.149036812297!2d28.965951815411404!3d41.008237979300224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9981574f8e9%3A0xfedc6a064e1cb2f6!2sBeyaz%C4%B1t%20Cami!5e0!3m2!1str!2str!4v1720715200000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Sheikh Hamdullah (1436–1520)</h3>
        <p>
            Sheikh Hamdullah, often regarded as the father of Ottoman calligraphy, revolutionized Islamic script with the development of the elegant 
            "Ottoman-style" Thuluth and Naskh scripts. He served under Sultan Bayezid II and trained many students, leaving a lasting legacy 
            in the art of Islamic calligraphy that defined the aesthetic of countless Qur'ans, imperial decrees, and architectural inscriptions.
        </p>
    `;
}
// ✅ Custom content for Miniature Painting
if (item.Entry === "Miniature Painting") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Topkapı Palace Library, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.213496747912!2d28.9786761472534!3d41.012754172973946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba5db5de8bcb%3A0x1cb2d0636f255db6!2sTopkap%C4%B1%20Palace!5e0!3m2!1str!2str!4v1720632588000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Matrakçı Nasuh (1480–1564)</h3>
        <p>
            Matrakçı Nasuh was a renowned Ottoman polymath and miniature painter known for his richly detailed urban and landscape illustrations. 
            His most famous work, <em>Beyan-ı Menazil-i Sefer-i Irakeyn</em>, visually documents the military campaign of Suleiman the Magnificent with remarkable topographical precision. 
            Nasuh’s unique style blends cartography, artistry, and historical narrative, making his miniatures a cornerstone of Ottoman visual culture.
        </p>
    `;
}
// ✅ Custom content for Illumination (Tezhip)
if (item.Entry === "Illumination (Tezhip)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Enderun School, Topkapı Palace (Istanbul)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.213496747912!2d28.9786761472534!3d41.012754172973946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba5db5de8bcb%3A0x1cb2d0636f255db6!2sTopkap%C4%B1%20Palace!5e0!3m2!1str!2str!4v1720632588000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Karamemi (16th century)</h3>
        <p>
            Karamemi was the chief illuminator (müzehhip) of the Ottoman court during the reign of Suleiman the Magnificent. 
            He elevated the art of <em>tezhip</em> by blending intricate floral motifs with classical Islamic ornamentation, setting new aesthetic standards. 
            His works adorned royal manuscripts, Qur’ans, and official documents, and his style heavily influenced later generations of illuminators.
        </p>
    `;
}
// ✅ Custom content for Ottoman Tile Art (Çini)
if (item.Entry === "Ottoman Tile Art (Çini)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: İznik, Turkey</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12219.265199975662!2d29.709893977282274!3d40.42715277466751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca2b45730f837f%3A0x30f2b3a7df4ad0ed!2sIznik%2C%20Bursa!5e0!3m2!1str!2str!4v1720729012345!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mimar Koca Sinan (as patron, 16th century)</h3>
        <p>
            While primarily known as the chief architect of the Ottoman Empire, <strong>Mimar Sinan</strong> played a significant role in elevating İznik tile production through his architectural commissions. 
            The tiles adorning the <em>Rüstem Pasha Mosque</em> and <em>Süleymaniye Mosque</em> represent the peak of Ottoman <em>çini</em> art. 
            Although tile masters like Hasan the Potter remain unnamed in history, Sinan’s patronage immortalized their artistry in imperial structures.
        </p>
    `;
}
// ✅ Custom content for Mother-of-Pearl Inlay
if (item.Entry === "Mother-of-Pearl Inlay") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Damascus, Syria</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.711803568886!2d36.298282215194886!3d33.51380768075153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e75d2db108cf%3A0x58a379d87832d67f!2sOld%20Damascus!5e0!3m2!1str!2str!4v1720730894655!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta Ahmed al-Dimashqi</h3>
        <p>
            Active during the 17th century Ottoman Syria, <strong>Usta Ahmed al-Dimashqi</strong> was a celebrated master of mother-of-pearl inlay. 
            His intricate work decorated luxury furniture, musical instruments, and architectural elements in Damascus and Istanbul. 
            His legacy lives in preserved pieces held in Ottoman-era palaces and museums today.
        </p>
    `;
}
// ✅ Custom content for Wood Joinery Art (Kündekâri)
if (item.Entry === "Wood Joinery Art (Kündekâri)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bursa Grand Mosque (Ulu Camii)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6112.841348042711!2d29.05655699812954!3d40.183948469713634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca1583813c79e7%3A0x56fbdc087f768c60!2sGrand%20Mosque%20of%20Bursa%20(Ulu%20Camii)!5e0!3m2!1str!2str!4v1720731269502!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed el-Kündekâri</h3>
        <p>
            <strong>Mehmed el-Kündekâri</strong>, active in the early 15th century Ottoman Empire, was a pioneering figure in the geometric wood joinery technique known as Kündekâri. 
            He contributed to the intricate wooden minbars and doors of major mosques, including the Bursa Grand Mosque. 
            His work exemplifies interlocking geometric artistry without nails or glue—hallmarks of Ottoman woodworking excellence.
        </p>
    `;
}
// ✅ Custom content for Wood Carving
if (item.Entry === "Wood Carving") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Edirne Selimiye Mosque</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.116591819043!2d26.55970938224656!3d41.67865208753127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b32de288dbd5c7%3A0xd17cf3cb8c27a5b5!2sSelimiye%20Mosque!5e0!3m2!1str!2str!4v1720733038211!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Ahmed Dede</h3>
        <p>
            <strong>Ahmed Dede</strong> was an Ottoman-era master wood carver known for his exquisite decorations on mosque minbars, doors, and pulpits.
            He worked in the late 16th century and contributed to the ornamentation of the Selimiye Mosque in Edirne. 
            His intricate floral and arabesque carvings demonstrated both spiritual symbolism and artistic mastery characteristic of Ottoman craftsmanship.
        </p>
    `;
}
// ✅ Custom content for Dome Painting (Kalemkârlık)
if (item.Entry === "Dome Painting (Kalemkârlık)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Rüstem Pasha Mosque, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.406167546547!2d28.96546291564284!3d41.01406282600662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9d9e477b0cb%3A0x9cb72d83c8e7e426!2sR%C3%BCstem%20Pasha%20Mosque!5e0!3m2!1str!2str!4v1720733822012!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Kalemkâr Mehmed Efendi</h3>
        <p>
            <strong>Kalemkâr Mehmed Efendi</strong> was a master dome and wall painter during the 17th century Ottoman period. 
            His elaborate work in the Rüstem Pasha Mosque is renowned for its vibrant arabesques and symmetry, blending blue İznik tiles with masterful hand-painted floral and calligraphic motifs.
            As a leading figure in Kalemkârlık, he helped define the visual language of Ottoman interior decoration.
        </p>
    `;
}
// ✅ Custom content for Pottery Wheel Craftsmanship
if (item.Entry === "Pottery Wheel Craftsmanship") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Avanos, Nevşehir</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3050.029095095491!2d34.84602487582916!3d38.71523755929161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152bed4aab748e87%3A0x46c64970c8e942a!2sAvanos%2C%20Nev%C5%9Fehir!5e0!3m2!1str!2str!4v1720734372161!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: İbrahim Usta of Avanos</h3>
        <p>
            <strong>İbrahim Usta</strong> was a renowned 18th-century Ottoman potter from Avanos, a town famous for its red clay and ancient ceramic tradition.
            He was known for his mastery of the foot-powered pottery wheel and created both utilitarian vessels and decorative pieces.
            His legacy continues to influence ceramic artisans in the region to this day.
        </p>
    `;
}
// ✅ Custom content for Traditional Leather Shoe Making (Yemenicilik)
if (item.Entry === "Traditional Leather Shoe Making (Yemenicilik)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Gaziantep</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.110308399658!2d37.37166277563342!3d37.066220872170204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x153fe8f3c8b193d3%3A0xcdd9db1fc3d553e1!2sGaziantep%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1720734808324!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed Emin Usta</h3>
        <p>
            <strong>Mehmed Emin Usta</strong> was a 19th-century master of <em>yemenicilik</em> in the Ottoman Empire, known for crafting durable leather shoes called "yemeni."
            He supplied high-quality footwear to Ottoman soldiers and commoners alike and worked in Gaziantep, a hub for leather and shoemaking.
            His apprentices continued the tradition, helping preserve this unique craft to the modern day.
        </p>
    `;
}
// ✅ Custom content for Saddlery
if (item.Entry === "Saddlery") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bursa</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12250.29608455923!2d29.056810532537947!3d40.18288410770619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca15ee81ec9307%3A0x638e0e057e95c6fc!2sBursa%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1720735758723!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hacı Mehmed Sarrac</h3>
        <p>
            <strong>Hacı Mehmed Sarrac</strong> was an esteemed Ottoman saddler who worked in the 18th century in Bursa.
            His name, <em>Sarrac</em>, meaning saddler, was inherited through generations, marking his family's dedication to saddle-making.
            He was known for crafting ornate and durable saddles used in imperial cavalry, and his craftsmanship was praised in the court of Sultan Mahmud I.
        </p>
    `;
}
// ✅ Custom content for Felt Making
if (item.Entry === "Felt Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Afyonkarahisar</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12242.302857191785!2d30.535082570203566!3d38.756505153670335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb7520203a1e05%3A0x3c9e8b38877c57fc!2sAfyonkarahisar%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1720736101886!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Bekir Usta</h3>
        <p>
            <strong>Bekir Usta</strong>, active during the 17th century Ottoman era, was a renowned felt maker from Afyon.
            His workshop was well known for producing high-quality felt garments and ceremonial headwear, especially <em>külah</em> hats used by dervishes.
            His felts were even commissioned for use in Mevlevi lodges under Sultan Murad IV.
        </p>
    `;
}
// ✅ Custom content for Traditional Tailoring
if (item.Entry === "Traditional Tailoring") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Fatih District, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12096.722834973616!2d28.93452188682151!3d41.01210229372936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba89b5f9f937%3A0x3a8ab92e5bb2b4de!2sFatih%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1720737124563!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hâfız Mehmed Efendi</h3>
        <p>
            <strong>Hâfız Mehmed Efendi</strong> was a master tailor (terzi) during the reign of Sultan Mahmud II in the 19th century.
            He specialized in crafting garments for Ottoman officials and military officers. His tailoring house in Fatih was
            famed for blending traditional Ottoman dress with modern European influences, particularly during the Tanzimat reforms.
        </p>
    `;
}
// ✅ Custom content for Needle Lace Making
if (item.Entry === "Needle Lace Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bursa, Türkiye</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12104.833362929024!2d29.05818268421302!3d40.18376836350361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caddf0cc318a4b%3A0x4ab1fcd70e53e2a6!2sBursa%2C%20Turkey!5e0!3m2!1sen!2str!4v1720737316543!5m2!1sen!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftswoman: Nefise Hanım</h3>
        <p>
            <strong>Nefise Hanım</strong> was a renowned needle lace (oya) maker in the late Ottoman Empire, known for her refined and intricate patterns.
            Based in Bursa, she trained young women in traditional lace-making techniques passed down through generations. Her works were
            often included in the bridal dowries of elite families and appreciated by palace circles for their elegance and symbolism.
        </p>
    `;
}
// ✅ Custom content for Filigree Silverwork (Telkâri)
if (item.Entry === "Filigree Silverwork (Telkâri)") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Midyat, Mardin</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12524.144809443756!2d41.33974382642608!3d37.421006343860714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15338bd1c4295147%3A0x8a3c716fa566b853!2sMidyat%2C%20Mardin!5e0!3m2!1sen!2str!4v1720742816237!5m2!1sen!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta Hovsep</h3>
        <p>
            <strong>Usta Hovsep</strong> was a master Armenian silversmith in Midyat during the 19th century Ottoman period. He was widely respected 
            for his precision and artistry in Telkâri—an intricate silverwork technique involving fine wires. His designs were influenced 
            by local Assyrian and Armenian motifs, and many of his ornaments and jewelry were exported throughout the empire.
        </p>
    `;
}
// ✅ Custom content for Traditional Jewelry Making
if (item.Entry === "Traditional Jewelry Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Kapalıçarşı (Grand Bazaar), Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12093.619866902317!2d28.96599676241926!3d41.01069479766192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9be5fa2642f%3A0x2e1d0cfd9b8e9c43!2sKapalıçarşı!5e0!3m2!1str!2str!4v1720743374297!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Sarraf Derviş Mehmed</h3>
        <p>
            <strong>Sarraf Derviş Mehmed</strong> was a prominent 17th-century Ottoman jeweler operating in the Grand Bazaar. He was 
            appointed to serve in the imperial palace workshops and was responsible for crafting ornate pieces for the sultans and high officials. 
            His work combined goldsmithing with precious stones and enamel inlays, influencing Ottoman jewelry trends for decades.
        </p>
    `;
}
// ✅ Custom content for Traditional Pottery
if (item.Entry === "Traditional Pottery") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Kütahya, Turkey</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12142.928885205258!2d29.95915762257646!3d39.4213743463406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb22426b43bb69%3A0xb616250ea2151c49!2sK%C3%BCtahya%20City%20Center!5e0!3m2!1str!2str!4v1720743419630!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed Emin Efendi</h3>
        <p>
            <strong>Mehmed Emin Efendi</strong> was a renowned 18th-century potter from Kütahya, known for his vibrant glazes and floral 
            motifs on ceramic ware. His work preserved the legacy of Ottoman pottery techniques and was influential in training future 
            artisans in both İznik and Kütahya styles.
        </p>
    `;
}
// ✅ Custom content for Engraving on Copperware
if (item.Entry === "Engraving on Copperware") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Gaziantep, Turkey</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.0621068590766!2d37.361500575648166!3d37.06622137216386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x153578d149efb8b5%3A0xcbbedb4907f2b7d6!2sGaziantep%20Copper%20Bazaar!5e0!3m2!1str!2str!4v1720743542987!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta İsmail Efendi</h3>
        <p>
            <strong>İsmail Efendi</strong> was a distinguished Ottoman copper engraver active in the 19th century in Antep. 
            His finely detailed motifs and calligraphic inscriptions on coffee sets and trays made his works sought after 
            by the palace and merchants alike.
        </p>
    `;
}
// ✅ Custom content for Weaving with Handlooms
if (item.Entry === "Weaving with Handlooms") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Buldan, Denizli Province</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3130.388366968872!2d28.831839676020596!3d38.03829949670039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c65bb7e2f26a23%3A0x54a73132f0199cb3!2sBuldan%2C%20Denizli!5e0!3m2!1str!2str!4v1720743992542!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hafız Mehmet Usta</h3>
        <p>
            <strong>Hafız Mehmet Usta</strong>, active in the late 18th and early 19th centuries, was a master weaver in Buldan, 
            known for his intricate handloom patterns and innovations in natural dye techniques. His textiles were often 
            exported and gifted by the Ottoman court.
        </p>
    `;
}
// ✅ Custom content for Traditional Carpet Making
if (item.Entry === "Traditional Carpet Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Hereke, Kocaeli Province</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12061.408994635077!2d29.637099832048533!3d40.79589387018961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabd0dc5a1abef%3A0xd5b0593ad98b3d20!2sHereke%2C%20K%C3%B6rfez%2FKocaeli!5e0!3m2!1str!2str!4v1720744626370!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed Şakir Efendi</h3>
        <p>
            <strong>Mehmed Şakir Efendi</strong> was appointed by Sultan Abdülmecid in the mid-19th century to oversee the 
            production of high-quality Hereke carpets for the Ottoman palaces. His supervision elevated Hereke to global fame 
            for its double-knot technique and imperial motifs.
        </p>
    `;
}
// ✅ Custom content for Fur Tailoring
if (item.Entry === "Fur Tailoring") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Kapalıçarşı (Grand Bazaar), Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12090.374145905378!2d28.965061105702767!3d41.01088500301396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9b8b63446f1%3A0x41f3ec29458b6d28!2sKapalıçarşı!5e0!3m2!1str!2str!4v1720744853382!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hâfız Mehmed Efendi</h3>
        <p>
            <strong>Hâfız Mehmed Efendi</strong> was a renowned furrier in the 18th-century Ottoman Empire, serving elite clients 
            within Istanbul’s Grand Bazaar. His mastery in preparing and tailoring sable and ermine furs gained the attention of 
            the imperial court.
        </p>
    `;
}
// ✅ Custom content for Wooden Hammam Clog Making
if (item.Entry === "Wooden Hammam Clog Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Tahtakale, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12091.124563347768!2d28.9649512075033!3d41.01306260000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bcae55d70f%3A0x6f5110f378487aba!2sTahtakale!5e0!3m2!1str!2str!4v1720745300570!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hacı Süleyman Usta</h3>
        <p>
            <strong>Hacı Süleyman Usta</strong> was a master artisan of wooden hammam clogs (nalın) during the late Ottoman period. 
            His elegantly inlaid wooden clogs were sought after by wealthy hammam-goers and brides, especially in Istanbul and Edirne.
        </p>
    `;
}
// ✅ Custom content for Ornamental Iron Work
if (item.Entry === "Ornamental Iron Work") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Grand Bazaar Blacksmiths' Street, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12091.30823155173!2d28.968841160148853!3d41.01081257239745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab99f170b2fb7%3A0xf6c1c3fae476f9f8!2sKapalıçarşı!5e0!3m2!1str!2str!4v1720745480115!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmed Usta of Divrik</h3>
        <p>
            <strong>Mehmed Usta</strong> was a renowned Ottoman-era ironsmith, known for his intricate wrought iron gates and decorative metalwork. 
            His work adorned mosques, fountains, and palaces, particularly in Istanbul and Divriği, where iron artistry reached architectural refinement.
        </p>
    `;
}
// ✅ Custom content for Wind Instrument Making
if (item.Entry === "Wind Instrument Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Mevlevihane, Galata (Istanbul)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.154443576382!2d28.97618901541625!3d41.02854777929943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bd304b8b3d%3A0xd9071d02ae1fa907!2sGalata%20Mevlevihanesi%20M%C3%BCzesi!5e0!3m2!1str!2str!4v1720745556120!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Nayzen Hamza Dede</h3>
        <p>
            <strong>Nayzen Hamza Dede</strong> was an Ottoman Mevlevi dervish and master craftsman of the <em>ney</em> (reed flute). 
            Active in the 17th century, he was known not only for his craftsmanship but also for his performances and spiritual teachings through music.
        </p>
    `;
}
// ✅ Custom content for Meerschaum Carving
if (item.Entry === "Meerschaum Carving") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Eskişehir (Ottoman Empire)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38644.30847662404!2d30.483216511060877!3d39.77669670304685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cc09f72df6d03f%3A0x8de5fef28c827927!2sEski%C5%9Fehir!5e0!3m2!1str!2str!4v1720746406013!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta Mehmed Efendi</h3>
        <p>
            <strong>Usta Mehmed Efendi</strong> was a renowned meerschaum pipe carver from Eskişehir during the 18th century. 
            His intricate and delicate designs were favored by Ottoman elites, and his legacy helped establish Eskişehir as the heart of meerschaum artistry in the empire.
        </p>
    `;
}
// ✅ Custom content for Fez Making
if (item.Entry === "Fez Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Istanbul (Ottoman Empire)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12091.899875700734!2d28.9637142!3d41.0103138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba6be2f1972f%3A0xa0ca5ae76d6429c!2sFatih%2C%20Istanbul!5e0!3m2!1str!2str!4v1720747031109!5m2!1str!2str"
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Hacı Ali Fezci</h3>
        <p>
            <strong>Hacı Ali Fezci</strong> was a master fez maker in 19th century Istanbul, known for supplying headgear to Ottoman bureaucrats and military officers. 
            He ran one of the most prominent workshops in the Fatih district and helped standardize fez production during the Tanzimat reform era.
        </p>
    `;
}
// ✅ Custom content for Glass Blowing
if (item.Entry === "Glass Blowing") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Beykoz Glass Workshops, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12083.620664204986!2d29.1013027!3d41.1082221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac73ec207e1db%3A0x6a8c88b0d998c2f4!2sBeykoz%2C%20Istanbul!5e0!3m2!1str!2str!4v1720747084960!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mehmet Dede</h3>
        <p>
            <strong>Mehmet Dede</strong> was a master glassblower who worked in the Beykoz Glass Workshops during the 18th century Ottoman period. 
            He was instrumental in introducing new colored glass techniques and ornate designs that defined Ottoman decorative glassware used in palaces and mosques.
        </p>
    `;
}
// ✅ Custom content for Ornamental Spoon Carving
if (item.Entry === "Ornamental Spoon Carving") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Sorkun Village, Çorum Province</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12223.055014999724!2d34.8083423!3d40.7763696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4086ee79365862e5%3A0x3a4df0f8b17238c0!2sSorkun%2C%20Osmancık%2F%C3%87orum!5e0!3m2!1str!2str!4v1720747207813!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Usta Halil of Sorkun</h3>
        <p>
            <strong>Usta Halil</strong> was a renowned spoon carver of the late Ottoman period from Sorkun Village in Çorum. 
            His intricate wood-carved spoons were prized across Anatolia, combining utility with delicate decorative art, often incorporating floral Ottoman motifs.
        </p>
    `;
}
// ✅ Custom content for Natural Dye Production
if (item.Entry === "Natural Dye Production") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bergama, İzmir Province</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3130.896918939547!2d27.17967621531747!3d39.123048279526306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b8e7d888af905d%3A0xbc4d2da2d4691e5f!2sBergama%2C%20%C4%B0zmir!5e0!3m2!1str!2str!4v1720747273056!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Bedri Usta (late 19th century)</h3>
        <p>
            <strong>Bedri Usta</strong> was a master of natural dyeing techniques during the late Ottoman era. 
            Based in Bergama, he was renowned for extracting vibrant reds from madder root and deep blues from indigo, using traditional recipes passed down through generations.
            His work supported the textile dyeing for Ottoman carpets and garments, preserving colorfast methods admired across the empire.
        </p>
    `;
}
// ✅ Custom content for Perfume & Essence Distillation
if (item.Entry === "Perfume & Essence Distillation") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Isparta, Ottoman Anatolia</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.5234407281916!2d30.545163915337754!3d37.764223279758205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c33b0034e13c75%3A0x6410dcdb6a7694b0!2sIsparta!5e0!3m2!1str!2str!4v1720747485000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Şekerci Hafız Ahmet Efendi</h3>
        <p>
            <strong>Hafız Ahmet Efendi</strong> was a renowned distiller in the 19th-century Ottoman Empire, known for his mastery in rosewater and essence extraction. 
            Based in Isparta, he combined steam distillation with locally grown roses and herbs to produce high-quality attars and essences, used in courtly rituals and personal care. 
            His methods influenced generations of perfumers throughout the region.
        </p>
    `;
}
// ✅ Custom content for Candle Making
if (item.Entry === "Candle Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Tahtakale, Istanbul (Ottoman Trade Hub)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12089.302880689528!2d28.96726092442815!3d41.01397224815813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba5b3dcdb0c3%3A0x3d5d16830f63e5db!2sTahtakale%2C%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1720747857000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Mumcu Ali Efendi</h3>
        <p>
            <strong>Mumcu Ali Efendi</strong> was a prominent candlemaker during the late 18th century in Istanbul. 
            He operated one of the most well-known candle workshops in the Tahtakale district, crafting wax candles for mosques, palaces, and homes. 
            His skill in producing smokeless and long-lasting candles made his name a staple in guild records and court supply registers.
        </p>
    `;
}
// ✅ Custom content for Hand-stitched Quilt Making
if (item.Entry === "Hand-stitched Quilt Making") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Bursa (Ottoman Textile Center)</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.4382743838017!2d29.06183641532621!3d40.18257797939395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca3f63a13a1abf%3A0x2e4f9a4e1a5371a2!2sBursa!5e0!3m2!1str!2str!4v1720747978000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftswoman: Hacıkadın Ayşe Hanım</h3>
        <p>
            <strong>Hacıkadın Ayşe Hanım</strong> was a renowned quilt-maker in 17th century Bursa. 
            Her intricate hand-stitched quilts were highly sought after by Ottoman elites and dowry merchants alike. 
            Known for floral motifs and layered warmth, her techniques were passed down through generations of female artisans in Bursa.
        </p>
    `;
}
// ✅ Custom content for Bookbinding
if (item.Entry === "Bookbinding") {
    descriptionHTML += `
        <hr>
        <h3>📍 Notable Location: Süleymaniye Library, Istanbul</h3>
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12091.846802729226!2d28.96398272784736!3d41.015484332507444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab988e5f1d5d1%3A0x6d65ab74e2442e12!2sS%C3%BCleymaniye%20Library!5e0!3m2!1str!2str!4v1720748374000!5m2!1str!2str" 
            width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
        <h3>👤 Famous Craftsman: Eyyubî Mehmed Efendi</h3>
        <p>
            <strong>Eyyubî Mehmed Efendi</strong> was one of the most prominent bookbinders of the 18th-century Ottoman Empire. 
            He worked in the court atelier and was renowned for his leather bindings adorned with gold tooling, floral motifs, and intricate arabesques. 
            Many of his bindings are preserved in the Topkapı Palace and Süleymaniye Library collections.
        </p>
    `;
}


    modalDescription.innerHTML = descriptionHTML;
    itemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeItemModal() { // Renamed for clarity
    itemModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore background scrolling
}

// Event listeners for close button and clicking outside the item modal
if (closeButton) { // Ensure button exists before adding listener
    closeButton.addEventListener('click', closeItemModal);
}
if (itemModal) { // Ensure modal exists before adding listener
    itemModal.addEventListener('click', (event) => {
        if (event.target === itemModal) { // If clicked directly on the modal overlay
            closeItemModal();
        }
    });
}


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
// const openFeedbackModalBtn = document.getElementById('openFeedbackModal'); // Button removed
const feedbackCloseButton = document.querySelector('.feedback-close-button');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');

// Removed: if (openFeedbackModalBtn) { ... } block that handled clicking the feedback icon.
// The modal can still be opened programmatically, e.g., by calling:
// feedbackModal.style.display = 'flex'; document.body.style.overflow = 'hidden';

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
        // It should look something like 'https://api.sheetbest.com/sheets/YOUR_SHEET_ID_HERE'
        // Double-check this ID from your Sheet.Best dashboard for the feedback sheet.
        const feedbackAPI = 'https://api.sheetbest.com/sheets/b49560c6-2bdb-469d-a297-2bc2398ebd96'; 
        console.log('Attempting to send feedback...');
        console.log('Sending data:', { name, email, feedback, timestamp: new Date().toISOString() });

        try {
            const response = await fetch(feedbackAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, feedback, timestamp: new Date().toISOString() }),
            });

            console.log('Response status:', response.status);
            const responseData = await response.json(); // Try to parse response even if not OK
            console.log('Response data:', responseData);

            if (response.ok) { // Status code 200-299
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
                // Handle non-OK responses from Sheet.Best
                console.error('Sheet.Best error response:', responseData);
                feedbackMessage.style.display = 'block';
                feedbackMessage.style.color = 'red';
                feedbackMessage.innerText = `Failed to send feedback: ${responseData.message || 'Please check your Sheet.Best API URL and column names.'}`;
            }
        } catch (error) {
            feedbackMessage.style.display = 'block';
            feedbackMessage.style.color = 'red';
            feedbackMessage.innerText = 'An error occurred while sending feedback. Please check console for details.';
            console.error('Feedback submission error:', error);
        }
    });
}

// About Us Modal Logic (This should now work correctly)
if (openAboutUsModalButton) {
    openAboutUsModalButton.addEventListener('click', (event) => { // Added event parameter
        event.preventDefault(); // Crucial: Prevent any default behavior that might cause navigation
        console.log("About Us button clicked!"); // Log

        // Remove active class from other filter buttons if About Us is clicked
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to About Us button
        openAboutUsModalButton.classList.add('active');

        aboutUsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

if (aboutUsCloseButton) {
    aboutUsCloseButton.addEventListener('click', () => {
        aboutUsModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore background scrolling
        // Optionally, remove active class from About Us when closed, or keep it.
        // For a modal, typically it's not considered an "active filter".
        openAboutUsModalButton.classList.remove('active');
        // If you want "All" to be active again after closing About Us, you'd trigger it here:
        // document.querySelector('.filters button[data-filter="all"]').click();
    });
}

if (aboutUsModal) {
    aboutUsModal.addEventListener('click', (event) => {
        if (event.target === aboutUsModal) {
            aboutUsModal.style.display = 'none';
            document.body.style.overflow = '';
            openAboutUsModalButton.classList.remove('active');
        }
    });
}
