<template>
    <v-ons-page>
        <div class="background" :style="{ backgroundImage: 'url(' + bg + ')'}"></div>
        <navbar nav="Back" @back="$emit('pop-page')"></navbar>
        <div class="main">
            <div class="logo-placeholder">&nbsp;</div>
            <span style="font-size:20px;color:#fff;">Search PO Number <br> for {{action.toUpperCase()}}</span>
            <input type="number" v-model="po_number" class="po-number-input" placeholder="PO Number">
            <div class="btn-group">
                <v-ons-row>
                    <v-ons-col @click.prevent="po_number = ''; error = ''">
                        <div>
                            <v-ons-ripple></v-ons-ripple>
                            <i class="zmdi zmdi-replay zmdi-hc-2x action-btn"></i><br>
                            Reset
                        </div>
                    </v-ons-col>
                    <v-ons-col @click.prevent="scanText">
                        <div>
                            <v-ons-ripple></v-ons-ripple>
                            <i class="zmdi zmdi-sort-asc zmdi-hc-2x action-btn"></i><br>
                            Scan Text
                        </div>
                    </v-ons-col>
                    <v-ons-col @click.prevent="scanCode">
                        <div>
                            <v-ons-ripple></v-ons-ripple>
                            <i class="zmdi zmdi-blur-linear zmdi-hc-2x action-btn"></i><br>
                            Scan Code
                        </div>
                    </v-ons-col>
                </v-ons-row>
            </div>
            <!-- <p class="error" v-if="error">{{error}}</p> -->
            <br><br>
            <v-ons-button @click.prevent="submitData" class="submit-btn">SUBMIT</v-ons-button>
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

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <v-ons-modal :visible="processing">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Requesting data...
            </p>
        </v-ons-modal>

        <div class="action-sheet-mask" v-show="selectPoActionSheet"></div>
        <div class="action-sheet" v-show="selectPoActionSheet">
            <button class="action-sheet-button" v-for="(p, i) in poNumberList" :key="i" @click="selectPoNumber(p)">{{ p }}</button>
            <button class="action-sheet-button" @click="selectPoActionSheet = false">Cancel</button>
        </div>
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
            bg: '',
            bgInterval: null,
            action: '',
            poNotFoundDialog: false,
            po_number: '',
            error: '',
            processing: false,
            submitButtonLabel: 'SEARCH PO FOR ',
            selectPoActionSheet: false,
            poNumberList: []
        }
    },
    methods: {
        selectPoNumber: function(po_number) {
            this.po_number = po_number
            this.selectPoActionSheet = false
            this.submitData()
        },
        scanText: function() {
            let _this = this;
            _this.po_number = ''
            let cameraOptions = {
                quality: 80,
                correctOrientation: true,
                destinationType: Camera.DestinationType.NATIVE_URI
            };

            _this.$ons.ready(function() {
                navigator.camera.getPicture(function(imageData) {
                    textocr.recText(0, 2, imageData, function(recognizedText) {
                        let match = recognizedText.split(',')
                            .filter(t => t.trim().length >= 9)
                            .map(m => m.replace(/\D/g, ''))
                            .filter(m => m.length === 9)

                        if (match.length === 1) {
                            _this.po_number = match[0]
                            _this.submitData()
                        }

                        if (match.length === 0) {
                            _this.error = 'PO Number pattern not found!'
                        }

                        if (match.length > 1) {
                            _this.poNumberList = match
                            _this.selectPoActionSheet = true
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
                // alert(JSON.stringify(_this.$store.state.po))

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
                        problem: { notifGroup: 'ZGPP', notifType: 'G3', notifCode: '14', description: 'PO NOT EXIST' },
                        description: '[TULIS PESAN ANDA] \n\n\nPO NUMBER : ' + _this.po_number,
                        to: 'admin',
                        po_number: _this.po_number
                    }
                }
            })
        }
    },
    mounted() {
        let _this = this
        this.bg = this.$store.state.bgList[0]
        this.bgInterval = setInterval(function() {
            _this.bg = _this.$store.state.bgList[Math.floor(Math.random() * 10)]
        }, 30000);
    },
    destroyed() {
        clearInterval(this.bgInterval);
    }
}
</script>

<style scoped>
.background {
    background-color:#3355aa;
    /* background-image: url('./assets/img/ID7.png'); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.submit-btn {
    background-color:#3acce1;
    height:50px;
    line-height:50px;
    font-size:16px;
    width: 100%;
    font-weight: bold;
    border-radius: 15px;
}

.action-btn {
    color:#3acce1;
}

.main {
    padding: 30px;
    position: absolute;
    bottom: 50px;
    width: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.po-number-input {
    width: 100%;
    font-size: 30px;
    background-color: #fff;
    text-align: center;
    border: none;
    border-radius: 15px;
    height: 50px;
    line-height: 50px;
    display: block;
    margin: 15px 0;
    font-family: 'OpenSans';
}

.btn-group {
    text-align:center;
    font-size:12px;
    border-radius:15px;
    padding:30px 10px;
    background: #fff;
}

.nav {
    background-color: rgba(0, 0, 0, .5);
    color:white;
    height:50px;
    line-height: 50px;
    position:fixed;
    top:0;
    width:100%;
    font-size: 12px;
    padding: 0 15px;
    box-shadow: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.logo-placeholder {
    background-image: url('./assets/img/logo-white.png');
    background-size: 150px;
    background-repeat: no-repeat;
    height: 40px;
}
</style>
