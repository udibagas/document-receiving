<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GOODS RECEIPT</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            <div class="form">
                <p><input type="number" :disabled="processing" v-model="po_number" class="po-number-input" placeholder="PO NUMBER"></p>
                <p><v-ons-button :disabled="!po_number || processing" @click.prevent="po_number = ''; error = ''" class="scan-document-btn" modifier="material">CLEAR</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanText" class="scan-document-btn">SCAN TEXT</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanCode" class="scan-document-btn">SCAN QR/BAR CODE</v-ons-button></p>
                <p><v-ons-button :disabled="!po_number || processing" @click.prevent="submitData" :class="['submit-data-btn', po_number && !processing ? 'btn-red' : '']" modifier="material">SUBMIT</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>
            </div>
        </div>

        <div class="alert-dialog-mask" v-show="poNotFoundDialog"></div>
        <div class="alert-dialog">
            <div class="alert-dialog-container" v-show="poNotFoundDialog">
                <div class="alert-dialog-title">PO NOT FOUND</div>
                <div class="alert-dialog-content">
                    <p> PO Number {{po_number}} not found. If you sure you typed it correctly press SEND NOTIFICATION. </p>
                </div>

                <div class="alert-dialog-footer">
                    <button class="alert-dialog-button alert-dialog-button--primal" @click="createNotification">SEND NOTIFICATION</button>
                    <button class="alert-dialog-button alert-dialog-button--primal" @click="poNotFoundDialog = false">CANCEL</button>
                </div>
            </div>
        </div>

        <v-ons-modal :visible="processing">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Getting data...
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import PoDetail from './PoDetail'
import NotificationForm from './NotificationForm'

export default {
    name: 'GoodsReceipt',
    data: function() {
        return {
            poNotFoundDialog: false,
            po_number: '',
            error: '',
            processing: false
        }
    },
    methods: {
        scanText: function() {
            let _this = this;
            _this.po_number = ''
            let cameraOptions = {
                quality: 100,
                correctOrientation: true,
                destinationType: Camera.DestinationType.NATIVE_URI
            };

            _this.$ons.ready(function() {
                navigator.camera.getPicture(function(imageData) {
                    textocr.recText(0, 2, imageData, function(recognizedText) {
                        _this.po_number = recognizedText.replace(/\D/g, '')
                        if (_this.po_number) {
                            _this.submitData()
                        }
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
                        orientation: 'portrait',
                        disableSuccessBeep: false
                    }
                );
            })
        },
        submitData: function() {
            let _this = this
            _this.processing = true
            _this.error = ''

            axios.get(process.env.ROOT_API + 'poDetail', {
                headers: {'Content-Type': 'text/xml'},
                params: {
                    po_number: _this.po_number,
                    api_token: window.localStorage.api_token
                }
            }).then(function(r) {
                _this.processing = false
                _this.error = ''

                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                if (jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"].E_POHEADER.PO_NUMBER === '') {
                    _this.error = ''
                    _this.poNotFoundDialog = true
                    return
                }

                let po = jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"]
                let itemList = Array.isArray(po.ET_POITEM.item) ? po.ET_POITEM.item : [po.ET_POITEM.item];
                let poConfirmation = Array.isArray(po.ET_POCONFIRMATION.item) ? po.ET_POCONFIRMATION.item : [po.ET_POCONFIRMATION.item];
                let poHistoryTotal = []

                if (po.ET_POHISTORY_TOTALS === '') {
                    poHistoryTotal = []
                } else {
                    poHistoryTotal = Array.isArray(po.ET_POHISTORY_TOTALS.item) ? po.ET_POHISTORY_TOTALS.item : [po.ET_POHISTORY_TOTALS.item];
                }

                _this.$store.commit('update', {
                    po: po,
                    poConfirmation: poConfirmation,
                    poHistoryTotal: poHistoryTotal,
                    itemList: itemList
                })

                _this.$emit('push-page', PoDetail)
            }).catch(function(e) {
                _this.processing = false
                if (e.response && e.response.status === 500) {
                    _this.error = e.response.data
                } else {
                    _this.error = "Unhandled error!"
                }
            })
        },
        createNotification: function() {
            let _this = this
            _this.poNotFoundDialog = false
            _this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        po: {
                            PO_NUMBER: _this.po_number
                        },
                        notification: {
                            problem: 'PO NOT EXIST',
                            description: ''
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 80px auto 10px;
    width: 270px;
}

.po-number-input {
    width: 100%;
    font-size: 32px;
    color: #e3342f;
    background-color: #eee;
    text-align: center;
    border: none;
    border-radius: 20px;
}

.submit-data-btn, .scan-document-btn {
    height: 30px;
    border-radius: 20px;
    width: 100%;
}

.btn-red {
    background-color: #e3342f;
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
