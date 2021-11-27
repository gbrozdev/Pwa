var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});
router.get('/notes', async function (req, res) {
    let notes = await db.get().collection('notes').find().toArray()
    res.render('notes/notes', { notes });
});

router.get('/passwords', function (req, res) {
    res.render('passwords/passwords');
});
router.get('/find', function (req, res) {
    res.render('find/find');
});
router.get('/links', function (req, res) {
    res.render('links/links');
});
//products
router.get('/products', async function (req, res) {
    let products = await db.get().collection('products').find().toArray()
    res.render('products/products', { products });
});

router.get('/products/:id', async function (req, res) {
    console.log(req.params);
    let id = req.params.id
    let product = await db.get().collection('products').findOne({ _id: ObjectId(id) })
    let items = await db.get().collection('items').find({"prodId":id}).toArray()

    res.render('products/productlist', { product,items });
});
//new note
router.get('/newnote', function (req, res) {
    res.render('notes/newnote');
});
router.post('/newnote', function (req, res) {
    console.log(req.body);
    let note = req.body
    note.time = new Date().toLocaleTimeString()
    note.date = new Date().toLocaleDateString()
    console.log(note);
    db.get().collection('notes').insertOne(note).then(async (response) => {
        let id = response.insertedId
        let note = await db.get().collection('notes').findOne({ _id: ObjectId(id) })
        res.render('notes/note', { note });
    })
});
//new product
router.get('/newproduct', function (req, res) {
    res.render('products/newproduct');
});
router.post('/newproduct', function (req, res) {
    let product = req.body;
    db.get().collection('products').insertOne(product).then(async (response) => {
        let id = response.insertedId
        let product = await db.get().collection('products').findOne({ _id: ObjectId(id) })
        res.render('products/productlist', { product });
    })
});
//new item
router.get('/newitem/:id', function (req, res) {
    let prodId = req.params.id
    res.render('products/newitem',{prodId});
});
router.post('/newitem', async function (req, res) {
    let item = req.body;
    console.log(item.prodId);
    let prodId = item.prodId;
    db.get().collection('items').insertOne(item)
    let product = await db.get().collection('products').findOne({_id:ObjectId(prodId)})

    // mongo db search many
    
    let items = await db.get().collection('items').find({"prodId":prodId}).toArray()
    res.render('products/productlist', { product,items });
    
});

router.get('/note/:id', async function (req, res) {
    let id = req.params.id
    let note = await db.get().collection('notes').findOne({ _id: ObjectId(id) })
    res.render('notes/note', { note });
});
// all search bars functional part
router.post('/search/:page', async function (req, res) {
    let page = req.params.page
    var content = req.body.search
    if (page === 'notes') {

        let notes = await db.get().collection('notes').findOne({ title: content })
        if (notes) {
            res.render('notes/notes', { notes, search: true })
        } else {
            let notes = await db.get().collection('notes').find().toArray()
            res.render('notes/notes', { notes, err: true });
        }

    } else if (page === 'products') {

        let products = await db.get().collection('products').findOne({ type: content })
        if (products) {
            res.render('products/products', { products, search: true })
        } else {
            let products = await db.get().collection('products').find().toArray()
            res.render('products/products', { products, err: true });
        }

    } else {

    }
});

router.get('/add/:amt', async function (req, res) {
    let amt = req.params.amt
    console.log(amt);
    let total = []
    total.push(amt)
    });

module.exports = router;
