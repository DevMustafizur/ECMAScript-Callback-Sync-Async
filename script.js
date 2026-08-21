const products = [
    {
        productId: 101,
        name: "T-Shirt",
        price: 500,
        stock: 20
    },
    {
        productId: 102,
        name: "Shoes",
        price: 1500,
        stock: 10
    }
];


function Cart(userId) {
    this.userId = userId;
    this.items = [];
}


Cart.prototype.findProduct = function (productId, callback) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].productId === productId) {
            return callback(null, products[i])
        }
        return callback(new Error("Product Not Found", null))
    }
};


Cart.prototype.checkStock = function (productId, quantity, callback) {
    this.findProduct(productId, (error, product) => {
        if (error) {
            return callback(error, null)
        }
        if (product.stock < quantity) {
            return callback(
                new Error("Insufficient stock"),
                null
            );
        }
        return callback(null, product)
    })
};


Cart.prototype.checkCartItem = function (productId, callback) {
    for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].productId === productId) {
            return callback(null, products[i])
        }
    }
    return callback(null, null)
};


Cart.prototype.calculatePrice = function (
    productId,
    quantity,
    callback
) {
    this.findProduct(productId, (error, product)=>{
        if(error){
           return callback(error, null)
        }
        const totalPrice = product.price * quantity;

        return callback(null, totalPrice)
    })
};


Cart.prototype.save = function (cart, callback) {
    this.items.push(cart)
    return callback(null, cart)
};


Cart.prototype.addItem = function (
    productId,
    quantity,
    callback
) {

    this.findProduct(productId, (error, product) => {
        if (error) {
           return callback(error, null)
        }

        this.checkStock(productId, quantity, (error, product) => {
            if (error) {
                return callback(error, null)
            }
            this.checkCartItem(productId, (error, cartItem) => {
                if (error) {
                    return callback(error, null)
                }
                if (cartItem) {
                    return callback(new Error("Product Already Added", null))
                }

                this.calculatePrice(productId, quantity, (error, totalPrice)=>{
                    if(error){
                        return callback(error, null)
                    }
                    const cart = {
                        productId,
                        quantity,
                        totalPrice
                    }
                    this.save(cart, (error, data)=>{
                        if(error){
                            callback(error, null)
                        }
                        return callback(null, data)
                    })
                })

            })
        })
    })
};



const myCart = new Cart(101);
myCart.addItem(101, 19, (error, data) => {
    if(error){
        console.log(error)
    }
    console.log(data)
});

myCart.addItem(101, 19, (error, data) => {
    if(error){
        return console.log(error.message)
    } 
    console.log(data)
});


console.log(myCart.items)

