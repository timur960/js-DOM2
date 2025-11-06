const gallery = document.getElementById('gallery');
let currentPage = 1;
const imagesPerLoad = 4;

// Завантаження зображень з API
async function fetchImages(page) {
    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${imagesPerLoad}`);
        if (!response.ok) throw new Error('Помилка завантаження');
        
        const images = await response.json();
        displayImages(images);
    } catch (error) {
        alert('Не вдалося завантажити зображення');
    }
}

// Відображення зображень
function displayImages(images) {
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.download_url;
        img.alt = `Фото від ${image.author}`;
        gallery.appendChild(img);
    });
}

// Завантажити початкові картинки
fetchImages(currentPage);

// Завантажити ще 4 картинки
document.getElementById('loadMore').addEventListener('click', () => {
    currentPage++;
    fetchImages(currentPage);
});

// Очистити галерею
document.getElementById('clearGallery').addEventListener('click', () => {
    if (confirm('Ви впевнені, що хочете очистити всю галерею?')) {
        gallery.innerHTML = '';
        currentPage = 1;
    }
});

// Видалити останню картинку
document.getElementById('removeLast').addEventListener('click', () => {
    const images = gallery.getElementsByTagName('img');
    if (images.length > 0) {
        gallery.removeChild(images[images.length - 1]);
    }
});

// Перевернути галерею
document.getElementById('reverseGallery').addEventListener('click', () => {
    const images = Array.from(gallery.children);
    gallery.innerHTML = '';
    images.reverse().forEach(img => gallery.appendChild(img));
});

// Перемішати галерею
document.getElementById('shuffleGallery').addEventListener('click', () => {
    const images = Array.from(gallery.children);
    gallery.innerHTML = '';
    
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }
    
    images.forEach(img => gallery.appendChild(img));
});