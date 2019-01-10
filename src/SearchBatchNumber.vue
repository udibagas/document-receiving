<template>
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')"></navbar>
        <div class="content">
            <img style="width:130px;" src="./assets/img/logo-white.png"><br>
            <span style="font-size:20px;color:#fff;">Search Batch Number <br> for Quality Inspection</span>
            <div class="form">
                <input type="number" v-model="batch_number" class="po-number-input" placeholder="BATCH NUMBER">
                <div class="btn-group">
                <v-ons-row>
                    <v-ons-col @click.prevent="batch_number = ''; error = ''">
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
        </div>

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <div class="action-sheet-mask" v-show="selectBatchActionSheet"></div>
        <div class="action-sheet" v-show="selectBatchActionSheet">
            <button class="action-sheet-button" v-for="(b, i) in batchNumberList" @click="selectBatchNumber(b)" :key="i">{{ b }}</button>
            <button class="action-sheet-button" @click="selectBatchActionSheet = false">Cancel</button>
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
import InspectionForm from './InspectionForm'

export default {
    computed: {
        inspectionCharacteristics() {
            return this.$store.state.inspectionCharacteristics
        }
    },
    data: function() {
        return {
            batch_number: '',
            error: '',
            processing: false,
            selectBatchActionSheet: false,
            batchNumberList: []
        }
    },
    methods: {
        selectBatchNumber: function(po_number) {
            this.batch_number = po_number
            this.selectBatchActionSheet = false
            this.submitData()
        },
        scanText: function() {
            let _this = this;
            _this.batch_number = ''
            let cameraOptions = {
                quality: 80,
                correctOrientation: true,
                destinationType: Camera.DestinationType.NATIVE_URI
            };

            _this.$ons.ready(function() {
                navigator.camera.getPicture(function(imageData) {
                    textocr.recText(0, 2, imageData, function(recognizedText) {
                        let match = recognizedText.split(',')
                            .filter(t => t.trim().length >= 10)
                            .map(m => m.replace(/\D/g, ''))
                            .filter(m => m.length === 10)

                        if (match.length === 1) {
                            _this.batch_number = match[0]
                            _this.submitData()
                        }

                        if (match.length === 0) {
                            _this.error = 'Batch Number pattern not found!'
                        }

                        if (match.length > 1) {
                            _this.batchNumberList = match
                            _this.selectBatchActionSheet = true
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
                        _this.batch_number = result.text
                        if (_this.batch_number) {
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
            if (!this.batch_number) {
                return
            }

            let _this = this
            _this.processing = true
            _this.error = ''

            axios.get(process.env.ROOT_API + 'inspection', {
                params: {
                    batch_number: _this.batch_number,
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

                let inspection = jsonData.Envelope.Body["ZFM_INSPOPER_GETDETAIL.Response"]
                if (inspection.ET_CHAR_REQUIREMENTS === '') {
                    _this.error = 'Batch number not found'
                } else {
                    // alert(JSON.stringify(inspection.ET_CHAR_RESULTS))
                    // if (inspection.ET_CHAR_RESULTS.item[0].EVALUATED === 'X') {
                    //     _this.error = 'Ispection is done for this batch number'
                    //     return
                    // }
                    // alert(JSON.stringify(inspection))
                    inspection.ET_CHAR_REQUIREMENTS.item.forEach(function(cr, idx) {
                        let c = _this.inspectionCharacteristics.find(ic => ic.mstr_char === cr.MSTR_CHAR)
                        if (c) {
                            inspection.ET_CHAR_RESULTS.item[idx].CHARACTERISTIC = c.options.find(o => o.code === inspection.ET_CHAR_RESULTS.item[idx].CODE1) || c.default
                        } else {
                            inspection.ET_CHAR_RESULTS.item[idx].CHARACTERISTIC = { group: '', code: '', description: '[UNREGISTERED CHARACTERISTIC]' }
                        }
                    })

                    let evaluation = {}
                    inspection.ET_CHAR_RESULTS.item.forEach(function(cr) {
                        evaluation[cr.INSPCHAR] = cr.EVALUATION !== 'R'
                    })

                    // alert(JSON.stringify(inspection.ET_CHAR_RESULTS.item))

                    _this.$emit('push-page', {
                        extends: InspectionForm,
                        data: function() {
                            return {
                                batch_number: _this.batch_number,
                                inspection: inspection,
                                evaluation: evaluation
                            }
                        }
                    })
                }
            }).catch(function(e) {
                _this.processing = false
                if (e.response && e.response.status === 500) {
                    _this.error = e.response.data
                } else {
                    _this.error = e
                }
            })
        }
    }
}
</script>

<style scoped>
.background {
    background-color:#3355aa;
    background-image: url('./assets/img/ID7.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: color-dodge;
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

.content {
    margin: 200px auto 0;
    padding: 30px;
}

.po-number-input {
    width: 100%;
    font-size: 16px;
    background-color: #fff;
    text-align: center;
    border: none;
    border-radius: 15px;
    height: 50px;
    line-height: 50px;
    display: block;
    margin: 15px 0;
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
</style>
