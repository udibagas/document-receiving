<template>
    <v-ons-page>
        <!-- <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEARCH PO FOR {{action.toUpperCase()}}</div>
        </v-ons-toolbar> -->
        <div class="background"></div>
        <div class="content">
            <img style="width:80%;margin:0 auto 0;" src="../assets/logo-white.png"><br>
            <div class="form">
                <input type="number" v-model="po_number" class="po-number-input" placeholder="PO NUMBER">
                <br><br>
                <v-ons-row>
                    <v-ons-col width="50%" class="btn-submit" @click.prevent="submitData">
                        <div style="line-height:120px;"> SUBMIT </div>
                    </v-ons-col>
                    <v-ons-col width="50%" class="btn-reset" @click.prevent="po_number = ''; error = ''">
                        <div style="line-height:120px;"> RESET </div>
                    </v-ons-col>
                </v-ons-row>
                <v-ons-row>
                    <v-ons-col width="50%" class="btn-ocr" @click.prevent="scanText">
                        <div style="line-height:120px;"> SCAN TEXT </div>
                    </v-ons-col>
                    <v-ons-col width="50%" class="btn-barcode" @click.prevent="scanCode">
                        <div style="line-height:120px;"> SCAN CODE </div>
                    </v-ons-col>
                </v-ons-row>
                <p class="text-white" v-if="error">{{error}}</p>
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
                Requesting data...
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import Inbound from './Inbound'
import GoodsReceipt from './GoodsReceipt'
import MrirNotification from './MrirNotification'
import NotificationForm from './NotificationForm'

export default {
    name: 'GoodsReceipt',
    data: function() {
        return {
            action: '',
            poNotFoundDialog: false,
            po_number: '',
            error: '',
            processing: false,
            submitButtonLabel: 'SEARCH PO FOR '
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
            if (!this.po_number) {
                return
            }

            let _this = this
            _this.processing = true
            _this.error = ''

            let po_number = _this.po_number.length === 9 ? '0' + _this.po_number : _this.po_number

            axios.get(process.env.ROOT_API + 'poDetail', {
                params: {
                    po_number: po_number,
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

                _this.$store.state.po = jsonData.Envelope.Body["ZFM_PO_OUTBOUND.Response"]

                if (_this.action === 'inbound') {
                    _this.$emit('push-page', Inbound)
                }

                if (_this.action === 'gr') {
                    _this.$emit('push-page', GoodsReceipt)
                }

                if (_this.action === 'mrir') {
                    _this.$emit('push-page', MrirNotification)
                }
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
                        problem: { notifType: 'G3', description: 'PO NOT EXIST' },
                        description: '[TULIS PESAN ANDA] \n\n\nPO NUMBER : ' + _this.po_number,
                        to: 'admin',
                        po_number: _this.po_number
                    }
                }
            })
        }
    },
    mounted: function() {
        this.submitButtonLabel += this.action.toUpperCase()
    }
}
</script>

<style scoped>

.background {
    background-color:#3355aa;
    /* background-image: url('../assets/bg_main_cropped.jpg'); */
    background-image: url('http://13.76.153.42/material-receiving-and-inspection-dev/images/bg_main_cropped.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: color-dodge;
}

.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 40px auto 10px;
    width: 80%;
}

.po-number-input {
    width: 100%;
    font-size: 32px;
    /* color: #e3342f; */
    background-color: #eee;
    text-align: center;
    border: none;
    border-radius: 2px;
    height: 80px;
    line-height: 80px;
}

.btn-submit, .btn-reset, .btn-ocr, .btn-barcode {
    height: 120px;
    /* border-radius: 30px; */
    text-align: center;
    color: #fff;
    opacity: 0.8;
    font-size: 20px;
}

.btn-submit {
    background-color: #e17d7d;
    border-top-left-radius: 2px;
}

.btn-reset {
    background-color: #5073a1;
    border-top-right-radius: 2px;
}

.btn-ocr {
    background-color: #89ef90;
    border-bottom-left-radius: 2px;
}

.btn-barcode {
    background-color: #dfd369;
    border-bottom-right-radius: 2px;
}

::-webkit-input-placeholder {
   font-weight: lighter;
}

:-moz-placeholder { /* Firefox 18- */
   font-weight: lighter;
}

::-moz-placeholder {  /* Firefox 19+ */
   font-weight: lighter;
}

:-ms-input-placeholder {
   font-weight: lighter;
}
</style>
