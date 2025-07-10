function openItemModal(item) {
    console.log("DEBUG: Entry clicked:", item.Entry);
    modalImage.src = item.Image || '';
    modalImage.alt = item.Entry || 'Profession Image';
    modalTitle.innerText = item.Entry || 'No Title';

    let descriptionHTML = item.Description || 'No description available.';

    // ✅ Custom content for Nakkaşlık
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}
