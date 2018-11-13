<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">INBOUND</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:45px;">
            <v-ons-list-item v-for="item in itemList" :key="item.PO_ITEM" tappable>
                <label class="left">
                    <strong>#{{parseInt(item.PO_ITEM)}}</strong>
                </label>
                <label class="center" @click="showDetail(item)">
                    <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle" style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden">
                        {{item.MATERIAL_EXTERNAL}}<br>
                        Qty PO: {{item.QUANTITY}} &bull;
                        Qty Inbound: {{item.QTY_INBOUND}} &bull;
                        Qty GR: {{item.QTY_GR}}
                    </span>
                </label>
                <label class="right" v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2">
                    <v-ons-checkbox v-if="parseInt(item.QUANTITY) > item.QTY_GR" :input-id="'checkbox-' + item.PO_ITEM" :value="item.PO_ITEM" v-model="selectedItem"> </v-ons-checkbox>
                </label>
            </v-ons-list-item>
        </v-ons-list>

        <div class="btn-fixed-bottom">
            <v-ons-button v-if="parseInt(po.E_POHEADER.PO_REL_IND) !== 2" style="width:95%;" @click.prevent="createNotification">CREATE NOTIFICATION</v-ons-button>
            <v-ons-button :disabled="selectedItem.length === 0" v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2" style="width:95%" @click.prevent="createInbound">CREATE INBOUND</v-ons-button>
        </div>

        <div class="toast" v-show="error" style="bottom:45px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>

    </v-ons-page>
</template>

<script>
import axios from 'axios'
import NotificationForm from './NotificationForm'
import InboundForm from './InboundForm'
import PoHeader from './PoHeader'
import ItemDetail from './ItemDetail'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po },
        itemList() { return this.$store.getters.itemList },
        poConfirmation() { return this.$store.getters.poConfirmation },
        poHistoryTotal() { return this.$store.getters.poHistoryTotal }
    },
    data: function() {
        return {
            selectedItem: [],
            error: ''
        }
    },
    methods: {
        showDetail: function(item) {
            this.$emit('push-page', {
                extends: ItemDetail,
                data: function() {
                    return { item: item }
                }
            })
        },
        inboundQty: function(poItem) {
            let totalInbound = 0;
            let inboundDelivery = this.poConfirmation.filter(pc => pc.PO_ITEM === poItem && pc.CONF_NAME === 'Inbound Delivery');
            inboundDelivery.forEach(function(i) {
                totalInbound += parseInt(i.QUANTITY)
            })
            return totalInbound
        },
        grQty: function(poItem) {
            let totalGr = 0;
            let poHistoryTotal = this.poHistoryTotal.filter(ph => ph.PO_ITEM === poItem)
            poHistoryTotal.forEach(function(i) {
                totalGr += parseInt(i.DELIV_QTY)
            })
            return totalGr
        },
        createInbound: function() {
            let _this = this
            let items = _this.itemList.filter(item => _this.selectedItem.indexOf(item.PO_ITEM.toString()) !== -1 && parseInt(item.QUANTITY) > item.QTY_INBOUND)
            if (items.length === 0) {
                _this.error = 'Action not allowed. All item has been received.'
                return
            }
            _this.$emit('push-page', {
                extends: InboundForm,
                data: function() {
                    return {
                        po: _this.po,
                        items: items
                    }
                }
            })
        },
        countQuantity: function() {
            let _this = this
            _this.itemList.forEach(function(item) {
                item.QUANTITY = parseInt(item.QUANTITY)
                item.QTY_INBOUND = _this.inboundQty(item.PO_ITEM)
                item.QTY_GR = _this.grQty(item.PO_ITEM)
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
            problemDescription += 'Release Status: NOT RELEASED'

            let _this = this
            this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        problem: { notifType: 'G3', description: 'RELEASE PO' },
                        purchaser_name: _this.po.E_USER_FULLNAME,
                        description: problemDescription,
                        to: _this.po.E_USER_EMAIL,
                        po_number: _this.po.E_POHEADER.PO_NUMBER
                    }
                }
            })
        }
    },
    mounted: function() {
        this.countQuantity()
    }
}
</script>

<style lang="css" scoped>
</style>
