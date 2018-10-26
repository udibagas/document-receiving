<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">QUALITY INSPECTION</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            <div class="form">
                <p><input type="number" :disabled="processing" v-model="inspection_number" class="inspection-number-input" placeholder="INSP. LOT NO."></p>
                <p><v-ons-button :disabled="!inspection_number || processing" @click.prevent="inspection_number = ''; error = ''" class="scan-document-btn" modifier="material">CLEAR</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanText" class="scan-document-btn">SCAN TEXT</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanCode" class="scan-document-btn">SCAN QR/BAR CODE</v-ons-button></p>
                <p><v-ons-button :disabled="!inspection_number || processing" @click.prevent="submitData" :class="['submit-data-btn', inspection_number && !processing ? 'btn-red' : '']" modifier="material">SUBMIT</v-ons-button></p>
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
    data: function() {
        return {
            inspection_number: '',
            error: '',
            processing: false
        }
    },
    methods: {
        scanText: function() {
            let _this = this;
            _this.inspection_number = ''
            let cameraOptions = {
                quality: 100,
                correctOrientation: true,
                destinationType: Camera.DestinationType.NATIVE_URI
            };

            _this.$ons.ready(function() {
                navigator.camera.getPicture(function(imageData) {
                    textocr.recText(0, 2, imageData, function(recognizedText) {
                        _this.inspection_number = recognizedText.replace(/\D/g, '')
                        if (_this.inspection_number) {
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
                        _this.inspection_number = result.text
                        if (_this.inspection_number) {
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

                let response = jsonData.Envelope.Body["BAPI_INSPOPER_GETDETAIL.Response"]
                if (response.RETURN && response.RETURN.TYPE === 'E') {
                    _this.error = response.RETURN.MESSAGE
                } else {
                    _this.$emit('push-page', {
                        extends: InspectionForm,
                        data: function() {
                            return {
                                inspection: response
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

.inspection-number-input {
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
