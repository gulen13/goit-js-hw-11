import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-API';
import { createGalleryCards } from './createGallery';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');

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
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', { clickToClose: true, });
      return;
    }

    Notify.success(`Hooray! We found ${totalQuantity} images.`, { clickToClose: true, });

    createGalleryCards(images);

    lightbox.refresh();

    if (totalQuantity < pixabayApi.page * pixabayApi.perPage) {
      window.removeEventListener('scroll', infiniteScroll);
    } else {
      window.addEventListener('scroll', infiniteScroll);
    }

  } catch (error) {
    console.log(error);
  }

};

const onInfiniteScroll = async () => {
  pixabayApi.incrementPage();

  try {
    const { hits: images, totalHits: totalQuantity, total: quantity } = await pixabayApi.fetchPhotos();

    createGalleryCards(images)

    lightbox.refresh();

    if (totalQuantity < pixabayApi.page * pixabayApi.perPage) {
      Notify.info("We're sorry, but you've reached the end of search results.", { clickToClose: true, });
      window.removeEventListener('scroll', infiniteScroll);
    }

  } catch (error) {
    console.log(error);
  }
};

function clearMarkup() {
  galleryListEl.innerHTML = '';
}

const infiniteScroll = () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 200) {
    onInfiniteScroll();
  };
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
window.addEventListener('scroll', infiniteScroll);