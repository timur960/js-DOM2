const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMore');
const clearBtn = document.getElementById('clearGallery');
const removeLastBtn = document.getElementById('removeLast');
const reverseBtn = document.getElementById('reverseGallery');
const shuffleBtn = document.getElementById('shuffleGallery');

let currentPage = 1;
const imagesPerLoad = 4;

// Функція для отримання зображень з API
async function fetchImages(page) {
    try {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Завантаження...';
        
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${imagesPerLoad}`);
        
        if (!response.ok) {
            throw new Error('Помилка завантаження зображень');
        }
        
        const images = await response.json();
        displayImages(images);
        
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити зображення. Спробуйте ще раз.');
    } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Завантажити ще 4 картинки';
    }
}

// Функція для відображення зображень
function displayImages(images) {
    images.forEach(image => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-wrapper';
        
        const imgElement = document.createElement('img');
        imgElement.src = image.download_url;
        imgElement.alt = `Фото від ${image.author}`;
        imgElement.loading = 'lazy';
        
        // Додаємо обробник помилок для кожного зображення
        imgElement.onerror = function() {
            this.src = 'https://via.placeholder.com/300x200?text=Помилка+завантаження';
        };
        
        imgWrapper.appendChild(imgElement);
        gallery.appendChild(imgWrapper);
    });
}

// Функція для перевірки чи галерея порожня
function updateButtonStates() {
    const images = gallery.getElementsByTagName('img');
    const isEmpty = images.length === 0;
    
    removeLastBtn.disabled = isEmpty;
    reverseBtn.disabled = isEmpty;
    shuffleBtn.disabled = isEmpty;
    clearBtn.disabled = isEmpty;
}

// Завантажити початкові картинки при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
    fetchImages(currentPage);
});

// Завантажити ще картинки
loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await fetchImages(currentPage);
    updateButtonStates();
});

// Очистити галерею
clearBtn.addEventListener('click', () => {
    if (confirm('Ви впевнені, що хочете очистити всю галерею?')) {
        gallery.innerHTML = '';
        currentPage = 1;
        updateButtonStates();
    }
});

// Видалити останню картинку
removeLastBtn.addEventListener('click', () => {
    const images = gallery.children;
    if (images.length > 0) {
        gallery.removeChild(images[images.length - 1]);
        updateButtonStates();
    }
});

// Перевернути галерею
reverseBtn.addEventListener('click', () => {
    const images = Array.from(gallery.children);
    gallery.innerHTML = '';
    images.reverse().forEach(img => gallery.appendChild(img));
});

// Перемішати галерею (додатковий функціонал)
shuffleBtn.addEventListener('click', () => {
    const images = Array.from(gallery.children);
    gallery.innerHTML = '';
    
    // Алгоритм Fisher-Yates для перемішування
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }
    
    images.forEach(img => gallery.appendChild(img));
});

// Оновлюємо стан кнопок при завантаженні
updateButtonStates();