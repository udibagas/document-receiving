<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GR PROCESS</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-bell" class="btn-action" style="border:1px solid #fff;" @click.prevent="createNotification"> CREATE NOTIF</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>
        <ul class="list" style="margin-bottom:45px">
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(item.PO_ITEM)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Item</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.MATERIAL_EXTERNAL}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Part Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.SHORT_TEXT}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Mat. Description</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(item.QUANTITY)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.PLANT}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Plant</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.MATL_GROUP}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Material Group</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.STGE_LOC}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Storage Location</div>
                </div>
            </li>
            <li class="list-header">Inbound Detail</li>
            <li class="list-item">
                <div class="list-item__center">
                    {{inbound.DELIV_NUMB}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{inbound.CONF_TYPE}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Movement Type</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(inbound.QUANTITY)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.PREL_DOC_NO" class="text-input" placeholder="Prelim Doc Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="inbound.DATE_PREL_DOC" class="text-input" placeholder="Prelim Doc Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.INVOICE_NO" class="text-input" placeholder="Invoice Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="inbound.INVOICE_DT" class="text-input" placeholder="Invoice Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.BILL_OF_LADING" class="text-input" placeholder="Bill Of Lading">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Bill of Lading</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" v-model="inbound.DELIV_DATE" class="text-input" placeholder="Delivery Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Date</div>
                </div>
            </li>
            <li class="list-header">GR Detail</li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="delivery_note" class="text-input" placeholder="Delivery Note/Invoice">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Note/Invoice</div>
                </div>
            </li>
            <li class="list-item" v-if="RegExp('EXP').test(item.MATL_GROUP) === false">
                <div class="list-item__center">
                    <input type="text" v-model="serial_no" class="text-input" placeholder="Serial Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Serial Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="item_text" class="text-input" placeholder="Text">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Text</div>
                </div>
            </li>
        </ul>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="submitGr"> SUBMIT</v-ons-button>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <v-ons-modal :visible="busy">
            <div class="alert-dialog" v-show="successDialog">
                <div class="alert-dialog-container">
                    <div class="alert-dialog-title">GR SUCCESS</div>
                    <div class="alert-dialog-content">
                        <p>Material Document : {{matDoc}}</p>
                    </div>

                    <div class="alert-dialog-footer">
                        <button class="alert-dialog-button alert-dialog-button--primal" @click="successDialog = false; $emit('pop-page')">OK</button>
                    </div>
                </div>
            </div>
            <p style="text-align: center" v-if="!successDialog">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Saving data...
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'
import PoHeader from './PoHeader'
import NotificationForm from './NotificationForm'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po }
    },
    data: function() {
        return {
            item: {},
            inbound: {},
            busy: false,
            serial_no: '',
            delivery_note: '',
            item_text: '',
            error: '',
            successDialog: false,
            matDoc: ''
        }
    },
    methods: {
        submitGr: function() {
            let _this = this

            // validasi ibound
            if (!_this.inbound.PREL_DOC_NO) {
                _this.error = 'Prelim Doc Number is required'
                return
            }

            if (!_this.inbound.DATE_PREL_DOC) {
                _this.error = 'Prelim Doc Date is required'
                return
            }

            if (!_this.inbound.INVOICE_NO) {
                _this.error = 'Invoice Number is required'
                return
            }

            if (!_this.inbound.INVOICE_DT) {
                _this.error = 'Invoice Date is required'
                return
            }

            if (!_this.inbound.BILL_OF_LADING) {
                _this.error = 'Bill of Lading is required'
                return
            }

            if (!_this.inbound.DELIV_DATE) {
                _this.error = 'Delivery Date is required'
                return
            }

            if (RegExp("ROT|RT").test(_this.item.MATL_GROUP) && !_this.serial_no) {
                _this.error = 'Serial Number is required!'
                return
            }

            if (!_this.delivery_note) {
                _this.error = 'Delivery Note is required!'
                return
            }

            if (!_this.item_text) {
                _this.error = 'Item Text is required!'
                return
            }

            _this.busy = true
            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                serial_no: _this.serial_no,
                item_text: _this.item_text,
                user_id: window.localStorage.userId,
                delivery_note: _this.delivery_note,
                inbound: _this.inbound
            }

            axios.post(process.env.ROOT_API + 'gr', data).then(function(r) {
                // _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"].ET_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.error = 'ERROR: ' + ret.item.MESSAGE
                } else {
                    _this.$store.commit('refresh', _this.po.E_POHEADER.PO_NUMBER);
                    _this.matDoc = jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"].E_MATDOC.MAT_DOC
                    _this.successDialog = true
                }
            })
            .catch(function(e) {
                _this.error = e.response.data
                _this.busy = false
            })
        },
        createNotification: function() {
            let problemDescription = '[TULIS PESAN ANDA]'
            problemDescription += '\n\n\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'Detail PO' + '\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'PO Number: ' + this.po.E_POHEADER.PO_NUMBER + '\n'
            problemDescription += 'Vendor: ' + this.po.E_VENDOR_NAME + '\n'
            problemDescription += 'Created By: ' + this.po.E_POHEADER.CREATED_BY + '/' + this.po.E_USER_FULLNAME + '\n'
            problemDescription += 'Created Date: ' + this.po.E_POHEADER.CREAT_DATE + '\n'
            problemDescription += 'Release Status: '
            problemDescription += parseInt(this.po.E_POHEADER.PO_REL_IND) === 2 ? 'RELEASED' : 'NOT RELEASED'
            problemDescription += '\n\n\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'Detail Item' + '\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'PO Item: ' + this.item.PO_ITEM + '\n'
            problemDescription += 'Material : ' + this.item.MATERIAL_EXTERNAL + '\n'
            problemDescription += 'Material Description: ' + this.item.SHORT_TEXT + '\n'

            let _this = this
            this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        purchaser_name: _this.po.E_USER_FULLNAME,
                        description: problemDescription,
                        to: _this.po.E_USER_EMAIL,
                        po_number: _this.po.E_POHEADER.PO_NUMBER
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
