<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="title">Goods Receipt</div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:15px;">
            <li class="list-header">Unprocessed Inbound</li>
            <v-ons-list-item v-for="(c, i) in poConfirmation"
                :key="i"
                v-if="parseFloat(c.QUANTITY) > parseFloat(c.QTY_REDUCED) && c.CONF_NAME === 'Inbound Delivery'"
                tappable modifier="chevron"
                @click="createGr(c)">
                <div class="center">
                    <div class="list-item__title">
                        {{c.DELIV_NUMB}}
                    </div>
                    <div class="list-item__subtitle">
                        <span class="my-label">Prelim Doc No.</span> : {{c.PREL_DOC_NO}}<br>
                        <span class="my-label">Invoice Number</span> : {{c.INVOICE_NO}}<br>
                        <span class="my-label">Bill of Lading</span> : {{c.BILL_OF_LADING}}<br>
                        <span class="my-label">Part Number</span> : {{itemList.find(i => i.PO_ITEM === c.PO_ITEM).MATERIAL_EXTERNAL}}<br>
                        <span class="my-label">Mat. Description</span> : <span style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden">{{itemList.find(i => i.PO_ITEM === c.PO_ITEM).SHORT_TEXT}}</span>
                    </div>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <h4 class="danger" style="text-align:center;text-transform:uppercase;margin-top:50px;" v-if="poConfirmation.filter(c => parseFloat(c.QUANTITY) > parseFloat(c.QTY_REDUCED)).length === 0">
            No Unprocessed Inbound Found
        </h4>

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
.background {
    background-color: #F3F3F3;
}

.page {
    margin-top: 130px;
}

.my-label {
    width: 110px;
    display: inline-block;
}

.title {
    color:#fff;
    background-color:#1e2237;
    background-image: url('./assets/img/ID4.png');
    background-position: left;
    margin-top: 0;
    height: 80px;
    line-height: 80px;
    position: fixed;
    width: 100%;
    top: 50px;
    font-size: 24px;
    padding-left: 15px;
}
</style>
