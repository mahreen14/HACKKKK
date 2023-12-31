const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const uuid = require('uuid')



 authorized=false

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
if(authorized){
  res.sendFile(__dirname+"/pencils.html");
}else{
  res.sendFile(__dirname+"/index.html");
}

});

// Sign-up endpoint
app.post('/signup', (req, res) => {
  const { username, password, email, phone } = req.body;

  // Load existing user data (if any)
  let userData = [];
  try {
    const data = fs.readFileSync('users.json', 'utf-8');
    userData = JSON.parse(data);
  } catch (error) {
    console.error(error);
  }


  // Check if the username already exists
  const existingUser = userData.find((user) => user.username === username);
  if (existingUser) {
    res.send('Username already exists');
  } else {
    const u_id= uuid.v4()
    // Save the new user to the JSON file
    userData.push({u_id, username, password, email, phone });
    fs.writeFileSync('users.json', JSON.stringify(userData, null, 2));
    // res.send('Sign-up successful');
    res.redirect("/login")
  }
});

app.get("/signup",(req,res)=>{
  res.sendFile(__dirname + '/signup.html')
})


app.get("/login",(req,res)=>{
  res.sendFile(__dirname + '/login.html')
})


// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Load existing user data
  try {
    const data = fs.readFileSync('users.json', 'utf-8');
    const userData = JSON.parse(data);
    console.log(userData);

    // Check if the username and password match
    const user = userData.find((user) =>{ 
      return user.username === username && user.password === password});
    if (user) {
      authorized=true
      res.redirect('/')
    } else {
      authorized=false
      res.send('Login failed');
    }
  } catch (error) {
    console.error(error);
    res.send('Login failed');
  }
});

app.post('/addtocart', (req,res)=>{
  let product = req.body.product
  let uid=req.body.myuid
  var users_arr = fs.readFileSync("users.json","utf-8")
  var index = users_arr.find(e=>e.u_id==uid)
  if(index==-1) return res.status(400).send("bad request")
 users_arr[index].products.push(product)
fs.writeFileSync("users.json",JSON.stringify(users_arr))
return res.send({"message":"successfully added to cart"})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
