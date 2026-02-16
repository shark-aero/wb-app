// ------ CLASSIC SERVICE WORKER
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js')
//         .then(reg => console.log('service worker registered'))
//         .catch(err => console.log('service worker not registered', err));
// }
// ------ ------ ------ ------ ------ ------ ------


// ------ INSTALL BUTTON
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

let buttonInstall = document.getElementById('button-install');

function showInstallPromotion() {
    buttonInstall.style.display = 'flex';
}

function hideInstallPromotion() {
    buttonInstall.style.display = 'none';
}

// If not already installed and possile, deferred install prompt, show the install button
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});

// If clicked, hide the button, and send the install
buttonInstall.addEventListener('click', async () => {
    // Hide the app provided install promotion
    hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const {
        outcome
    } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt and can't use it again, throw it away
    deferredPrompt = null;
});

// // if already installed
// window.addEventListener('appinstalled', () => {
//     // Hide the app-provided install promotion
//     hideInstallPromotion();
//     // Clear the deferredPrompt so it can be garbage collected
//     deferredPrompt = null;
//     // Optionally, send analytics event to indicate successful install
//     console.log('PWA was installed');
// });
// ------ ------ ------ ------ ------ ------ ------


// ------ UPDATED SERVICE WORKER
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
            // console.log(reg)
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
// ------ ------ ------ ------ ------ ------ ------