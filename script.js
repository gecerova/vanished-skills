function openItemModal(item) {
    console.log("DEBUG: Entry clicked:", item.Entry); // 🛠️ This prints the profession to the console

    // Set image and title
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';

    // Default description
    let descriptionHTML = item.Description || 'No description available.';

    // ✅ Extra content for Nakkaşlık
    if (item.Entry === "Architectural Decorative Painting (Nakkaşlık)") {
        descriptionHTML += `
            <hr>
            <h3>📍 Notable Location: Nakkaşhane, Topkapı Palace (Istanbul)</h3>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12092.213496747912!2d28.9786761472534!3d41.012754172973946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba5db5de8bcb%3A0x1cb2
