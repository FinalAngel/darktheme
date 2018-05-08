import $ from 'jquery';


export default class Navigation {
    constructor(options) {
        this.header();
        this.pagination();
    }

    header() {
        var backBtn = '<li><a class="back-btn" href="../"><i class="glyphicon chevron-left"></i></a></li>'
        var randomBtn = '<li><a href="./?random=true" title="Random"><i class="glyphicon random"></i></a></li>';
        var logoutBtn = '<li><a href="./?logout=true" title="Logout"><i class="glyphicon log-out"></i></a></li>';

        this.template = (backBtn = '', randomBtn = '', logoutBtn = '') => `
            <div class="navigation">
                <ul class="nav nav-bar-nav">
                    ${backBtn}
                    <li><a class="home-btn" href="/"><i class="glyphicon home"></i></a></li>
                </ul>

                <form action="/comics/?search=true" method="post" class="nav-bar-search-container">
                    <div class="QuickSearch-container-2PWkB">
                        <div class="QuickSearchInput-container-R2-wn"> <!-- QuickSearchInput-focused-2kpW8 -->
                            <i class="plex-icon-search-560 QuickSearchInput-searchIcon-1f6m9" aria-hidden="true"></i>
                            <input type="text" class="QuickSearchInput-searchInput-2HU6-" value="" autocomplete="off" spellcheck="false" name="searchstring">
                            <input class="actionbutton" hidden type="submit" value="Search">
                        </div>
                    </div>
                </form>

                <ul class="nav nav-bar-nav nav-bar-right">
                    <li><a href="#" title="Settings" onclick="showHidePopupMenu('settingsbox','pageselector','searchbox','comicdetails');return false;"><i class="glyphicon settings"></i></a></li>
                    ${randomBtn}
                    ${logoutBtn}
                </ul>
            </div>
        `;

        let container = '';
        if ($('#banner').length) {
            console.log('isHomePage');

            container = $('#banner');
            backBtn = '';
            randomBtn = '';
            container.html(this.template());
        } else if($('.cellcontainer').length) {
            console.log('isListPage');

            container = $('#toppagebar');
        } else if($('#toppagebar').length) {
            console.log('isCategoryPage');

            container = $('#toppagebar');
        }
        if (!$('#userinfo').length) {
            logoutBtn = '';
        }

        container.hide().after(this.template(backBtn, randomBtn, logoutBtn));
    }

    pagination() {
        // handling of pagination
        if ($('#arrowright').length) {
            var pagination = (text = '', prev = '', next = '') => `
                <div class="pagination">
                    ${prev} ${text} ${next}
                </div>
            `;
            var prev = '';
            var next = '';
            var pagetext = $('#pagelabel').text();

            // show left arrow
            if (!$('#topbarleft #arrowleft').hasClass('hidden')) {
                prev = '';
                if (!$('#topbarleft #topbarleft10').hasClass('hidden')) {
                    prev += '<a href="' + $('#arrowleft10').prop('href') + '" class="btn-link btn-dark">First</a>';
                }
                prev += '<a href="' + $('#arrowleft').prop('href') + '" class="btn-link">Previous</a>';
            }
            if (!$('#topbarright #arrowright').hasClass('hidden')) {
                next = '<a href="' + $('#arrowright').prop('href') + '" class="btn-link">Next</a>';
                if (!$('#topbarright #arrowright10').hasClass('hidden')) {
                    next += '<a href="' + $('#arrowright10').prop('href') + '" class="btn-link btn-dark">Last</a>';
                }
            }

            $('#group').after(pagination(pagetext, prev, next));
        }
    }
}
