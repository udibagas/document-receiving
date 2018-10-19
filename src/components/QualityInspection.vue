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
                <p><input type="number" :disabled="processing" v-model="po_number" class="po-number-input" placeholder="INSPECTION LOT NO."></p>
                <p><v-ons-button :disabled="!po_number || processing" @click.prevent="po_number = ''; error = ''" class="scan-document-btn" modifier="material">CLEAR</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanText" class="scan-document-btn">SCAN TEXT</v-ons-button></p>
                <p><v-ons-button :disabled="processing" @click.prevent="scanCode" class="scan-document-btn">SCAN QR/BAR CODE</v-ons-button></p>
                <p><v-ons-button :disabled="!po_number || processing" @click.prevent="submitData" :class="['submit-data-btn', po_number && !processing ? 'btn-red' : '']" modifier="material">SUBMIT</v-ons-button></p>
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
            this.$emit('push-page', InspectionForm)
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
    font-size: 24px;
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
   size: 14px;
}

:-moz-placeholder { /* Firefox 18- */
   text-align: center;
   font-weight: lighter;
   size: 14px;
}

::-moz-placeholder {  /* Firefox 19+ */
   text-align: center;
   font-weight: lighter;
   size: 14px;
}

:-ms-input-placeholder {
   text-align: center;
   font-weight: lighter;
   size: 14px;
}
</style>
