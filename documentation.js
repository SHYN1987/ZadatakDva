const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const Product = require("./models/product")
const sendEmail = require("./mailer/sendMail");

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Zadatak API",
        version: '1.0',
      },
    },
    apis: ["documentation.js"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  
    /**
     * @swagger
     * /api:
     *   get:
     *     description: Check API 
     *     responses:
     *       200:
     *         description: Success
     * 
     */
     app.get("/", (req, res) => {
        res.status(201).json({
          message: "Welcome to the API."
        });
      });

    /**
 * @swagger
 * /api/addProduct:
 *   post:
 *     summary: Dodaj novi proizvod
 *     description: Dodavanje proizvoda
 *     parameters:
 *      - name: name
 *        description: Naziv proizvoda
 *        in: formData
 *        required: true
 *        type: string
 *      - name: quantity
 *        description: Zaliha Proizvoda
 *        in: formData
 *        required: true
 *        type: number
 *      - name: price
 *        description: Cijena Proizvoda
 *        in: formData
 *        required: true
 *        type: number
 *     responses:
 *       201:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
     app.post("/addProduct", async (req, res) => {
      try {
          const product = new Product()
          product.name = req.body.name,
          product.quantity = req.body.quantity,
          product.price = req.body.price,
          product.save((error, result) => {
              if (error) {
                  console.log(error)
                res.status(500).json({
                  message: "Doslo je do greske."
                })
              } else {
                  res.status(201).json({
                    message: "Proizvod kreiran.",
                    data: result
                  });
              }
          })
      } catch(e) {
          console.log(e)
          res.status(500).json({
            message: "Doslo je do greske."
          })
      }
  });

  /**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Svi Proizvodi
 *     description: Svi Proizvodi 
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Proizvodi ne postoje
 *       500:
 *         description: Internal server error
 */

   app.get("/products",(req, res) => {
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

/**
 * @swagger
 * /api/quantity/{id}:
 *   get:
 *     summary: Pronadji zalihu proizvoda pomocu id
 *     description: Pronadji zalihu proizvoda pomocu id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Id proizvoda
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Proizvod ne postoji
 *       500:
 *         description: Internal server error
 */

 app.get("/quantity/:id",(req, res) => {
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



  

/**
 * @swagger
 * /api/edit/{id}:
 *   put:
 *     summary: Azuriranje zaliha
 *     description: Azuriranje zaliha
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user 
 *         required: true
 *         schema:
 *           type: string
 *       - name: quantity
 *         description: Zaliha Proizvoda
 *         in: formData
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Proizvod nije pronadjen
 *       500:
 *         description: Internal server error
 */


   app.put('/edit/:id', async (req, res) => {
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
          message: "Proizvod je zakljucan, pokusaj kasnije, trenutno stanje proizvoda:",
          data: product.quantity,
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

  module.exports = app