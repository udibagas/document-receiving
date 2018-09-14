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
            <p class="error" v-if="error">{{error}}</p>
        </div>

        <v-ons-modal :visible.sync="showPoList">
            <ons-list>
                <ons-list-item v-for="p in poList">
                    <label class="left">
                        <v-ons-checkbox :input-id="'checkbox-' + $index" :value="p.material" v-model="selectedPo">
                        </v-ons-checkbox>
                    </label>
                    <label class="center">
                        <div class="list-item__title">{{p.material}}</div>
                        <span class="list-item__subtitle">
                            {{p.description}}<br>
                            <strong>Item: {{p.item}} &bull; Qty: {{p.qty}} &bull; Inbound: <span :class="p.inbound ? 'success' : 'danger'">{{p.inbound ? 'YES' : 'NO'}}</span></strong>
                        </span>
                    </label>
                </ons-list-item>
                <ons-list-item>
                    <v-ons-button class="full-width" @click.prevent="createNotification">Create Notification</v-ons-button>
                    <v-ons-button class="full-width" @click.prevent="createInbound">Create Inbound</v-ons-button>
                    <v-ons-button class="full-width" @click.prevent="grProcess">GR Process</v-ons-button>
                    <v-ons-button class="full-width" @click.prevent="showPoList = false; po_number = ''">Close</v-ons-button>
                </ons-list-item>
            </ons-list>

        </v-ons-modal>

    </v-ons-page>
</template>

<script>
import axios from 'axios'
import Login from './Login'

export default {
    data: function() {
        return {
            api_url: 'http://192.168.160.131:8000/api/',
            user: null,
            is_ready: false,
            po_number: '',
            image_src: '',
            error: '',
            poList: [],
            showPoList: false,
            selectedPo: []
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
            let _this = this
            axios.get(_this.api_url + 'po', {params: {po_number: _this.po_number}})
                .then(function(r) {
                    let status = r.data.status
                    _this.selectedPo = []

                    // PO not released/closed
                    if (status === 0) {
                        _this.$ons.notification.alert({
                            title: '',
                            message: 'PO #' + _this.po_number + ' is not released yet. Please release before proceed.'
                        });
                    }

                    // PO released but no inbound
                    if (status === 1) {
                        _this.poList = r.data.data
                        _this.showPoList = true
                    }

                    // PO released and inbound
                    if (status === 2) {
                        _this.poList = r.data.data
                        _this.showPoList = true
                    }
                })
                .catch(function(e) {
                    if (e.response) {
                        if (e.response.status === 500) {
                            _this.error = e.response.data.message
                        }

                        if (e.response.status === 404) {
                            _this.error = 'Page not found'
                        }
                    }
                })
        },
        createNotification: function() {
            let _this = this
            this.$ons.notification.confirm('Are you sure?', {title: ''}).then(function(r) {
                if (r === 1) {
                    // TODO: create notif
                    _this.showPoList = false
                    _this.$ons.notification.alert({
                        title: '',
                        message: 'Notification for PO #' + _this.po_number + ' created'
                    })
                }
            })
        },
        createInbound: function() {
            let _this = this
            this.$ons.notification.confirm('Are you sure?', {title: ''}).then(function(r) {
                if (r === 1) {
                    // TODO: create inbound
                    _this.showPoList = false
                    _this.$ons.notification.alert({
                        title: '',
                        message: 'Inbound for PO #' + _this.po_number + ' created'
                    })
                }
            })
        },
        grProcess: function() {
            // TODO: tampilkan form
            let _this = this
            _this.$ons.notification.alert({
                title: '',
                message: 'Under development'
            })
        },
        saveData: function() {
            // TODO: save data to server
            _this.showPoList = false
            _this.$ons.notification.alert({
                title: '',
                message: 'GR completed. Material Document #' + _this.po_number + ' created'
            })
        }
    },
    mounted: function() {
        let _this = this;
        this.$ons.ready(function() {
            _this.is_ready = true;
            TesseractPlugin.loadLanguage('eng', function(response) {
                // alert('Languange loaded : ' + response)
            }, function(reason) {
                alert('Failed to load language: ' + reason)
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
    font-size: 20px;
    height: 30px;
    font-weight: lighter;
    border-radius: 20px;
    width: 100%;
}

.selected {
    background-color: yellow;
}

.success {
    color: green;
}

.danger {
    color: red;
}

.full-width {
    display: block;
    width: 100%;
    margin-bottom: 5px;
}
</style>
