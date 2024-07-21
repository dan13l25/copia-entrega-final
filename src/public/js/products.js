const socket = io();

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-id');
        console.log('Product ID sent:', productId);  
        socket.emit('addToCart', { productId });
    });
});

document.querySelectorAll('.delete-product').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-id');
        try {
            const response = await fetch(`/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                alert('Producto eliminado correctamente');
                location.reload();
            } else {
                const errorData = await response.json();
                alert(`Error al eliminar el producto: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        }
    });
});

socket.on('cartUpdated', (message) => {
    alert(message);
});
