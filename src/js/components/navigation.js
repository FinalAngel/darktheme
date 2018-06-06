import $ from 'jquery';


export default class Navigation {
    constructor(options) {
        this.header();
        this.pagination();
        this.backBtn();
    }

    header() {
        var backBtn = '<li><a class="back-btn js-back" href="../"><i class="glyphicon chevron-left"></i></a></li>'
        var randomBtn = '<li><a href="./?random=true" title="Random"><i class="glyphicon random"></i></a></li>';
        var logoutBtn = '<li><a href="./?logout=true" title="Logout"><i class="glyphicon log-out"></i></a></li>';
        var settingsBtn = `<li><a href="#" title="Settings" onclick="showHidePopupMenu('settingsbox','pageselector','searchbox','comicdetails');return false;"><i class="glyphicon settings"></i></a></li>`;
        var homeBtn = '<li><a class="home-btn" href="' + window.location.href + '"><i class="glyphicon home"></i></a></li>';
        var search = '';

        this.template = (backBtn = '', randomBtn = '', settingsBtn = '', logoutBtn = '', homeBtn = '', search='') => `
            <div class="navigation">
                <ul class="nav nav-bar-nav">
                    ${backBtn}
                    ${homeBtn}
                </ul>

                <form action="${search}" method="post" class="nav-bar-search-container">
                    <div class="QuickSearch-container-2PWkB">
                        <div class="QuickSearchInput-container-R2-wn">
                            <i class="plex-icon-search-560 QuickSearchInput-searchIcon-1f6m9" aria-hidden="true"></i>
                            <input type="text" class="QuickSearchInput-searchInput-2HU6-" value="" autocomplete="off" spellcheck="false" name="searchstring">
                            <input class="actionbutton" hidden type="submit" value="Search">
                        </div>
                    </div>
                </form>

                <ul class="nav nav-bar-nav nav-bar-right">
                    ${settingsBtn}
                    ${randomBtn}
                    ${logoutBtn}
                </ul>
            </div>
        `;

        let container = '';
        if ($('#banner').length) {
            container = $('#banner');
            backBtn = '';
            randomBtn = '';
            settingsBtn = '';
            container.html(this.template());
        } else if($('.cellcontainer').length) {
            container = $('#toppagebar');
        } else if($('#toppagebar').length) {
            container = $('#toppagebar');
        }
        if (!$('#userinfo').length) {
            logoutBtn = '';
        }

        // set search value
        if ($('#searchform').length) {
            search = $('#searchform').attr('action');
        } else {
            search = '/?search=true';
        }
        console.log(search);

        // set correct home btn
        if ($('#arrowup').length) {
            var prefix = $('#arrowup').attr('href');
            prefix = prefix.split('/')[1] || '';
            homeBtn = '<li><a class="home-btn" href="/' + prefix + '"><i class="glyphicon home"></i></a></li>';
        }

        container.hide().after(this.template(backBtn, randomBtn, settingsBtn, logoutBtn, homeBtn, search));
    }

    pagination() {
        // handling of pagination
        if ($('#arrowright').length) {
            var pagination = (text = '', prev = '', next = '', hidden = '') => `
                <div class="pagination" ${hidden}>
                    ${prev} ${text} ${next}
                </div>
            `;
            var prev = '';
            var next = '';
            var hidden = '';
            var pagetext = $('#pagelabel').text();
            var page = false;

            // show left arrow
            if (!$('#topbarleft #arrowleft').hasClass('hidden')) {
                prev = '';
                page = true;
                if (!$('#topbarleft #arrowleft10').hasClass('hidden')) {
                    prev += '<a href="' + $('#arrowleft10').prop('href') + '" class="btn-link btn-dark">First</a>';
                }
                prev += '<a href="' + $('#arrowleft').prop('href') + '" class="btn-link">Previous</a>';
            }
            if (!$('#topbarright #arrowright').hasClass('hidden')) {
                next = '<a href="' + $('#arrowright').prop('href') + '" class="btn-link">Next</a>';
                page = true;
                if (!$('#topbarright #arrowright10').hasClass('hidden')) {
                    next += '<a href="' + $('#arrowright10').prop('href') + '" class="btn-link btn-dark">Last</a>';
                }
            }
            if (!page) {
                hidden = 'hidden'
            }

            $('#group').after(pagination(pagetext, prev, next, hidden));
        }
    }

    backBtn() {
        $('.navigation').on('click', '.js-back', function (e) {
            e.preventDefault();
            window.history.back();
        });
    }
}
