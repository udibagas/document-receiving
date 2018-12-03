<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEARCH BATCH NUMBER</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            <img style="width:80%;margin:0 auto 0;" src="../assets/logo-white.png"><br>
            <div class="form">
                <input type="number" v-model="batch_number" class="po-number-input" placeholder="BATCH NUMBER">
                <br><br>
                <v-ons-row>
                    <v-ons-col width="50%" class="btn-submit" @click.prevent="submitData">
                        <div style="line-height:120px;">
                            <v-ons-ripple></v-ons-ripple>
                            SUBMIT
                        </div>
                    </v-ons-col>
                    <v-ons-col width="50%" class="btn-reset" @click.prevent="batch_number = ''; error = ''">
                        <div style="line-height:120px;">
                            <v-ons-ripple></v-ons-ripple>
                            RESET
                        </div>
                    </v-ons-col>
                </v-ons-row>
                <v-ons-row>
                    <v-ons-col width="50%" class="btn-ocr" @click.prevent="scanText">
                        <div style="line-height:120px;">
                            <v-ons-ripple></v-ons-ripple>
                            SCAN TEXT
                        </div>
                    </v-ons-col>
                    <v-ons-col width="50%" class="btn-barcode" @click.prevent="scanCode">
                        <div style="line-height:120px;">
                            <v-ons-ripple></v-ons-ripple>
                            SCAN CODE
                        </div>
                    </v-ons-col>
                </v-ons-row>
                <!-- <p class="error" v-if="error">{{error}}</p> -->
            </div>
        </div>

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <div class="action-sheet-mask" v-show="selectBatActionSheet"></div>
        <div class="action-sheet" v-show="selectBatActionSheet">
            <button class="action-sheet-button" v-for="b in batchNumberList" @click="selectBatchNumber(b)">{{ b }}</button>
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
                quality: 100,
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
                        inspection.ET_CHAR_RESULTS.item[idx].CHARACTERISTIC = c.options.find(o => o.code === inspection.ET_CHAR_RESULTS.item[idx].CODE1) || c.default
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
                    _this.error = "Unhandled error!"
                }
            })
        }
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
    color: #000;
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
