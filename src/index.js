import {fetchCountries} from './js/fetchCountries';
import countriesList from './templates/countrys-list.hbs';
// import countryItem from './templates/country-cards.hbs';
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "./css/styles.css";

const refs = {
    searchField: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list')
}

const DEBOUNCE_DELAY = 300;

refs.searchField.addEventListener('input', debounce(onSearchFieldInput, DEBOUNCE_DELAY));

function onSearchFieldInput (e) {
    const searchQuery = e.target.value.trim();

    if (!searchQuery) {
        clearCountryList();
        clearCountryInfo();
        return;
    }

    fetchCountries(searchQuery)
        .then(renderMarkup)
        .catch(onFetchError);
}

function renderMarkup(country) {

    if(country.length === 1) {
        clearCountryList();
        renderMarkupCard(...country);
    };

    if(country.length > 1 && country.length <= 10) {
        clearCountryInfo();
        const markupList = country.map(createCountriesList).join('');
        renderMarkupList(markupList);
    };

    if (country.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    };
}

function createCountriesList (country) {
    return countriesList(country);
}

function renderMarkupList (countries) {
    refs.countryList.innerHTML = countries;
}

function renderMarkupCard ({flags,name,capital,population,languages}) {
    const markup = `<div class="country-item" style = 'display:flex; align-items:center'>
                    <img src="${flags.svg}" alt="${name.official}" width = '30' height="20">
                    <h2 class="country-name" style="margin-left: 10px;">${name.common}</h2>
                    </div>
                    <p class="country-capital">Capital: ${capital}</p>
                    <p class="country-population">Population: ${population}</p>
                    <p class="country-languages">Languages: ${Object.values(languages)}</p>`;
    refs.countryInfo.innerHTML = markup;
    refs.countryInfo.style.marginLeft = '40px';
}

function onFetchError () {
    clearCountryList();
    clearCountryInfo();
    Notify.failure("Oops, there is no country with that name");
}

function clearCountryList (){
    refs.countryList.innerHTML = '';
}

function clearCountryInfo (){
    refs.countryInfo.innerHTML = '';
}