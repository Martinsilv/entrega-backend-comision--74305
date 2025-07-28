const socket = io();

const form = document.getElementById('productForm');
const productList = document.getElementById('productList');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  product.price = Number(product.price);
  product.stock = Number(product.stock);

  socket.emit('addProduct', product);
  form.reset();
});

socket.on('productList', (products) => {
  productList.innerHTML = '';
  products.forEach((product) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${product.title}</strong> - $${product.price} (Stock: ${product.stock})
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}
