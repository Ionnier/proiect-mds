window.addEventListener('DOMContentLoaded', () => {
    setUpNotificationSettings();
})

function setUpNotificationSettings(){
    if (checkNotificationSupport() == false) {
        document.getElementById('notification_settings_list').innerHTML = "<p>This Browser does not support notifications.</p>"
        return
    }
    const notificationPreference = checkNotificationCookie()
    if (notificationPreference) {
        document.getElementById('notificationAllowSwitch').checked = true
    } else {
        document.getElementById('notificationAllowSwitch').checked = ""
    }
    setUpNotificationGeneralSettings()
}

function setUpNotificationGeneralSettings() {
    if (document.getElementById('notificationAllowSwitch').checked == true) {
        document.getElementById('notification_advanced_settings').style.display = 'block';
    } else {
        document.getElementById('notification_advanced_settings').style.display = 'none';
    }
}

function notificationOnValueChanged(){
    if (document.getElementById('notificationAllowSwitch').checked == true){
        setNotificationCookie()
    } else {
        resetNotificationCookie()
    }
    setUpNotificationSettings()
}