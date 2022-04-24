const notificationPreferenceCookieName = "allowNotification" 
const publicVapidKey = "BCBtF_EPS7NHdxeWQxPgCVXEUYLHaLINdp6_LhlSYvsxQeZyiLoWRaPqYwuA1oQ9sRkLRH86XYJhbsmlC7aRGNE"
function checkNotificationSupport() {
    if ('serviceWorker' in navigator && 'PushManager' in window){
        return true;
    }
    else{
        return false;
    }
}

function checkNotificationCookie() {
    if (checkNotificationSupport() == false) {
        return
    }
    let notificationPreference = getCookie(notificationPreferenceCookieName)
    if (notificationPreference == ""){
        setCookie(notificationPreferenceCookieName, false)
        notificationPreference = false
    }
    return notificationPreference == "true"
}

async function registerManager(){
    const register = await navigator.serviceWorker.register('/resources/js/reminderNotification.js', {
        scope: '/',
        'Content-Type': 'application/javascript'
    });

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    console.log(JSON.stringify(subscription))
   
    await fetch("/notifications/reminder", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    });
}

async function setNotificationCookie(){
    setCookie(notificationPreferenceCookieName, true)
    await registerManager()
}

function resetNotificationCookie(){
    setCookie(notificationPreferenceCookieName, false)
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