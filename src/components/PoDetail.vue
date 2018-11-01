<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">PO DETAIL</div>
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
            <v-ons-button v-if="parseInt(po.E_POHEADER.PO_REL_IND) !== 2" style="width:95%;" @click.prevent="createNotification">SEND NOTIFICATION</v-ons-button>
            <v-ons-button :disabled="selectedItem.length > 1 || selectedItem.length === 0" v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2" style="width:170px" @click.prevent="createNotification">SEND NOTIFICATION</v-ons-button>
            <v-ons-button :disabled="selectedItem.length === 0" v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2" style="width:170px" @click.prevent="createInbound">CREATE INBOUND</v-ons-button>
        </div>

        <div class="toast" v-show="toast.show" style="bottom:45px;">
            <div class="toast__message">{{toast.message}}</div>
            <button class="toast__button" @click="toast.show = false">OK</button>
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
        po() {
            return this.$store.state.po
        },
        itemList() {
            return this.$store.state.itemList
        },
        poConfirmation() {
            return this.$store.state.poConfirmation
        },
        poHistoryTotal() {
            return this.$store.state.poHistoryTotal
        }
    },
    data: function() {
        return {
            selectedItem: [],
            toast: {
                show: false,
                message: ''
            }
        }
    },
    methods: {
        showDetail: function(item) {
            let _this = this
            _this.$emit('push-page', {
                extends: ItemDetail,
                data: function() {
                    return {
                        item: item,
                        poConfirmation: _this.poConfirmation.filter(p => p.PO_ITEM === item.PO_ITEM)
                    }
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
        createNotification: function() {
            let _this = this
            let item = {}

            let problemDescription = '[TULIS PESAN ANDA]'
            problemDescription += '\n\n\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'Detail PO' + '\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'PO Number: ' + _this.po.E_POHEADER.PO_NUMBER + '\n'
            problemDescription += 'Vendor: ' + _this.po.E_VENDOR_NAME + '\n'
            problemDescription += 'Created By: ' + _this.po.E_POHEADER.CREATED_BY + '/' + _this.po.E_USER_FULLNAME + '\n'
            problemDescription += 'Created Date: ' + _this.po.E_POHEADER.CREAT_DATE + '\n'
            problemDescription += 'Release Status: '
            problemDescription += parseInt(_this.po.E_POHEADER.PO_REL_IND) === 2 ? 'RELEASED' : 'NOT RELEASED'

            if (_this.selectedItem.length > 0) {
                item = _this.itemList.find(item => item.PO_ITEM.toString() === _this.selectedItem[0])
                if (parseInt(item.QUANTITY) === item.QTY_GR) {
                    _this.toast = {
                        show: true,
                        message: 'Action not allowed. GR completed.'
                    }
                    return
                }

                problemDescription += '\n\n\n'
                problemDescription += '------------------------------------' + '\n'
                problemDescription += 'Detail Item' + '\n'
                problemDescription += '------------------------------------' + '\n'
                problemDescription += 'PO Item: ' + item.PO_ITEM + '\n'
                problemDescription += 'Material : ' + item.MATERIAL_EXTERNAL + '\n'
                problemDescription += 'Material Description: ' + item.SHORT_TEXT + '\n'
            }

            _this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        problem: parseInt(_this.po.E_POHEADER.PO_REL_IND) === 2 ? { notifType: '', description: '[SELECT PROBLEM]' } : { notifType: 'G3', description: 'RELEASE PO' },
                        description: problemDescription
                    }
                }
            })
        },
        createInbound: function() {
            let _this = this
            let items = _this.itemList.filter(item => _this.selectedItem.indexOf(item.PO_ITEM.toString()) !== -1 && parseInt(item.QUANTITY) > item.QTY_INBOUND)
            if (items.length === 0) {
                _this.toast = {
                    show: true,
                    message: 'Action not allowed. All item has been received.'
                }
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
        }
    },
    mounted: function() {
        this.countQuantity()
    }
}
</script>

<style lang="css" scoped>
.background {
    background-color: #fff;
}
</style>
