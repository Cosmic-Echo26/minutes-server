async function getUserData() {
    try {
        const response = await fetch('/api/account/me', {
            method: 'GET',
            credentials: 'include'
        });

        const userjson = await response.json();
        return userjson;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

function open_popup() {
    const popup = document.getElementById('popup-backdrop');
    popup.classList.add('active');
}

function close_popup() {
    const popup = document.getElementById('popup-backdrop');
    popup.classList.remove('active');
}
