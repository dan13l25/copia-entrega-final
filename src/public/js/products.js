const socket = io();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            socket.emit('addToCart', { productId });
        });
    });

    socket.on('cartUpdated', (message) => {
        alert(message);
    });