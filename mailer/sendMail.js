const nodemailer = require("nodemailer");

const sendEmail = async (naziv, zaliha) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: "zadatakt@gmail.com",
              pass: "jqghwrcesyumomca"
            }
        });
        
        await transporter.sendMail({
            from: "zadatakt@gmail.com",
            to: "zadatakt@gmail.com",
            subject: "Zaliha Proizvoda",
            text: `Proizvod ${naziv} je pri isteku zaliha. Trenutna zaliha proizvoda:  ${zaliha}`,
        });

        console.log("Email poslan uspijesno");
    } catch (error) {
        console.log("Email nije poslan uspijesno");
    }
   

};

module.exports = sendEmail;