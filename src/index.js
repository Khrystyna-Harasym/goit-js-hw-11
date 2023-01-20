import Notiflix from 'notiflix';
import { fetchData } from './api';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

let page;
let clientSearch = '';
form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';

  try {
    clientSearch = e.target.searchQuery.value;
    const data = await fetchData(clientSearch, page);
    const dataHits = data.data.hits;
    observer.observe(guard);
    if (dataHits.length === 0 || clientSearch === '') {
      observer.unobserve(guard);
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      form.reset();
      return;
    }
    const totalHits = data.data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    createMarkup(dataHits);
  } catch (err) {
    err => console.log(err.message);
  }
}
const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoadGallery, options);

function onLoadGallery(enteries) {
  enteries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchData(clientSearch, page)
        .then(data => {
          const dataHits = data.data.hits;
          createMarkup(dataHits);
          if (data.data.totalHits < page * 40) {
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            form.reset();
            observer.unobserve(guard);
          }
        })
        .catch(err => console.log(err.message));
    }
  });
}
function markupImage(arr) {
  return arr
    .map(
      ({
        webformatURL, tags, likes, views, comments, downloads, }) =>
      `<div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" height="400"/>                            
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
  </div>`
    )
    .join('');
}

function createMarkup(arr) {
  gallery.insertAdjacentHTML('beforeend', markupImage(arr));
}
