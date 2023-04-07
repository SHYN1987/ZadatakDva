var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: {type: String,required: true},
  quantity: {type: Number,required: true},
  price: {type: Number,required: true},
  lockExpiresAt: {type: Date}
});


module.exports = mongoose.model("Product", productSchema);
