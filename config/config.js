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
        "pass": "c3020d53ff7de801c5156a92affbce30",
        "from": "mailtrap@medhatech.com.au"
        
    }
}