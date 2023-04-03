import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './partials/JS/pixabay-API';
import { createGalleryCards } from './partials/JS/createGallery';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

loadMoreBtnEl.classList.add('is-hidden');

const pixabayApi = new PixabayAPI();

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 250,
});

const onSearchFormSubmit = async event => {
  event.preventDefault();
  pixabayApi.pageReset();
  clearMarkup();

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim().toLowerCase();
  pixabayApi.query = searchQuery;

  if (searchQuery === '') {
    searchFormEl.reset();
    Notify.info('Please enter search request', { clickToClose: true, });
    return;
  }

  try {
    const { hits: images, totalHits: totalQuantity, total: quantity } = await pixabayApi.fetchPhotos();

    if (quantity === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', { clickToClose: true, });
      return;
    }

    if (totalQuantity < pixabayApi.page * pixabayApi.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    Notify.success(`Hooray! We found ${totalQuantity} images.`, { clickToClose: true, });

    createGalleryCards(images);

    lightbox.refresh();

  } catch (error) {
    console.log(error);
  }

};

const onLoadMoreBtnClick = async () => {
  pixabayApi.incrementPage();

  try {
    const { hits: images, totalHits: totalQuantity, total: quantity } = await pixabayApi.fetchPhotos();

    if (totalQuantity < pixabayApi.page * pixabayApi.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.", { clickToClose: true, });
    }

    createGalleryCards(images)

    lightbox.refresh();

    autoScrollPage();

  } catch (error) {
    console.log(error);
  }
};

function clearMarkup() {
  galleryListEl.innerHTML = '';
}

function autoScrollPage() {
  const { height: cardHeight } =
    galleryListEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);