function open_popup() {
    const popup = document.getElementById('popup-backdrop');
    popup.classList.add('active');
}

function close_popup() {
    const popup = document.getElementById('popup-backdrop');
    popup.classList.remove('active');
}