<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="nav-title">Goods Receipt</div>
        <po-header></po-header>

        <v-ons-card style="margin-bottom:70px;" v-if="poConfirmation.filter(c => parseFloat(c.QUANTITY) > parseFloat(c.QTY_REDUCED)).length > 0">
            <v-ons-row v-for="(c, i) in poConfirmation"
            :key="i"
            v-if="parseFloat(c.QUANTITY) > parseFloat(c.QTY_REDUCED) && c.CONF_NAME === 'Inbound Delivery'"
            tappable
            @click="createGr(c)">
                <v-ons-col width="40px" style="text-align:center;margin-right:15px;">
                    <div class="icon-container">
                        <i class="zmdi zmdi-label" style="color:#fff;"></i>
                    </div>
                    <div class="vertical-line">&nbsp;</div>
                </v-ons-col>
                <v-ons-col>
                    <span class="deliv-number">{{c.DELIV_NUMB}}</span>
                    <v-ons-row>
                        <v-ons-col>
                            <span class="label">Prelim Doc No.</span> <span class="value">{{c.PREL_DOC_NO || '-'}}</span>
                        </v-ons-col>
                        <v-ons-col>
                            <span class="label">Invoice Number</span> <span class="value">{{c.INVOICE_NO || '-'}}</span>
                        </v-ons-col>
                    </v-ons-row>
                    <span class="label">Bill of Lading</span> <span class="value">{{c.BILL_OF_LADING || '-'}}</span>
                    <span class="label">Part Number</span> <span class="value">{{itemList.find(i => i.PO_ITEM === c.PO_ITEM).MATERIAL_EXTERNAL}}</span>
                    <span class="label">Mat. Description</span> <span class="value">{{itemList.find(i => i.PO_ITEM === c.PO_ITEM).SHORT_TEXT}}</span>
                    <br>
                    <br>
                </v-ons-col>
            </v-ons-row>
        </v-ons-card>

        <div class="btn-fixed-bottom">
            <v-ons-button v-if="!allowProcess" style="width:95%;" @click.prevent="createNotification">CREATE NOTIFICATION</v-ons-button>
        </div>

    </v-ons-page>
</template>

<script>
import axios from 'axios'
import NotificationForm from './NotificationForm'
import GrForm from './GrForm'
import PoHeader from './PoHeader'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po },
        poConfirmation() { return this.$store.getters.poConfirmation },
        itemList() { return this.$store.getters.itemListAll },
        allowProcess() { return this.$store.getters.allowProcess }
    },
    methods: {
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
                        problem: { notifGroup: 'ZGPP', notifType: 'G3', notifCode: '14', description: 'RELEASE PO' },
                        purchaser_name: _this.po.E_USER_FULLNAME,
                        description: problemDescription,
                        to: _this.po.E_USER_EMAIL,
                        po_number: _this.po.E_POHEADER.PO_NUMBER
                    }
                }
            })
        },
        createGr: function(inbound) {
            if (!this.allowProcess) {
                return
            }

            let item = this.itemList.find(i => i.PO_ITEM === inbound.PO_ITEM)
            this.$emit('push-page', {
                extends: GrForm,
                data: function() {
                    return {
                        inbound: inbound,
                        item: item
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.page {
    margin-top: 130px;
}

.background {
    background-color: #F3F3F3;
}

.card {
    border-radius: 15px;
}

.deliv-number {
    display: block;
    color: #454F63;
    font-size: 20px;
    margin-bottom: 10px;
}

.label {
    display: block;
    font-style: italic;
    color: #ccc;
    font-size: 10px;
    margin-top: 5px;
}

.value {
    color: #333;
    font-size: 13px;
}

.icon-container {
    background-color: #3497FD;
    border-radius: 8px;
    width:30px;
    height:30px;
    line-height:30px;
    margin:0 auto;
}

.vertical-line {
    width:1px;
    margin:0 auto;
    border-left:2px solid #ddd;
    height:85%;
}
</style>
