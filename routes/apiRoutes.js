const express = require("express");
const router = express.Router()
const Product = require("../models/product")
const sendEmail = require("../mailer/sendMail");

router.get("/", (req, res) => {
  res.status(201).json({
    message: "Welcome to the API."
  });
});

router.post("/addProduct", async (req, res) => {
    try {
        const product = new Product()
        product.name = req.body.name,
        product.quantity = req.body.quantity,
        product.price = req.body.price,
        product.save((error, result) => {
            if (error) {
                console.log(error)
              res.status(500).json({
                message: "An error has occured."
              })
            } else {
                res.status(201).json({
                  message: "Product created.",
                  data: result
                });
            }
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({
          message: "An error has occured."
        })
    }
});

router.get("/products",(req, res) => {
  Product.find(function (err, product) {
    if (err) {
      console.log(err)
      return res.status(401).json({
        message: "Proizvodi ne postoje."
      });
    }
    if (product) {
      console.log("logged in")
      return res.status(200).json({
        message: "Proizvodi pronadjeni",
        data: product
      });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get("/quantity/:id",(req, res) => {
  Product.findOne({ _id: req.params.id }, function (err, product) {
    if (err) {
      console.log(err)
      return res.status(401).json({
        message: "Proizvod ne postoji."
      });
    }
    if (product) {
      console.log("logged in")
      return res.status(200).json({
        message: "Trenutno stanje proizvoda",
        quantity: product.quantity
      });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.put('/edit/:id', async (req, res) => {
  const productId = req.params.id;
  const update = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Proizvod nije pronadjen');
    }
    
    const now = Date.now();
    if (product.lockExpiresAt && product.lockExpiresAt > now) {
      return res.status(409).send({
        message: "Proizvod is locked, data of product:",
        data: product,
      });
    }
    const lockTime = now + 50000; // 50 sekundi
    product.lockExpiresAt = lockTime;
    product.quantity = update.quantity;
    await product.save();

    if(product.quantity <= 5){
     await sendEmail(product.name,product.quantity)
    }
    setTimeout(async () => {
      product.lockExpiresAt = null;
      await product.save();
    }, 50000);

    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;








// Get All Serums 
// router.get("/serums",(req, res) => {
//   Serum.find(function (err, serum) {
//     if (err) {
//       console.log(err)
//       return res.status(401).json({
//         message: "Serum does not exist."
//       });
//     }
//     if (serum) {
//       console.log("logged in")
//       return res.status(200).json({
//         message: "Serum found",
//         data: serum
//       });
//     }
//   }).catch(err => {
//     console.log(err);
//     res.status(500).json({
//       error: err
//     });
//   });
// });

module.exports = router