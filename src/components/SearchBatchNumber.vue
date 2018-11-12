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
            <div class="form">
                <p><input type="number" :disabled="processing" v-model="batch_number" class="batch-number-input" placeholder="BATCH NUMBER"></p>
                <p><v-ons-button :disabled="!batch_number || processing" @click.prevent="batch_number = ''; error = ''" class="scan-document-btn" modifier="material">CLEAR</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanText" class="scan-document-btn">SCAN TEXT</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanCode" class="scan-document-btn">SCAN QR/BAR CODE</v-ons-button></p>
                <p><v-ons-button :disabled="!batch_number || processing" @click.prevent="submitData" :class="['submit-data-btn', batch_number && !processing ? 'btn-red' : '']" modifier="material">SEARCH BATCH NUMBER</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>
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
            processing: false
        }
    },
    methods: {
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
                        _this.batch_number = recognizedText.replace(/\D/g, '')
                        if (_this.batch_number) {
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
                    // alert(JSON.stringify(inspection))
                    inspection.ET_CHAR_REQUIREMENTS.item.forEach(function(cr, idx) {
                        let c = _this.inspectionCharacteristics.find(ic => ic.mstr_char === cr.MSTR_CHAR)
                        inspection.ET_CHAR_RESULTS.item[idx].CHARACTERISTIC = c.options.find(o => o.code === inspection.ET_CHAR_RESULTS.item[idx].CODE1) || {code: '', description: '[SELECT OPTIONS]'}
                    })

                    let evaluation = {}
                    inspection.ET_CHAR_RESULTS.item.forEach(function(cr) {
                        evaluation[cr.INSPCHAR] = cr.EVALUATION === 'A'
                    })

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
.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 80px auto 10px;
    width: 270px;
}

.batch-number-input {
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
