<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">PO DETAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-component></po-component>

        <v-ons-list style="margin-bottom:45px;">
            <v-ons-list-item v-for="item in itemList" :key="item.PO_ITEM" tappable>
                <label class="left">
                    <strong>#{{parseInt(item.PO_ITEM)}}</strong>
                </label>
                <label class="center">
                    <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle">
                        {{item.MATERIAL_EXTERNAL}}<br>
                        Qty PO: {{item.QUANTITY}} &bull;
                        Inbound: {{item.QTY_INBOUND}} &bull;
                        GR: {{item.QTY_GR}}
                    </span>
                </label>
                <label class="right" v-if="parseInt(po.PO_REL_IND) === 2">
                    <v-ons-checkbox v-if="parseInt(item.QUANTITY) > item.QTY_GR" :input-id="'checkbox-' + item.PO_ITEM" :value="item.PO_ITEM" v-model="selectedItem"> </v-ons-checkbox>
                </label>
            </v-ons-list-item>
        </v-ons-list>

        <div class="btn-fixed-bottom">
            <v-ons-button v-if="parseInt(po.PO_REL_IND) !== 2" style="width:95%;" @click.prevent="composeEmail">Send Email</v-ons-button>
            <v-ons-button :disabled="selectedItem.length > 1 || selectedItem.length === 0" v-if="parseInt(po.PO_REL_IND) === 2" style="width:120px" @click.prevent="createNotification">NOTIF</v-ons-button>
            <v-ons-button :disabled="selectedItem.length === 0" v-if="parseInt(po.PO_REL_IND) === 2" style="width:120px" @click.prevent="createInbound">IBOUND</v-ons-button>
            <v-ons-button :disabled="selectedItem.length > 1 || selectedItem.length === 0" v-if="parseInt(po.PO_REL_IND) === 2" style="width:120px" @click.prevent="grProcess">GR</v-ons-button>
        </div>

    </v-ons-page>
</template>

<script>
import axios from 'axios'
import Main from './Main'
import GrForm from './GrForm'
import EmailForm from './EmailForm'
import NotificationForm from './NotificationForm'
import InboundForm from './InboundForm'
import PoComponent from './PoComponent'

export default {
    components: { PoComponent },
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
            selectedItem: []
        }
    },
    methods: {
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
            let poHistoryTotal = this.poHistoryTotal.filter(ph => ph.PO_ITEM === poItem);
            poHistoryTotal.forEach(function(i) {
                totalGr += parseInt(i.DELIV_QTY)
            })
            return totalGr
        },
        composeEmail: function() {
            let _this = this
            _this.$emit('push-page', {
                extends: EmailForm,
                data: function() {
                    return {
                        po: _this.po
                    }
                }
            })
        },
        createNotification: function() {
            let _this = this
            let item = _this.itemList.find(item => item.PO_ITEM.toString() === _this.selectedItem[0])
            if (parseInt(item.QUANTITY) === item.QTY_GR) {
                return
            }
            _this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        po: _this.po,
                        item: item
                    }
                }
            })
        },
        createInbound: function() {
            let _this = this
            let items = _this.itemList.filter(item => _this.selectedItem.indexOf(item.PO_ITEM.toString()) !== -1 && parseInt(item.QUANTITY) > item.QTY_INBOUND);
            if (items.length === 0) {
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
        grProcess: function() {
            let _this = this
            let item = _this.itemList.find(item => item.PO_ITEM.toString() === _this.selectedItem[0])
            if (parseInt(item.QTY_INBOUND) === item.QTY_GR) {
                return
            }
            _this.$emit('push-page', {
                extends: GrForm,
                data: function() {
                    return {
                        formData: {
                            po: _this.po,
                            item: item
                        }
                    }
                }
            });
        }
    },
    mounted: function() {
        let _this = this
        _this.itemList.forEach(function(item) {
            item.QUANTITY = parseInt(item.QUANTITY)
            item.QTY_INBOUND = _this.inboundQty(item.PO_ITEM)
            item.QTY_GR = _this.grQty(item.PO_ITEM)
        })
    }
}
</script>

<style lang="css" scoped>
.background {
    background-color: #fff;
}
</style>
