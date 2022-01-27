let express = require('express')
let fs = require('fs')
let app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/all', ((req, res) => {
    let list_paintings = require('./paintings.json')
    res.json(list_paintings)
}))

app.get('/shopcart', ((req, res) => {
    let list = require('./shopcart.json')
    res.json(list)
}))

app.get('/all/:id', (req, res) => {
    let id = +req.params.id
    let list_of_paintings = require('./paintings.json')
    let counter = 1
    for(const object of list_of_paintings){
        if(counter === id) {
            var result = object
            break
        } else
            counter++
    }
    res.json(result)
})

app.get('/reload', (req, res) => {
    let rewrite = require('./paintings-backup.json')
    fs.writeFileSync('./paintings.json', JSON.stringify(rewrite))
    fs.writeFileSync('./shopcart.json', JSON.stringify([]))
    res.json({status: 'OK'})
})

app.post('/delete', (req, res) => {
    let objectID = +req.body.objectID

    let json = require('./paintings.json')
    let shop_cart = require('./shopcart.json')

    let new_shop_cart = []
    let new_json = []

    let shop_cart_obj

    for(const object of json)
        if(objectID !== object.objectID)
            new_json.push(object)
        else
            shop_cart_obj = object

    for(const object of shop_cart)
        new_shop_cart.push(object)
    new_shop_cart.push(shop_cart_obj)

    fs.writeFileSync('paintings.json', JSON.stringify(new_json))
    fs.writeFileSync('shopcart.json', JSON.stringify(new_shop_cart))
    res.json({status: 'OK'})
})

app.listen(3000)