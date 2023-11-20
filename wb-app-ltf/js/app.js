// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js')
//         .then(reg => console.log('service worker registered'))
//         .catch(err => console.log('service worker not registered', err));
// }

let newWorker;

let updatebar = document.getElementById('updatebar');

function showUpdateBar() {
    updatebar.style.display = 'flex';
}
// The click event on the pop up notification
updatebar.addEventListener('click', function() {
    newWorker.postMessage({
        action: 'skipWaiting'
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
            console.log(reg)
            reg.addEventListener('updatefound', () => {
                // console.log('update found')
                // A new service worker has appeared
                newWorker = reg.installing;

                newWorker.addEventListener('statechange', () => {
                    // console.log('state changed')
                    // Has newWorker.state changed?
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                // new update available
                                console.log('new service worker available');
                                showUpdateBar();
                            }
                            // No update available
                            break;
                    }
                });
            });
        })
        .catch((err) => console.log('sw not register'));

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}