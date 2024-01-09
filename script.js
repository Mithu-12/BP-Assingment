const ProductModule = (function () {
  async function createProductElement(product) {
    const productContainer = document.createElement("div");
    productContainer.className = "bg-white shadow-md p-3 width-300";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;

    const title = document.createElement("h1");
    title.className = "text-2xl font-bold";
    title.textContent = product.title;

    const price = document.createElement("h4");
    price.className = "text-lg font-semibold text-grey-600";
    price.textContent = `$${product.price.toFixed(2)}`;

    const description = document.createElement("p");
    description.className = "py-2";
    description.textContent = product.description;

    const addToCartButton = document.createElement("button");
    addToCartButton.className =
      "py-3 text-white-500 active rounded-sm py-2 px-4 text-center w-full";
    addToCartButton.id = `cartButton_${product.id}`;
    addToCartButton.textContent = "Add to Cart";

    const cartIconButton = document.getElementById("cartIconButton");
    const sidebarContainer = document.getElementById("sidebarContainer");
    const closeSidebarButton = document.getElementById("closeSidebar");

    addToCartButton.addEventListener("click", async function () {
      await CartModule.addToCart(product, addToCartButton, cartIconButton);
      sidebarContainer.classList.add("show");
    });

    cartIconButton.addEventListener("click", function () {
      sidebarContainer.classList.toggle("show");
    });

    closeSidebarButton.addEventListener("click", function () {
      sidebarContainer.classList.remove("show");
    });

    const customize = document.createElement("button");
    customize.className =
      "py-3 text-red-500 border-red rounded-sm py-2 px-4 text-center w-full customize";
    customize.textContent = "CUSTOMIZE";

    productContainer.appendChild(image);
    productContainer.appendChild(title);
    productContainer.appendChild(price);
    productContainer.appendChild(description);
    productContainer.appendChild(addToCartButton);
    productContainer.appendChild(customize);

    document.getElementById("content").appendChild(productContainer);
  }

  return {
    createProductElement,
  };
})();

