const galleryListEl = document.querySelector('.gallery');

export function createGalleryCards(data) {
  {
    data.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        galleryListEl.insertAdjacentHTML(
          'beforeend',
          `
          <a class="photo-card" href="${largeImageURL}">
            <div >
              <img class="gallery__item" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b>
                  ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
                </p>
              </div>
            </div>
          </a>
          `
        );
      }
    );
  }
}