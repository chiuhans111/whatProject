// setup

var loadDelay = 100;
var retryDelay = 250;


var page = window.open('');

function attrCopy(source, target) {
    if (source == null || target == null) return;
    for (var i in source) {
        if (typeof source[i] == 'object') attrCopy(source[i], target[i]);
        else target[i] = source[i];
    }
    return target;
}

function dom(tag, mod, parent, callback) {
    var element = document.createElement(tag);
    attrCopy(mod, element);
    if (parent != null) parent.appendChild(element);
    if (callback instanceof Function) callback(element);
    return element;
}
// page

page.dom = dom.bind(page);

var pageview = page.dom('div', {}, page.document.body);
var content = page.dom('pre', { style: { whiteSpace: 'pre-wrap' } }, page.document.body);

// prepare

var firstPic = document.querySelector('._ovg3g');
if (document.querySelectorAll('article').length < 2) firstPic.click();

// function
var count = 50;
var all = [];

grap();

function grap() {
    grapCurrent(function (data, article) {
        all.push(data);
        article.querySelector('header').nextSibling.appendChild(dom('done'))
        count--;
        document.querySelector('.coreSpriteRightPaginationArrow').click();

        page.dom(data.img.type, {
            src: data.img.link,
            width: 100, height: 100
        }, pageview);

        if (count > 0) {
            setTimeout(grap, loadDelay);
            content.textContent = JSON.stringify(all);
        }
        else {
            content.textContent = JSON.stringify(all);
        }
    });
}


function grapCurrent(callback) {
    try {

        var article = document.querySelectorAll('article')[1];
        if (article.querySelector('done') != null) throw new Error('repeat');
        // title
        var header = article.querySelector('header');
        var authorLink = header.querySelector('a');
        var authorHref = authorLink.href;
        var author = {
            id: authorHref.split('/').filter(s => s.length).pop(),
            link: authorHref,
            pic: authorLink.querySelector('img').src
        }
        /*
        var titleElement = header.querySelector('div>div>a')
        var title = {
            text: titleElement.textContent,
            link: titleElement.href
        }*/
        // info
        var section = article.querySelector('section');
        var likeSpan = section.querySelector('span > span')
        var likes = 0;
        if (likeSpan != null) likes = +likeSpan.textContent;
        else likes = section.querySelectorAll('div > a').length;
        var timeElement = section.querySelector('time');
        var time = {
            code: timeElement.getAttribute('datetime'),
            title: timeElement.title,
            text: timeElement.textContent
        }
        // comment
        var comments = Array.from(article.querySelectorAll('ul > li')).map(li => {
            var userLink = li.querySelector('a');
            var userHref = userLink.href;
            var user = {
                id: userHref.split('/').filter(s => s.length).pop(),
                link: userHref,
            }
            var content = li.querySelector('span').textContent;
            return {
                user: user,
                content: content
            }
        });
        // content
        var imgElement = header.nextSibling.querySelector('img');
        if (imgElement == null) imgElement = header.nextSibling.querySelector('video');
        var img = {
            type: imgElement.tagName,
            link: imgElement.src,
            alt: imgElement.alt
        }

        var data = {
            //title: title,
            author: author,
            info: {
                likes: likes,
                time: time
            },
            comments: comments,
            img: img
        };

        callback(data, article);
    } catch (e) {
        console.error(e);
        setTimeout(function () {
            grapCurrent(callback);
        }, retryDelay);
    }

}
