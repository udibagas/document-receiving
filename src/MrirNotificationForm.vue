<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">MRIR NOTIFICATION FORM</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <ul class="list" style="margin-bottom:45px;">
            <li class="list-item">
                <div class="list-item__center">
                    {{po.E_POHEADER.PO_NUMBER}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">PO Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(item.PO_ITEM)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">PO Item</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.MATERIAL_EXTERNAL}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Material</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="short_text" class="text-input" placeholder="Short Text">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Short Text</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="number" v-model="qty_complaint" class="text-input" placeholder="Quantity Complaint">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity Complaint</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="ref_num" class="text-input" placeholder="Reference Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Reference Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <textarea v-model="description" class="textarea textarea--transparent" rows="18" placeholder="Detail Description" style="width:100%"></textarea>
                </div>
            </li>
        </ul>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="sendMrirNotification">SEND MRIR  NOTIFICATION</v-ons-button>
        </div>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Sending notification...
            </p>
        </v-ons-modal>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoHeader from './PoHeader'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po }
    },
    data: function() {
        return {
            item: {},
            error: '',
            busy: false,
            short_text: '',
            description: '',
            qty_complaint: ''
        }
    },
    methods: {
        sendMrirNotification: function() {
            let _this = this

            if (!_this.short_text) {
                _this.error = 'Short Text is required!'
                return
            }

            if (!_this.qty_complaint) {
                _this.error = 'Quantity Complaint is required!'
                return
            }

            if (!_this.ref_num) {
                _this.error = 'Reference Number is required!'
                return
            }

            if (!_this.description) {
                _this.error = 'Description is required!'
                return
            }

            _this.error = ''
            _this.busy = true

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                to: _this.po.E_USER_EMAIL,
                short_text: _this.short_text,
                description: 'User ID : ' + window.localStorage.userId + '\n' + _this.description,
                device_data: window.localStorage.userId,
                qty_complaint: _this.qty_complaint,
                material: _this.item.MATERIAL_EXTERNAL,
                vendor: _this.po.E_POHEADER.VENDOR,
                user_id: window.localStorage.userId,
                po_creator: _this.po.E_POHEADER.CREATED_BY,
                ref_num: _this.ref_num
            }

            axios.post(process.env.ROOT_API + 'mrirNotification', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_QM_NOTIF_INBOUND.Response"]))
                let ret = jsonData.Envelope.Body["ZFM_QM_NOTIF_INBOUND.Response"].ET_RETURN

                if (ret === '') {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'MRIR Notification created successfully with number ' + jsonData.Envelope.Body["ZFM_QM_NOTIF_INBOUND.Response"].E_HEADER.NOTIF_NO
                            }
                        }
                    })
                } else {
                    let itemReturn = Array.isArray(ret.item) ? ret.item : [ret.item]
                    let errorReturn = itemReturn.filter(i => i.TYPE === 'E')
                    if (errorReturn.length > 0) {
                        errorReturn.forEach(function(e, i) {
                            _this.error += '[' + i + '] ' + e.MESSAGE + ', '
                        })
                    } else {
                        _this.error = 'Unknown error!'
                    }
                }
            }).catch(function(e) {
                _this.busy = false
                _this.error = 'FAIL to send notification! ' + e.response.data
            })
        }
    }
}
</script>

<style lang="css" scoped>

</style>
