const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
console.log(__dirname);

// MySQL connection
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mydb21"
});

con.connect((err) => {
    if (err) {
        console.error("Database Connection Failed: " + err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Route: Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "Ulogin.html"));
});

// Route: Register User
app.post('/reg', (req, res) => {
    const { full_Name, village, email, password } = req.body;
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";

    con.query(checkUserQuery, [email], (err, results) => {
        if (err) return res.status(500).send("Internal Server Error");

        if (results.length > 0) {
            res.sendFile(path.join(__dirname, "Ulogin.html"));
        } else {
            const insertQuery = "INSERT INTO users (full_name, village, email, password, user_type) VALUES (?, ?, ?, ?, ?)";
            con.query(insertQuery, [full_Name, village, email, password, 'customer'], (err, result) => {
                if (err) return res.status(500).send("Internal Server Error");
                res.sendFile(path.join(__dirname, "Ulogin.html"));
            });
        }
    });
});

// Route: Login
app.post("/login", (req, res) => {
    const username = req.body.email;
    const pwd = req.body.password;

    con.query("SELECT * FROM users WHERE email = ? AND password = ?", [username, pwd], (err, result) => {
        if (err) return res.status(500).send("Server error");

        if (result.length > 0) {
            const userType = result[0].user_type;
            if (userType === "customer") {
                res.sendFile(path.join(__dirname, "/Homepage.html"));
            } else if (userType === "admin") {
                res.sendFile(path.join(__dirname, "/AdminDashboard.html"));
            } else {
                res.status(400).send("Unknown user type");
            }
        } else {
            res.status(401).send("Invalid email or password");
        }
    });
});

// Route: Contact Us
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "All fields are required." });

    const sql = "INSERT INTO contactUs (name, email, message) VALUES (?, ?, ?)";
    con.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ success: true, message: "Message saved successfully!" });
    });
});

// Route: Place Order
app.post("/cartData", (req, res) => {
    const { name, address, pincode, phone, payment } = req.body;
    if (!name || !address || !pincode || !phone || !payment) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const sql = "INSERT INTO orders (name, address, pincode, phone, payment_method) VALUES (?, ?, ?, ?, ?)";
    con.query(sql, [name, address, pincode, phone, payment], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ success: true, message: "Order placed successfully!" });
    });
});

// Route: Get Orders
app.get("/get-orders", (req, res) => {
    con.query("SELECT * FROM orders", (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result);
    });
});

// Route: Confirm Order
app.post("/confirm-order", (req, res) => {
    const orderId = req.body.id;
    con.query("UPDATE orders SET status = 'confirmed' WHERE id = ?", [orderId], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: "Update failed" });
        res.json({ success: true });
    });
});

// === Recommendation Logic ===
const cropData = {
    "ఎర్ర మట్టి": "వేరుశెనగలు, మక్కజొన్న, కంది పప్పు, జొన్న, గోధుమలు",
    "నల్ల మట్టి": "పత్తి, సోయాబీన్, సూర్యకాంతి, శెనగలు",
    "అల్లూవియల్ మట్టి": "బియ్యం, చెరకు, పప్పు ధాన్యాలు, గోధుమలు",
    "లాటరైట్ మట్టి": "జీడిపప్పు, అరటిపండ్లు, కాఫీ, చాయ్",
    "సిల్టీ మట్టి": "మొక్కజొన్న, సోయాబీన్",
    "పీటీ మట్టి": "వేరుశెనగలు, మూలధాన పంటలు",
    "చాకీ మట్టి": "బీట్‌రూట్, స్పినాచ్",
    "ఇసుక మట్టి": "కర్పూర విత్తనాలు, వేరుశెనగలు, బంగాళాదుంపలు",
    "లామీ మట్టి": "గోధుమలు, చెరకు, పత్తి, పప్పు ధాన్యాలు"
};

app.post('/recommend', (req, res) => {
    const soil = req.body.soilType.trim();
    const crops = cropData[soil] || "ఈ మట్టి రకం కొరకు పంట సిఫారసులు అందుబాటులో లేవు.";
    res.json({ crops });
});

// Optional: Error handler middleware (for better debugging)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send("Something broke!");
});

app.listen(9933, () => {
    console.log("Server running on http://localhost:9933");
});
