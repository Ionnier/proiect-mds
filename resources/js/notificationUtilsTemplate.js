const notificationPreferenceCookieName = "allowNotification"
const publicVapidKey = '$$$$PUBLIC$$$$VAPID$$$$KEY'
const reminderNotificationWorker = "/resources/js/reminderNotification.js"

function checkNotificationSupport() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        return true;
    }
    else {
        return false;
    }
}

function checkNotificationCookie() {
    if (checkNotificationSupport() == false) {
        return
    }
    let notificationPreference = getCookie(notificationPreferenceCookieName)
    if (notificationPreference == "") {
        setCookie(notificationPreferenceCookieName, false)
        notificationPreference = false
    }
    return notificationPreference == "true"
}

async function registerManager() {
    const register = await navigator.serviceWorker.register(reminderNotificationWorker, {
        scope: '/',
        'Content-Type': 'application/javascript'
    });
    let subscription
    try {
        subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
    } catch (e) {
        // Works on MS Edge, doesn't on Firefox which doesn't need it
        await navigator.serviceWorker.ready
        subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
    }
    
    if (register.waiting && register.active) {
        resetWorkers()
        alert('Please close all tabs to get updates.');
        return;
    }

    if (subscription == null) {
        setCookie(notificationPreferenceCookieName, false)
        return alert(`Couldn't subscribe to push service`)
    }

    const body = {endpoint: JSON.stringify(subscription)}
    const request = await fetch(`/api/notifications/endpoint`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(body).length
        },
        body: JSON.stringify(body)
    })
    const data = await request.json()
    if (data.success == false)
        alert(data.message)
    else {
        setCookie(notificationPreferenceCookieName, true)
        location.reload()
    }

    
}

async function setNotificationCookie() {
    await registerManager()
}

async function resetWorkers(){
    // Not the best way, but I am not using more than one service worker ATM for this project
    await navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            registration.unregister()
        }
    })
}

async function resetNotificationCookie() {
    resetWorkers()
    const request = await fetch(`/api/notifications/endpoint`, {
        method: 'DELETE'
    })
    const data = await request.json()
    if (data.success == false)
        alert(data.message)
    else {
        setCookie(notificationPreferenceCookieName, false)
        location.reload()
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}