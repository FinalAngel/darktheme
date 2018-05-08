import $ from 'jquery';


export default class Search {
    constructor(options) {
        let search = $('.QuickSearchInput-searchInput-2HU6-');
        let container = $('.QuickSearchInput-container-R2-wn');

        search.on('focus', function () {
            container.addClass('QuickSearchInput-focused-2kpW8');
        });
        search.on('blur', function () {
            container.removeClass('QuickSearchInput-focused-2kpW8');
        });
    }
}
