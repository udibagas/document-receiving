<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">PO DETAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-card>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col>PO NUMBER</v-ons-col>
                <v-ons-col style="font-weight:bold;">: {{po.PO_NUMBER}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col>VENDOR</v-ons-col>
                <v-ons-col style="font-weight:bold;">: {{po.VENDOR}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col>CREATED BY</v-ons-col>
                <v-ons-col style="font-weight:bold;">: {{po.CREATED_BY}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col>CREATE DATE</v-ons-col>
                <v-ons-col style="font-weight:bold;">: {{po.CREAT_DATE}}</v-ons-col>
            </v-ons-row>
            <v-ons-row>
                <v-ons-col>APPROVAL STATUS</v-ons-col>
                <v-ons-col style="font-weight:bold;">
                    : <span :class="parseInt(po.PO_REL_IND) === 2 ? 'success' : 'danger'">
                        {{parseInt(po.PO_REL_IND) === 2  ? 'APPROVED' : 'NOT APPROVED'}}
                    </span>
                </v-ons-col>
            </v-ons-row>
        </v-ons-card>
        <v-ons-card>
            <v-ons-list>
                <v-ons-list-item v-for="item in itemList" :key="item.PO_ITEM" tappable @click="showAction(item)">
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
                </v-ons-list-item>
            </v-ons-list>
            <div v-if="parseInt(po.PO_REL_IND) !== 2">
                <br>
                <v-ons-button class="full-width btn-round" @click.prevent="composeEmail">Send Email</v-ons-button>
            </div>
        </v-ons-card>

        <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
            <v-ons-action-sheet-button v-show="selectedItem.QUANTITY > selectedItem.QTY_GR" @click.prevent="createNotification"> CREATE NOTIFICATION </v-ons-action-sheet-button>
            <v-ons-action-sheet-button v-show="selectedItem.QUANTITY > selectedItem.QTY_INBOUND" @click.prevent="createInbound"> CREATE INBOUND </v-ons-action-sheet-button>
            <v-ons-action-sheet-button v-show="selectedItem.QTY_INBOUND > selectedItem.QTY_GR" @click.prevent="grProcess"> GR PROCESS </v-ons-action-sheet-button>
        </v-ons-action-sheet>

        <v-ons-dialog :visible.sync="alert.show">
            <div style="text-align:center;padding:15px;">
                <p v-if="alert.title"><strong>{{alert.title}}</strong></p>
                <p>{{alert.message}}</p>
                <br>
                <p><v-ons-button class="full-width btn-round" @click.prevent="alert.show = false">OK</v-ons-button></p>
            </div>
        </v-ons-dialog>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import Main from './Main'
import GrForm from './GrForm'
import EmailForm from './EmailForm'
import NotificationForm from './NotificationForm'
import InboundForm from './InboundForm'

export default {
    data: function() {
        return {
            actionSheetVisible: false,
            po: {},
            itemList: [],
            poConfirmation: [],
            poHistoryTotal: [],
            selectedItem: {},
            alert: {
                title: '',
                show: false,
                message: ''
            }
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
        showAction: function(item) {
            this.selectedItem = item
            if (parseInt(this.po.PO_REL_IND) !== 2 || this.selectedItem.QUANTITY === this.selectedItem.QTY_GR) {
                return
            }
            this.actionSheetVisible = true
        },
        composeEmail: function() {
            let _this = this
            _this.$emit('push-page', {
                extends: EmailForm,
                data: function() {
                    return {
                        po_number: _this.po.PO_NUMBER
                    }
                }
            })
        },
        createNotification: function() {
            let _this = this
            _this.actionSheetVisible = false
            _this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        po: _this.po,
                        item: _this.selectedItem
                    }
                }
            })
        },
        createInbound: function() {
            let _this = this
            _this.actionSheetVisible = false
            _this.$emit('push-page', {
                extends: InboundForm,
                data: function() {
                    return {
                        po: _this.po,
                        item: _this.selectedItem
                    }
                }
            })
        },
        grProcess: function() {
            let _this = this
            _this.actionSheetVisible = false
            _this.$emit('push-page', {
                extends: GrForm,
                data: function() {
                    return {
                        formData: {
                            po: _this.po,
                            item: _this.selectedItem
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
    background-color: #eee;
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

.btn-round {
    border-radius: 20px;
}

.text-center {
    text-align: center;
}

.selected {
    background-color: yellow;
}
</style>
