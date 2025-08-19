const socket = io();

const form = document.getElementById('productForm');
const productList = document.getElementById('productsList');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const thumbnailsRaw = formData.get('thumbnails');
  const thumbnails = thumbnailsRaw ? thumbnailsRaw.split(',').map(s => s.trim()) : [];

  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: Number(formData.get('price')),
    status: formData.get('status') === 'on',
    stock: Number(formData.get('stock')),
    category: formData.get('category'),
    thumbnails
  };

  socket.emit('addProduct', product);
  form.reset();
});

socket.on('products', (products) => {
  productList.innerHTML = '';
  products.forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price} (Stock: ${p.stock})
      <button data-id="${p._id}">Eliminar</button>
    `;
    const btn = li.querySelector('button');
    btn.addEventListener('click', () => {
      socket.emit('deleteProduct', p._id);
    });
    productList.appendChild(li);
  });
});
