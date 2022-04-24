self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: "Push notification from section.io",
            image: "/resources/images/logo.png",
            icon: "/resources/images/logo.png"
        }
    );
});