// Cart Module
const CartModule = (function () {
  let cart = [];


  async function addToCart(product, addToCartButton, cartIconButton) {
    const existItem = cart?.find((item) => item.id === product.id);
    if (existItem) {
      addToCartButton.disabled = true;
      addToCartButton.className = "disabled bg-gray-500";
      return;
    } else {
      cart.push({
        id: product.id,
        image: product.image,
        title: product.title,
        price: product.price,
      });
      addToCartButton.disabled = true;
      addToCartButton.style.backgroundColor = "gray";
    }
    cartIconButton.textContent = cart.length;
    await updateSidebarCart(cart);
    console.log(cart);
    return cart;
  }

  async function updateSidebarCart(cart) {
    const sidebar = document.getElementById("sidebar");
   

    if (cart.length <= 0) {
      const noElement = document.getElementById('noItems')
      noElement.classList = 'text-white text-center flex items-center justify-center font-bold text-lg'
      noElement.textContent = 'There have no Cart Items'
    } else {
      for (const cartItem of cart) {
        const existingCartItem = document.querySelector(
          `.cartContainer[data-id="${cartItem.id}"]`
        );
  
        if (existingCartItem) {
          const quantityElement = existingCartItem.querySelector(".quantity");
          const subTotalPrice = existingCartItem.querySelector(".subTotalPrice");
  
          cartItem.quantity = cartItem.quantity || 1;
          quantityElement.textContent = cartItem.quantity;
          subTotalPrice.textContent = `$${(
            cartItem.price * cartItem.quantity
          ).toFixed(2)}`;
        } else {
          const container = document.createElement("div");
          container.classList =
            "border text-white m-3 p-2 cartContainer relative";
          container.setAttribute("data-id", cartItem.id);
  
          const imageContainer = document.createElement("div");
          const image = document.createElement("img");
          image.src = cartItem.image;
          image.alt = cartItem.title;
  
          const cartTextContainer = document.createElement("div");
          const title = document.createElement("h3");
          title.textContent = cartItem.title;
  
          const price = document.createElement("p");
          price.textContent = `$${cartItem.price.toFixed(2)}`;
  
          const subTotalPrice = document.createElement("h4");
          subTotalPrice.classList = "right-0 font-bold subTotalPrice absolute";
          subTotalPrice.textContent = `$${cartItem.price.toFixed(2)}`;
  
          const increaseButton = document.createElement("button");
          increaseButton.innerHTML = '<i class="fas fa-plus"></i>';
          increaseButton.classList = "quantity-control-button increase-button";
          increaseButton.addEventListener("click", () =>
            increaseQuantity(cartItem, quantityElement, price, subTotalPrice)
          );
  
          const decreaseButton = document.createElement("button");
          decreaseButton.innerHTML = '<i class="fas fa-minus"></i>';
          decreaseButton.classList = "quantity-control-button decrease-button";
          decreaseButton.addEventListener("click", () =>
            decreaseQuantity(cartItem, quantityElement, price, subTotalPrice)
          );
  
          const quantityElement = document.createElement("span");
          quantityElement.textContent = cartItem.quantity || 1;
          quantityElement.classList = "quantity quantity-element";
  
          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteButton.classList =
            "deleteButton absolute top-0 right-0 text-lg bg-gray-400 px-2 rounded mt-n3";
          deleteButton.addEventListener("click", async () => {
            await deleteCartItem(cartItem.id);
            const deletedItemContainer = document.querySelector(
              `.cartContainer[data-id="${cartItem.id}"]`
            );
            if (deletedItemContainer) {
              deletedItemContainer.remove();
            }
          });
  
  
          imageContainer.appendChild(image);
          cartTextContainer.appendChild(title);
          cartTextContainer.appendChild(price);
          cartTextContainer.appendChild(increaseButton);
          cartTextContainer.appendChild(quantityElement);
          cartTextContainer.appendChild(decreaseButton);
          cartTextContainer.appendChild(subTotalPrice);
          cartTextContainer.appendChild(deleteButton);
  
          container.appendChild(imageContainer);
          container.appendChild(cartTextContainer);
          sidebar.appendChild(container);
        }
      }
    }
  }

  function increaseQuantity(cartItem, quantityElement, price, subTotalPrice) {
    cartItem.quantity = (cartItem.quantity || 1) + 1;
    quantityElement.textContent = cartItem.quantity;
    subTotalPrice.textContent = `$${(
      cartItem.price * cartItem.quantity
    ).toFixed(2)}`;
  }

  function decreaseQuantity(cartItem, quantityElement, price, subTotalPrice) {
    if(cartItem.quantity > 1){
      cartItem.quantity = (cartItem.quantity || 1) - 1;
    quantityElement.textContent = cartItem.quantity;
    subTotalPrice.textContent = `$${(
      cartItem.price * cartItem.quantity
    ).toFixed(2)}`;
    }
  }

  async function deleteCartItem(itemId) {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    cart = updatedCart;
    await updateSidebarCart(cart);
    const addToCartButton = document.getElementById(`cartButton_${itemId}`);
    if (addToCartButton) {
      addToCartButton.disabled = false;
      addToCartButton.style.backgroundColor = "red";
      addToCartButton.className =
        "py-3 text-white-500 bg-red-500 rounded-sm py-2 px-4 text-center w-full active";
    }
    const cartIconButton = document.getElementById("cartIconButton");
    if (cartIconButton) {
      cartIconButton.textContent = cart.length;
    }
    console.log("first", cart);
  }

  return {
    addToCart,
    updateSidebarCart,
    increaseQuantity,
    decreaseQuantity,
    deleteCartItem,
  };
})();

fetch("product.json")
  .then((response) => response.json())
  .then((products) => {
    products.forEach(ProductModule.createProductElement);
  });
