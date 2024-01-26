/**
 * @version: 0.0.1 
 * @description: APP Configurations 
 * 
 */
//process.env => ASM(AWS Secrets Manager)
module.exports = {
    "BASE_URI": "http://h-app-scanner.s3-website-ap-southeast-2.amazonaws.com",
    "CONSTANTS": { //constants declared here for entire app
        "ISMOCKENABLED": false,
        "IS_PROD": false,
        "PROD_DB": "hotel_app",
        "DEV_DB": "hotel_app"
    },
    "DB": {
        "username": "k_mongo",
        "password": "yUug8Jj2s0pYmXVq",
        "host": "cluster0.w4two.mongodb.net"
    },
    "EMAIL": {
        "user": "4fc722bab93a19",
        "pass": "fddfa7bc5b41e6",
        "port": 2525,
        "host": "sandbox.smtp.mailtrap.io",
        "from": "vemula04@gmail.com"
    },
    "LIVE_EMAIL": {
        "host": "live.smtp.mailtrap.io",
        "port": 587, // (recommended), 2525 or 25
        "user": "api",
        "pass": "c89a7988f1fcf1694c4421754bcadc4a",
        "from": "mailtrap@stealdeals.com.au"
        
    },
    // Port: 465
// Security Type: SSL 
// Require Authentication: Yes. 
    "ZOHO_MAIL": {
        "host": "smtp.zoho.in",
        "port": 465,
        "user": "karteek.v@zohomail.in",
        "pass": "Ujmyhn%4321",
        "from": "karteek.v@zohomail.in"
    }
}