import '../styles/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-API';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

loadMoreBtnEl.classList.add('is-hidden');

const pixabayApi = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim().toLowerCase();
  pixabayApi.query = searchQuery;

  try {

  const { total, totalHits, hits} = await pixabayApi.fetchPhotos();

              console.log(hits);

//   const { hits } = await pixabayApi.fetchPhotos();

// if (hits.length === 0) {
//   console.log('No image found');
// }

    // await pixabayApi.fetchPhotos().then(({
    //   data
    // }) => {
    //   console.log(data)
    //   if (data.total === 0) {
    //     console.log('Images not found!');
    //     return;
    //   }

    //   loadMoreBtnEl.classList.remove('is-hidden');
    //   // galleryListEl.innerHTML = createGalleryCards(data.results);
    // })



  } catch (err) {
    console.log(err);
  }
};

// const onLoadMoreBtnClick = async () => {
//   unsplashApi.page += 1;

//   try {
//     const { data } = await unsplashApi.fetchPhotos();

//     if (unsplashApi.page === data.total_pages) {
//       loadMoreBtnEl.classList.add('is-hidden');
//     }

//     galleryListEl.insertAdjacentHTML(
//       'beforeend',
//       createGalleryCards(data.results)
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

searchFormEl.addEventListener('submit', onSearchFormSubmit);
// loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);