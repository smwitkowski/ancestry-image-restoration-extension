const url_of_interest = document.querySelector('[src^="https://mediasvc.ancestry.com/v2/image/"]')['src']

function listenForClicks() {
    document.addEventListener('click', function (e) {
        return document.querySelector('[src^="https://mediasvc.ancestry.com/v2/image/"]')['src']
    })
}

listenForClicks()