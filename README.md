Kako pokrenuti app: 

1. npm install 
2. node app.js

Rute: 
1. http://localhost:3000/api ( Provjera da li je api pokrenut )
2. http://localhost:3000/api/addProduct ( Dodavanje novog proizvoda u bazu )
3. http://localhost:3000/api/products ( Svi proizvodi iz baze podataka )
4. http://localhost:3000/api/quantity/:id ( Provjera trenutnog stanja zaliha specificnog proizvoda )
5. http://localhost:3000/api/edit/{id} ( Azurirnje stanje zaliha specificnog proizvoda )

Kratka dokumentacija, kreirana pomocu Swagger: 
1. http://localhost:3000/api/api-docs/

Kako bi izbjegli problem za sprečavanje dvostrukog ažuriranja zaliha u isto vrijeme nekog proizvoda: 
1. Nakon sto korisnik edituje stanje nekog proizvoda gdje ce mu traziti da unese 'id' od tog proizvoda i novu zalihu proizvoda, u bazi ce se spasiti proizvod sa novim stanjem zaliha
2. Nakon sto se proizvod spasi u bazu treba proci minimalno 50 sekundi kako bi se isti proizvod mogao azurirati, u protivnom ako korisnik pokusa da ponovno azurira proizvod unutar tih 50 sekundi dobit ce obavijestenje da je proizvod trenutno zakljucan

Obavjestenje kada stanje zaliha bude manja ili jednaka od 5: 
- Ovaj problem je rijesen pomocu nodemailer-a
- U svrhu testiranja ovog problema koristen je testni mail koji kada zaliha padne ispod granice, kada se neki proizvod azurira, salje u svoj inbox obavijestenje da proizvod sa tim nazivom je pao ispod odredjene granice i obavijesti koliko taj preoivod trenutno ima zaliha 

Da bi pristupili mailu i provjerili obavijestenja: 
1. email: zadatakt@gmail.com
2. password: Ztest1234 
Prilikom pokusavanja pristupa mailu zadrzait ce vam "2-Step Verification"
Kako bi izbjegli ovo pristupite sljedecim koracima: 
1. Try another way
2. Enter one of your 8-digit backup codes
- Tu unesite jedan od sljedecih backup codes: 
  1.  4508 3778
  2.  0519 9861
  3.  5663 7764
  4.  2890 3906





