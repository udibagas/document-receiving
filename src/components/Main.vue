<template>
    <v-ons-page>
        <div class="background"></div>
        <!-- <v-ons-toolbar>
            <div class="center">Document Receiving</div>
            <div class="right">
                <ons-toolbar-button @click="logout">
                    <v-ons-icon icon="fa-sign-out"></v-ons-icon>
                </ons-toolbar-button>
            </div>
        </v-ons-toolbar> -->
        <div class="content">
            <p><v-ons-input v-model="po_number" class="po-number-input"></v-ons-input></p>
            <p><v-ons-button :disabled="is_ready" @click.prevent="scanDocument" class="scan-document-btn">SCAN PO</v-ons-button></p>
            <p><v-ons-button :disabled="!po_number" @click.prevent="submitData" class="submit-data-btn">SUBMIT</v-ons-button></p>
        </div>

        <v-ons->
    </v-ons-page>
</template>

<script>
import Login from './Login'

export default {
    data: function() {
        return {
            user: null,
            is_ready: false,
            po_number: '',
            image_src: ''
        }
    },
    methods: {
        logout() {
            this.$emit('replace-page', Login);
        },
        scanDocument() {
            let _this = this;
            _this.po_number = '';
            _this.image_src = '';

            let cameraOptions = {
                quality: 20,
                destinationType: Camera.DestinationType.DATA_URL
            };

            navigator.camera.getPicture(function(imageData) {
                _this.image_src = 'data:image/jpeg;base64,' + imageData;
                TesseractPlugin.recognizeText(imageData, 'eng', function(recognizedText) {
                    _this.po_number = recognizedText;
                }, function(reason) {
                    alert('Failed to recognize text: ' + reason);
                });
            }, function(message) {
                alert(message);
            }, cameraOptions);
        },
        submitData: function() {
            // TODO: akses ke api
            let status = 0

            // PO not released/closed
            if (status === 0) {
                this.$ons.notification.alert('PO #xxx not released. Please release before proceed');
            }

            // PO released but no inbound
            if (status === 1) {
                // TODO: show modal with list, multiple select
            }

            // PO released and inbound
            if (status === 2) {

            }
        },
        createNotification: function() {
            let _this = this
            this.$ons.notification.confirm('Are you sure?').then(function(r) {
                if (r === 1) {
                    // TODO: create notif
                    _this.$ons.notification.alert('Notification created')
                }
            })
        },
        createInbound: function() {
            let _this = this
            this.$ons.notification.confirm('Are you sure?').then(function(r) {
                if (r === 1) {
                    // TODO: create inbound
                    _this.$ons.notification.alert('Inbound created')
                }
            })
        },
        grProcess: function() {
            // TODO: tampilkan form
        },
        saveData: function() {
            // TODO: save data to server
            _this.$ons.notification.alert('GR Completed. Material Document xxx created.')
        }
    },
    mounted: function() {
        let _this = this;
        this.$ons.ready(function() {
            _this.is_ready = true;
            TesseractPlugin.loadLanguage('eng', function(response) {
                alert('Languange loaded' + response)
            }, function(reason) {
                alert('Failed to load language' + reason)
            });
        });
    }
}
</script>

<style scoped>
.background {
    background-color: white;
}

.content {
    text-align: center;
    padding: 10px 50px;
    margin-top: 150px;
}

.po-number-input {
    width: 100%;
}

.text-input {
    font-size: 50px;
    color: red;
    text-align: center;
    height: 60px;
}

.submit-data-btn, .scan-document-btn {
    width: 100%;
    font-size: 30px;
    height: 50px;
    font-weight: lighter;
    border-radius: 25px;
    padding: 5px;
}
</style>
