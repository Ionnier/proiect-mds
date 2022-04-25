self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title || 'New notification',
        {
            body: data.body || 'Check what\'s new on our website',
            image: data.image || "/resources/images/logo.png",
            icon: "/resources/images/logo.png"
        }
    );
});