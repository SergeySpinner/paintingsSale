/**
 * Configuration of NodeJS Server
 */
const express = require('express')
const app = express()
const xmlRequest = require('xmlhttprequest').XMLHttpRequest
const mainUrl = 'http://localhost:3000'
/**
 * Configuration for parsing data from POST requests
 */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
/**
 * Configuration for work with views
 */
app.set('view engine','hbs')
app.set('views','./views')
app.use(express.static(__dirname + '/views'))
/**
 * Information of paintings
 * @returns JSON array
 */
let get_gallery = () => {
    let request = new xmlRequest()
    request.open('GET', mainUrl + '/all', false)
    let answer
    request.onload = () => {answer = JSON.parse(request.responseText)}
    request.send()
    return JSON.parse(request.responseText)
}
/**
 * Information of shopcart paintings
 * @returns JSON array
 */
let get_shop_cart = () => {
    let request = new xmlRequest()
    request.open('GET', mainUrl + '/shopcart', false)
    let answer
    request.onload = () => {answer = JSON.parse(request.responseText)}
    request.send()
    return JSON.parse(request.responseText)
}
/**
 * Renders Main Page
 * @param req - request of GET method
 * @param res - response of GET method
 */
let render_main_page = (req,res) => {
    let answer = get_gallery()
    res.render('index.hbs', {list: answer})
}
/**
 * GET method to render Main Page
 */
app.get('/gallery', (req, res) => render_main_page(req,res))

app.get('/shopcart',(req, res) => {
    let answer = get_shop_cart()
    res.render('shopcart.hbs',{list: answer})
})

app.post('/buy_painting', (req,res) => {
    let list_of_paintings = get_gallery()
    let painting = list_of_paintings.filter(value => value.objectID === +req.body.objectID)[0]

    const xhr = new xmlRequest()
    xhr.open('POST', mainUrl + '/delete', false)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({objectID: req.body.objectID}))

    res.render('thankful.hbs',{
        painting: painting,
        constituents:painting.constituents[0]
    })
})

app.listen(5000)