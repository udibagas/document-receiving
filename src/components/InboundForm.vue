<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE INBOUND</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-save" style="border:1px solid #fff;" @click.prevent="submitInbound"> SAVE</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>
        <v-ons-list>
            <li class="list-header">Item</li>
            <li class="list-item" v-for="item in items" :key="item.PO_ITEM" v-if="parseInt(item.QUANTITY) > item.QTY_INBOUND">
                <div class="list-item__left">
                    <strong>#{{parseInt(item.PO_ITEM)}}</strong>
                </div>
                <div class="list-item__center">
                    <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle">
                        {{item.MATERIAL_EXTERNAL}}<br>
                        Qty PO: {{parseInt(item.QUANTITY)}} &bull;
                        Qty Inbound: {{item.QTY_INBOUND}} &bull;
                        Qty GR: {{item.QTY_GR}}
                    </span>
                </div>
                <div class="list-item__right" style="text-align:right">
                    <input type="number" v-model="item.qty" class="my-input" placeholder="qty">
                </div>
            </li>
            <li class="list-header">Document Beacukai (Prelim Doc.)</li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="prelim_doc_number" class="text-input" placeholder="Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="prelim_doc_date" class="text-input" placeholder="Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Date</div>
                </div>
            </li>
            <li class="list-header">Invoice</li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="invoice_number" class="text-input" placeholder="Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="invoice_date" class="text-input" placeholder="Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Date</div>
                </div>
            </li>
            <li class="list-header">Airway Bill</li>
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
                    <input type="date" style="width:120px" v-model="delivery_date" class="text-input" placeholder="Delivery Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Date</div>
                </div>
            </li>
        </v-ons-list>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Saving data...
            </p>
        </v-ons-modal>

        <div class="toast" v-show="error">
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
                delivery_date: _this.delivery_date,
                bill_of_lading: _this.bill_of_lading,
                invoice_number: _this.invoice_number,
                invoice_date: _this.invoice_date,
                prelim_doc_number: _this.prelim_doc_number,
                prelim_doc_date: _this.prelim_doc_date,
                items: _this.items,
                // TODO: ini abil dari login LDAP
                user_id: '580422'
            }

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

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.error = 'ERROR: ' + ret.item.MESSAGE
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'Inbound delivery SUCCESS'
                            }
                        }
                    })
                }
            }).catch(function(e) {
                _this.error = e.response.data
                _this.busy = false
            })
        }
    }
}
</script>

<style lang="css" scoped>
.btn-submit {
    width: 95%;
}

.my-input {
    background-color: #eee;
    border: none;
    padding: 5px;
    font-size: 20px;
    width: 40px;
    color: red;
    text-align: center;
    border-radius: 4px;
}
</style>
