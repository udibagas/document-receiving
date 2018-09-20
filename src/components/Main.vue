<template>
    <v-ons-page>
        <div class="background"></div>
        <div class="content">
            <img src="../assets/logo.png"><br>
            <strong>MATERIAL HANDLING</strong><br>
            <div class="form">
                <p><input type="number" v-model="po_number" class="po-number-input" placeholder="PO NUMBER"></p>
                <p><v-ons-button :disabled="!po_number" @click.prevent="po_number = ''; error = ''" class="scan-document-btn" modifier="material">CLEAR</v-ons-button></p>
                <p><v-ons-button @click.prevent="scanText" class="scan-document-btn">SCAN TEXT</v-ons-button></p>
                <p><v-ons-button @click.prevent="scanCode" class="scan-document-btn">SCAN QR/BAR CODE</v-ons-button></p>
                <p><v-ons-button :disabled="!po_number" @click.prevent="submitData" :class="['submit-data-btn', po_number ? 'btn-red' : '']" modifier="material">SUBMIT</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>
            </div>
        </div>

        <v-ons-dialog :visible.sync="alert.show">
            <div style="text-align:center;padding:15px;">
                <p v-if="alert.title"><strong>{{alert.title}}</strong></p>
                <p>{{alert.message}}</p>
                <br>
                <p><v-ons-button class="full-width btn-round" @click.prevent="alert.show = false">OK</v-ons-button></p>
            </div>
        </v-ons-dialog>

        <v-ons-bottom-toolbar>
            <v-ons-row>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:5px;" modifier="material--flat" @click.prevent="exit">EXIT APP</v-ons-button>
                </v-ons-col>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:5px;" modifier="material--flat" @click.prevent="logout">LOGOUT</v-ons-button>
                </v-ons-col>
            </v-ons-row>
        </v-ons-bottom-toolbar>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import Login from './Login'
import PoDetail from './PoDetail'

export default {
    data: function() {
        return {
            po_number: '',
            error: '',
            alert: {
                title: '',
                show: false,
                message: ''
            }
        }
    },
    methods: {
        logout: function() {
            window.localStorage.isLoggedIn = null
            window.localStorage.user = null
            this.$emit('replace-page', Login);
        },
        exit: function() {
            window.localStorage.isLoggedIn = null
            window.localStorage.user = null
            navigator.app.exitApp()
        },
        scanText: function() {
            let _this = this;
            _this.po_number = '';

            let cameraOptions = {
                quality: 100,
                correctOrientation: true,
                destinationType: Camera.DestinationType.NATIVE_URI
            };

            _this.$ons.ready(function() {
                navigator.camera.getPicture(function(imageData) {
                    textocr.recText(0, 2, imageData, function(recognizedText) {
                        _this.po_number = recognizedText
                    }, function(message) {
                        _this.error = 'Failed to read text: ' + message
                    });
                }, function(message) {
                    _this.error = message
                }, cameraOptions);
            });
        },
        scanCode: function() {
            let _this = this
            _this.$ons.ready(function() {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        _this.po_number = result.text
                        if (_this.po_number) {
                            _this.submitData()
                        }
                    },
                    function (error) {
                        alert('Scanning failed: ' + error);
                    },
                    {
                        preferFrontCamera: false,
                        showFlipCameraButton: true,
                        showTorchButton: true,
                        torchOn: false,
                        saveHistory: true,
                        prompt: 'Place a barcode inside the scan area',
                        resultDisplayDuration: 500,
                        // formats: 'QR_CODE,CODE_128',
                        orientation: 'portrait',
                        disableSuccessBeep: false
                    }
                );
            })
        },
        submitData: function() {
            let _this = this

            let apiUrl = 'http://sapgmfdpi.gmf-aeroasia.co.id:52500/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_POGetDetail&receiverParty=&receiverService=&interface=POGetDetail_OB_SI&interfaceNamespace=urn:gmf-aeroasia.co.id:POGetDetail'

            let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">\
                <soapenv:Header/>\
                <soapenv:Body>\
                    <urn:BAPI_PO_GETDETAIL1>\
                        <PURCHASEORDER>' + _this.po_number + '</PURCHASEORDER>\
                    </urn:BAPI_PO_GETDETAIL1>\
                </soapenv:Body>\
            </soapenv:Envelope>'

            _this.error = 'Getting data...'

            axios.post(apiUrl, xmls, {
                headers: {'Content-Type': 'text/xml'},
                auth: {
                    username: process.env.SAP_API_USERNAME,
                    password: process.env.SAP_API_PASSWORD
                }
            }).then(function(r) {
                _this.error = ''

                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                if (jsonData.Envelope.Body["BAPI_PO_GETDETAIL1.Response"].POHEADER.PO_NUMBER === '') {
                    _this.error = 'PO #' + _this.po_number + ' NOT FOUND!'
                    return
                }

                let po = jsonData.Envelope.Body["BAPI_PO_GETDETAIL1.Response"]
                let itemList = (typeof po.POITEM.item[0] === 'object') ? po.POITEM.item : [po.POITEM.item];
                let poConfirmation = (typeof po.POCONFIRMATION.item[0] === 'object') ? po.POCONFIRMATION.item : [po.POCONFIRMATION.item];
                let poHistoryTotal = []

                if (po.POHISTORY_TOTALS === '') {
                    poHistoryTotal = []
                } else {
                    poHistoryTotal = (typeof po.POHISTORY_TOTALS.item[0] === 'object') ? po.POHISTORY_TOTALS.item : [po.POHISTORY_TOTALS.item];
                }

                // alert(JSON.stringify(poHistoryTotal))

                _this.$emit('push-page', {
                    extends: PoDetail,
                    data: function() {
                        return {
                            po: po.POHEADER,
                            poConfirmation: poConfirmation,
                            poHistoryTotal: poHistoryTotal,
                            itemList: itemList
                        }
                    }
                })
            }).catch(function(e) {
                if (e.response) {
                    if (e.response.status === 500) {
                        _this.error = 'Internal server error: ' + JSON.stringify(e.response.data)
                    }

                    if (e.response.status === 404) {
                        _this.error = 'Wrong API URL: ' + apiUrl
                    }
                }

                _this.error = "Unhandled error!"
                // alert(JSON.stringify(e))
            })
        }
    }
}
</script>

<style scoped>
.background {
    background-color: white;
}

.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 100px auto 10px;
    width: 270px;
}

img {
    width: 200px;
    margin: 10px auto;
}

.po-number-input {
    width: 100%;
    font-size: 32px;
    color: red;
    background-color: #eee;
    text-align: center;
    border: 1px solid #eee;
}

.full-width {
    display: block;
    width: 100%;
    margin-bottom: 5px;
}

.btn-round {
    border-radius: 20px;
}

.submit-data-btn, .scan-document-btn {
    font-size: 20px;
    height: 30px;
    font-weight: normal;
    border-radius: 20px;
    width: 100%;
}

.btn-red {
    background-color: red;
}

.error {
    color: red;
}

::-webkit-input-placeholder {
   text-align: center;
   font-weight: lighter;
}

:-moz-placeholder { /* Firefox 18- */
   text-align: center;
   font-weight: lighter;
}

::-moz-placeholder {  /* Firefox 19+ */
   text-align: center;
   font-weight: lighter;
}

:-ms-input-placeholder {
   text-align: center;
   font-weight: lighter;
}
</style>
