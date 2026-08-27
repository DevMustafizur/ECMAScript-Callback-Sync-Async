// syncronus
class myError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
    }
}


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


function myCart(userId) {
    this.userId = userId;
    this.carts = [];
}

myCart.prototype.findProduct = function (productId, callback) {
    let findProduct = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].productId === productId) {
            findProduct = products[i];
            break;
        }
    }
    if (findProduct) {
        return callback(null, findProduct)
    }
    return callback(new myError("Product Not Found", 404), null)
}

myCart.prototype.checkStock = function (productId, quantity, callback) {
    this.findProduct(productId, (error, data) => {
        if (error) {
            return callback(error)
        }
        if (data.stock < quantity) {
            return callback(new myError("Stock insufficient", 404), null)
        }
        return callback(null, data)
    })
}

myCart.prototype.findCartItem = function (productId, callback) {
    let findProduct = null
    for (let i = 0; i < this.carts.length; i++) {
        if (this.carts[i]?.productId === productId) {
            findProduct = this.carts[i]
            break
        }
    }
    if (findProduct) {
        return callback(new myError("Product already added to cart", 404), null)
    }
    return callback(null, "Product not found, you can add this product to cart")
}

myCart.prototype.calculatePrice = function (productId, quantity, callback) {
    this.findProduct(productId, (error, data) => {
        if (error) {
            return callback(error, null)
        }
        const totalPrice = data.price * quantity;
        return callback(null, totalPrice)
    })
}

myCart.prototype.saveCartItem = function (productId, quantity, totalPrice, callback) {
    const storeCart = {
        productId,
        quantity,
        totalPrice,
    }

    const result = this.carts.push(storeCart)
    if (!result) {
        return callback(new myError("something went wrong", 404), null)
    }
    return callback(null, { success: true, message: "cart added", data: storeCart })
}

myCart.prototype.addToCart = function (productId, quantity, callback) {
    this.findProduct(productId, (error, data) => {
        if (error) {
            return callback(error, null)
        }
        this.checkStock(productId, quantity, (error, data) => {
            if (error) {
                return callback(error, null)
            }
            this.findCartItem(productId, (error, data) => {
                if (error) {
                    return callback(error, null)
                }
                this.calculatePrice(productId, quantity, (error, totalPrice) => {
                    if (error) {
                        return callback(error)
                    }
                    this.saveCartItem(productId, quantity, totalPrice, (error, info) => {
                        if (error) {
                            return callback(error, null)
                        }
                        return callback(null, info)
                    })
                })
            })
        })
    })
}

const user1 = new myCart("10001")

// first added
user1.addToCart(101, 4, (error, data) => {
    if (error) {
        console.log(error.message)
    }
    if (data) {
        console.log(data)
    }
})


// second added
user1.addToCart(101, 5, (error, data) => {
    if (error) {
        console.log(error.message)
    }
    if (data) {
        console.log(data)
    }
})

// third added
user1.addToCart(101, 2, (error, data) => {
    if (error) {
        console.log(error.message)
    }
    if (data) {
        console.log(data)
    }
})


// fourth added
user1.addToCart(101, 1, (error, data) => {
    if (error) {
        console.log(error.message)
    }
    if (data) {
        console.log(data)
    }
})

console.log('this is a work')

