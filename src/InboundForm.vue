<template lang="html">
    <ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="nav-title">Form Inbound</div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:70px">
            <li class="list-header">Item</li>
            <li class="list-item" v-for="item in items" :key="item.PO_ITEM" v-if="item.QUANTITY > item.QTY_INBOUND">
                <div class="list-item__center">
                    <div class="list-item__title">#{{parseInt(item.PO_ITEM)}} | {{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle">
                        <strong>{{item.MATERIAL_EXTERNAL}}</strong><br>
                        Qty PO: {{item.QUANTITY}} &bull;
                        Qty Inbound: {{item.QTY_INBOUND}} &bull;
                        Qty GR: {{item.QTY_GR}}
                    </span>
                </div>
                <div class="list-item__right" style="text-align:right">
                    <input type="number" step="any" v-model="item.qty" class="my-input" placeholder="qty">
                </div>
            </li>
            <li class="list-header">Inbound Detail</li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="prelim_doc_number" class="text-input" placeholder="Prelim Doc Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <datetime v-model="prelim_doc_date" class="text-input" placeholder="Prelim Doc Date" format="dd/MM/yyyy" zone="Asia/Jakarta" value-zone="Asia/Jakarta"></datetime>
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="invoice_number" class="text-input" placeholder="Invoice Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <datetime v-model="invoice_date" placeholder="Invoice Date" format="dd/MM/yyyy" zone="Asia/Jakarta" value-zone="Asia/Jakarta"></datetime>
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="bill_of_lading" class="text-input" placeholder="Bill Of Lading">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Bill Of Lading</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <datetime v-model="delivery_date" placeholder="Delivery Date" format="dd/MM/yyyy" zone="Asia/Jakarta" value-zone="Asia/Jakarta"></datetime>
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Date</div>
                </div>
            </li>
        </v-ons-list>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="submitInbound">SUBMIT</v-ons-button>
        </div>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Saving data...
            </p>
        </v-ons-modal>

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoHeader from './PoHeader'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'
import moment from 'moment'

export default {
    components: { PoHeader },
    data: function() {
        return {
            busy: false,
            po: {},
            items: [],
            error: '',
            delivery_date: '',
            bill_of_lading: '',
            invoice_date: '',
            invoice_number: '',
            prelim_doc_date: '',
            prelim_doc_number: ''
        }
    },
    methods: {
        submitInbound: function() {
            let _this = this

            if (_this.items.filter(i => i.qty === undefined).length > 0) {
                _this.error = 'Please fill the quantity!'
                return
            }

            if (_this.items.filter(i => i.qty > i.QUANTITY).length > 0) {
                _this.error = 'Inbound Quanty > PO Quantity!'
                return
            }

            if (_this.items.filter(i => i.qty > (i.QUANTITY - i.QTY_INBOUND)).length > 0) {
                _this.error = 'Inbound Quanty > Remining Item!'
                return
            }

            if (_this.prelim_doc_number === '') {
                _this.error = 'Please fill prelim doc number!'
                return
            }

            if (_this.prelim_doc_date === '') {
                _this.error = 'Please fill prelim doc date!'
                return
            }

            if (_this.invoice_number === '') {
                _this.error = 'Please fill invoice number!'
                return
            }

            if (_this.invoice_date === '') {
                _this.error = 'Please fill invoice date!'
                return
            }

            if (_this.bill_of_lading === '') {
                _this.error = 'Please fill bill of lading!'
                return
            }

            if (_this.delivery_date === '') {
                _this.error = 'Please fill delivery date!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                delivery_date: moment(_this.delivery_date).format('YYYY-MM-DD'),
                bill_of_lading: _this.bill_of_lading,
                invoice_number: _this.invoice_number,
                invoice_date: moment(_this.invoice_date).format('YYYY-MM-DD'),
                prelim_doc_number: _this.prelim_doc_number,
                prelim_doc_date: moment(_this.prelim_doc_date).format('YYYY-MM-DD'),
                items: _this.items,
                user_id: window.localStorage.userId
            }

            // alert(JSON.stringify(data))
            // return

            _this.busy = true
            axios.post(process.env.ROOT_API + 'inbound', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"].ET_RETURN

                if ((ret.item && ret.item.TYPE === 'E') || (Array.isArray(ret.item) && ret.item[0].TYPE === 'E')) {
                    _this.error = 'ERROR: ' + (Array.isArray(ret.item) ? ret.item[0].MESSAGE : ret.item.MESSAGE)
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'Inbound delivery success. ' + jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"].ET_DELIVERY.item.VBELN_LIF
                            }
                        }
                    })
                }
            }).catch(function(e) {
                alert(e.response.data)
                _this.busy = false
            })
        }
    }
}
</script>

<style lang="css" scoped>
.page {
    margin-top: 130px;
}

.btn-submit {
    width: 95%;
}

input {
    border: none !important;
}

.background {
    background-color: #F3F3F3;
}

.list-item__title {
    font-size: 14px;
    color: #3a6897;
    font-family: 'OpenSans';
    font-weight: bold;
    margin-bottom: 5px;
}

.list-item__subtitle {
    font-size: 12px;
    font-family: 'OpenSans';
    color: #333;
}

.text-input, 
.textarea, 
.list-item__label
.vdatetime,
.list-item__center {
    font-size: 12px !important;
}

.my-input {
    background-color: #eee;
    border: none;
    padding: 5px;
    font-size: 20px;
    width: 40px;
    color: #3a6897;
    text-align: center;
    border-radius: 2px;
}
</style>
