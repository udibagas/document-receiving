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
                    <input type="date" v-model="prelim_doc_date" class="text-input" placeholder="Date">
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
                    <input type="date" v-model="invoice_date" class="text-input" placeholder="Date">
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
                    <input type="date" v-model="delivery_date" class="text-input" placeholder="Delivery Date">
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

        <div class="toast" v-show="toast.show">
            <div class="toast__message">{{toast.message}}</div>
            <button class="toast__button" @click="toast.show = false">OK</button>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoHeader from './PoHeader'
import fastXmlParser from 'fast-xml-parser'

export default {
    components: { PoHeader },
    data: function() {
        return {
            busy: false,
            po: {},
            items: [],
            toast: { show: false, message: '' },
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

            if (_this.items.filter(i => i.qty === 0 || i.qty === '').length > 0) {
                _this.toast = {
                    show: true,
                    message: 'Please fill the quantity!'
                }
                return
            }

            _this.busy = true
            axios({
                method: 'post',
                url: process.env.ROOT_API + 'inbound',
                // headers: {'Content-Type': 'text/xml'},
                data: {
                    api_token: window.localStorage.api_token,
                    po_number: _this.po.PO_NUMBER,
                    delivery_date: _this.delivery_date,
                    bill_of_lading: _this.bill_of_lading,
                    invoice_number: _this.invoice_number,
                    invoice_date: _this.invoice_date,
                    prelim_doc_number: _this.prelim_doc_number,
                    prelim_doc_date: _this.prelim_doc_date,
                    items: _this.items
                }
            }).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                let ret = jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"].ET_RETURN.item

                if (ret.type === 'E') {
                    _this.toast = { show: true, message: ret.MESSAGE }
                } else {
                    _this.toast = { show: true, message: 'Inbound creation SUCCESS!' }
                    _this.$emit('pop-page')
                    // _this.$store.commit('update', _this.po.PO_NUMBER)
                }
            }).catch(function(e) {
                _this.toast = { show: true, message: e.response.data }
                _this.busy = false
            })
        }
    }
}
</script>

<style lang="css" scoped>
/* .background,.btn-fixed-bottom {
    background-color: #eee;
} */

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

/* ::-webkit-input-placeholder {
   text-align: center;
   font-weight: lighter;
}

:-moz-placeholder {
   text-align: center;
   font-weight: lighter;
}

::-moz-placeholder {
   text-align: center;
   font-weight: lighter;
}

:-ms-input-placeholder {
   text-align: center;
   font-weight: lighter;
} */
</style>
