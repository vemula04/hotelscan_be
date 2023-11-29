var express = require('express');
var router = express.Router();
require("../config/db");
// const tenantModel = require("../model/tenant");
const Tenant = require('../models/tenant');
const Token = require("../models/token");
const auth = require('../middleware/auth');
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const config = require("../config/config");
const Artifact = require("../models/artifact");

const Roles = require("../models/roles");

/* GET home page. */
router.post('/onboard', async (req, res) => {
    console.log(req.body);

    const { name, url, primary_color, secondary_color, email } = (req.body);
    const { created_by, updated_by } = { "created_by": "122", "updated_by": "3242345" };
    try {
        const tenant = new Tenant({ "name": name, "url": url, "primary_color": primary_color, "secondary_color": secondary_color, "email": email, "created_by": created_by });
        const fn_tnt = await Tenant.findOne({ "email": email });
        if (!fn_tnt) {
            await tenant.save()
                .then(async (data) => {
                    console.log('Tenant Onbaroded Successfully');
                })
                .catch((err) => console.log(err));
            if (tenant) {
                const tmp_pwd = crypto.randomBytes(10).toString("hex");
                //fetch tenant role...
                const role = await Roles.findOne({ "name": "tenant" });
                //save the token of a tenant...
                const token = await new Token({
                    tenant_id: (tenant._id).toString(),
                    // token: crypto.randomBytes(255).toString("hex"), // for demo
                    token: tmp_pwd,
                    email: email,
                    role_id: role._id
                }).save();
                //email template...
                if (token) {
                    // const message = `${config.BASE_URI}/verify/${tenant._id}/${token.token}`; commented for demo
                    const message = `
                    <html xmlns="http://www.w3.org/1999/xhtml">
                        <head>
                            <meta http-equiv="content-type" content="text/html; charset=utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0;">
                            <meta name="format-detection" content="telephone=no"/>

                            <!-- Responsive Mobile-First Email Template by Konstantin Savchenko, 2015.
                            https://github.com/konsav/email-templates/  -->

                            <style>
                        /* Reset styles */ 
                        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
                        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
                        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
                        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        #outlook a { padding: 0; }
                        .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
                        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

                        /* Rounded corners for advanced mail clients only */ 
                        @media all and (min-width: 560px) {
                            .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
                        }

                        /* Set color for auto links (addresses, dates, etc.) */ 
                        a, a:hover {
                            color: #127DB3;
                        }
                        .footer a, .footer a:hover {
                            color: #999999;
                        }

                            </style>

                            <!-- MESSAGE SUBJECT -->
                            <title>Get this responsive email template</title>

                        </head>

                        <!-- BODY -->
                        <!-- Set message background color (twice) and text color (twice) -->
                        <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
                            background-color: #F0F0F0;
                            color: #000000;"
                            bgcolor="#F0F0F0"
                            text="#000000">

                        <!-- SECTION / BACKGROUND -->
                        <!-- Set message background color one again -->
                        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
                            bgcolor="#F0F0F0">

                        <!-- WRAPPER -->
                        <!-- Set wrapper width (twice) -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="wrapper">

                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 20px;
                                    padding-bottom: 20px;">

                                    <!-- PREHEADER -->
                                    <!-- Set text color to background color -->
                                    <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;
                                    color: #F0F0F0;" class="preheader">
                                        Available on&nbsp;GitHub and&nbsp;CodePen. Highly compatible. Designer friendly. More than 50%&nbsp;of&nbsp;total email opens occurred on&nbsp;a&nbsp;mobile device&nbsp;— a&nbsp;mobile-friendly design is&nbsp;a&nbsp;must for&nbsp;email campaigns.</div>

                                    <!-- LOGO -->
                                    <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
                                    <a target="_blank" style="text-decoration: none;"
                                        href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
                                        src="https://raw.githubusercontent.com/konsav/email-templates/master/images/logo-black.png"
                                        width="100" height="30"
                                        alt="Logo" title="Logo" style="
                                        color: #000000;
                                        font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>

                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- WRAPPER / CONTEINER -->
                        <!-- Set conteiner background color -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            bgcolor="#FFFFFF"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="container">

                            <!-- HEADER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
                                    padding-top: 25px;
                                    color: #000000;
                                    font-family: sans-serif;" class="header">
                                        Hotel Scanner Application
                                </td>
                            </tr>
                            
                            <!-- SUBHEADER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
                                    padding-top: 5px;
                                    color: #000000;
                                    font-family: sans-serif;" class="subheader">
                                        Works for&nbsp;All Devices
                                </td>
                            </tr>

                            <!-- HERO IMAGE -->
                            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                    padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
                                    href="javascript:void(0);"><img border="0" vspace="0" hspace="0"
                                    src="https://www.frost.com/wp-content/uploads/2023/01/Picture4-scaled.jpg"
                                    alt="Please enable images to view this content" title="Hero Image"
                                    width="560" style="
                                    width: 100%;
                                    max-width: 560px;
                                    color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
                            </tr>

                            <!-- PARAGRAPH -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <!--<tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                    padding-top: 25px; 
                                    color: #000000;
                                    font-family: sans-serif;" class="paragraph">
                                        More than 50%&nbsp;of&nbsp;total email opens occurred on&nbsp;a&nbsp;mobile device&nbsp;— a&nbsp;mobile-friendly design is&nbsp;a&nbsp;must for&nbsp;email campaigns.
                                </td>
                            </tr> -->
                            <!-- BUTTON -->
                            <!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->
                            <!--
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;
                                    padding-bottom: 5px;" class="button"><a
                                    href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                                            bgcolor="#E9703E"><a target="_blank" style="text-decoration: underline;
                                            color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
                                            href="https://github.com/konsav/email-templates/">
                                                Get the template
                                            </a>
                                    </td></tr></table></a>
                                </td>
                            </tr>
                            -->

                            <!-- LINE -->
                            <!-- Set line color -->
                            <tr>	
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="line"><hr
                                    color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                            </tr>

                            <!-- LIST -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item"><table align="center" border="0" cellspacing="0" cellpadding="0" style="width: inherit; margin: 0; padding: 0; border-collapse: collapse; border-spacing: 0;">
                                    
                                    <!-- LIST ITEM -->
                                    <tr>

                                        <!-- LIST ITEM IMAGE -->
                                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                                        <td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0;
                                            padding-top: 30px;
                                            padding-right: 20px;"><img
                                        border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;
                                            color: #000000;"
                                            src="https://klr.ac.in/wp-content/uploads/2015/11/dummy-user-1-200x200.jpg"
                                            alt="H" title="Highly compatible"
                                            width="50" height="50"></td>

                                        <!-- LIST ITEM TEXT -->
                                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                                        <td align="left" valign="top" style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                            padding-top: 40px;
                                            color: #000000;
                                            font-family: sans-serif;" class="paragraph">
                                                <b style="color: #333333;">${email}</b>
                                        </td>

                                    </tr>

                                    <!-- LIST ITEM -->
                                    <tr>

                                        <!-- LIST ITEM IMAGE -->
                                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                                        <td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0;
                                            padding-top: 30px;
                                            padding-right: 20px;"><img
                                        border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;
                                            color: #000000;"
                                            src="https://media.istockphoto.com/id/484906142/vector/lock-icon.jpg?s=612x612&w=0&k=20&c=sKHmmgJ4Su0qh9LPtrt2VpVKdXWdFBdUX8XOcK3aSfI="
                                            alt="D" title="Designer friendly"
                                            width="50" height="50"></td>

                                        <!-- LIST ITEM TEXT -->
                                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                                        <td align="left" valign="top" style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                            padding-top: 40px;
                                            color: #000000;
                                            font-family: sans-serif;" class="paragraph">
                                                <b style="color: #333333;">${tmp_pwd}</b>
                                                <!-- <br/>
                                                Sketch app resource file and a&nbsp;bunch of&nbsp;social media icons are&nbsp;also included in&nbsp;GitHub repository.
                                                -->
                                        </td>
                                        <td style="font-size: 17px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
                                                            padding-top: 40px;
                                                            color: #000000;
                                                            font-family: sans-serif;color: #127DB3;">
                                                            <a href="${config.BASE_URI}/#/${name}/tenantlogin" style="    border-radius: 15px;
                                            border: 1px solid #000;
                                            padding: 10px;
                                            background: #0c3c5b;
                                            color: #fff;
                                            text-decoration: none;"> Login </a>
                                        </td>

                                    </tr>

                                </table></td>
                            </tr>

                            <!-- LINE -->
                            <!-- Set line color -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="line"><hr
                                    color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
                                </td>
                            </tr>

                            <!-- PARAGRAPH -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
                                    padding-top: 20px;
                                    padding-bottom: 25px;
                                    color: #000000;
                                    font-family: sans-serif;" class="paragraph">
                                        Have a&nbsp;question? <a href="mailto:support@ourteam.com" target="_blank" style="color: #127DB3; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">support@ourteam.com</a>
                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- WRAPPER -->
                        <!-- Set wrapper width (twice) -->
                        <table border="0" cellpadding="0" cellspacing="0" align="center"
                            width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
                            max-width: 560px;" class="wrapper">

                            <!-- SOCIAL NETWORKS -->
                            <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                                    padding-top: 25px;" class="social-icons"><table
                                    width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border-spacing: 0; padding: 0;">
                                    <tr>

                                        <!-- ICON 1 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="F" title="Facebook"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/facebook.png"></a></td>

                                        <!-- ICON 2 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="T" title="Twitter"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/twitter.png"></a></td>				

                                        <!-- ICON 3 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="G" title="Google Plus"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/googleplus.png"></a></td>		

                                        <!-- ICON 4 -->
                                        <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                                            href="#"
                                        style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                                            color: #000000;"
                                            alt="I" title="Instagram"
                                            width="44" height="44"
                                            src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/instagram.png"></a></td>

                                    </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                            <tr>
                                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
                                    padding-top: 20px;
                                    padding-bottom: 20px;
                                    color: #999999;
                                    font-family: sans-serif;" class="footer">

                                        <!-- This email template was sent to&nbsp;you becouse we&nbsp;want to&nbsp;make the&nbsp;world a&nbsp;better place. You&nbsp;could change your <a href="${config.BASE_URI}/${name}/login" target="_blank" style="text-decoration: underline; color: #999999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;">subscription settings</a> anytime. -->

                                        <!-- ANALYTICS -->
                                        <!-- https://www.google-analytics.com/collect?v=1&tid={{UA-Tracking-ID}}&cid={{Client-ID}}&t=event&ec=email&ea=open&cs={{Campaign-Source}}&cm=email&cn={{Campaign-Name}} -->
                                        <img width="1" height="1" border="0" vspace="0" hspace="0" style="margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"
                                        src="https://raw.githubusercontent.com/konsav/email-templates/master/images/tracker.png" />

                                </td>
                            </tr>

                        <!-- End of WRAPPER -->
                        </table>

                        <!-- End of SECTION / BACKGROUND -->
                        </td></tr></table>

                        </body>
                        </html>
                    `
                    // console.log(`verification link :: ${message}`);
                    await sendEmail(email, `Tenant Onbarding Credentails - ${name}`, "", message);
                }
                res.send({
                    statusCode: 200,
                    message: "Success"
                });
            }
        } else {
            res.status(500).send({ message: "Duplicate email id", statusCode: 501 })
        }

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
// const nodemailer = require('nodemailer');
// Not working...
// router.post("/sendmail", async (req, res, next) => {
//     var transport = nodemailer.createTransport({
//         host: "smtp.elasticemail.com",
//         port: 2525,
//         auth: {
//             user: "karteek.v@gmail.com",
//             pass: "A26665B531CE76F4625F8678F17EA0E49276"
        
//         },
//         secure: true
//     });

//     const message = {
//         from: "vemula04@hotmail.com",
//         to: "karteek.v@gmail.com",
//         subject: "Subject",
//         text: "Hello SMTP Email"
//     }

//     transport.sendMail(message, (err, info) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(info);
//         }
//     });
// });

router.get("/verify/:id/:token", async (req, res, next) => {
    try {
        const tenant = await Tenant.findOne({ _id: req.params.id });
        if (!tenant) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            tenant_id: tenant._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, verified: true });
        await Token.findByIdAndRemove(token._id);
        res.send("email verified sucessfully");

    } catch (err) {
        console.log("ERROR:: verify ::", err?.message);
        res.status(401).send({ message: err?.message });
    }
});

router.get("/getTenants", async (req, res) => {
    try {

        // Query 
        const query = {};
        const options = {
            // Sort returned documents in ascending order by title (A->Z)
            sort: { name: -1 },
            // Include only the `name` and `logo` fields in each returned document
            projection: { _id: 0, name: 1, logo: 1 },
        };
        const tenant = await Tenant.find(query);
        let results = [];
        tenant.forEach((value) => {
            console.log(value);
            results.push(value);
        })
        if (tenant) {
            res.send({
                statusCode: 200,
                data: results
            }).status(200);
        } else {
            res.send({
                statusCode: 502,
                message: "No Tenants found"
            }).status(200);
        }

    } catch (err) {
        res.status(400).send(err)
    }
});
router.get("/getTenantByName", async (req, res) => {
    try {

        // Query 
        const { name } = req.query;
        const query = { name: name };
        const options = {
            // Sort returned documents in ascending order by title (A->Z)
            sort: { name: -1 },
            // Include only the `name` and `logo` fields in each returned document
            projection: { _id: 0, name: 1, logo: 1 },
        };
        const tenant = await Tenant.find(query);
        let results = [];
        tenant.forEach((value) => {
            console.log(value);
            results.push(value);
        });
        if (tenant) {
            res.send({
                statusCode: 200,
                data: results
            }).status(200);
        } else {
            res.send({
                statusCode: 502,
                message: `Please check tenant name <${name}>`
            })
        }

    } catch (err) {
        res.status(400).send(err)
    }
});
module.exports = router;
