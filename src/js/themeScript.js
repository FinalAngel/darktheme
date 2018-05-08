import $ from 'jquery';

import Navigation from 'components/navigation';
import Search from 'components/search';


$(() => {
    new Navigation();
    new Search();

    // add title to covers
    $('.cellcontainer').each(function (index, item) {
        var text = $(item).find('.label').text();
        $(item).prop('title', text)
    });
});
