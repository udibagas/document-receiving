<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">ITEM DETAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <ul class="list">
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
        </ul>

        <div class="btn-fixed-bottom">
            <v-ons-button v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2 && parseInt(item.QUANTITY) > item.QTY_INBOUND" style="width:95%" @click.prevent="createInbound">CREATE INBOUND</v-ons-button>
        </div>
    </v-ons-page>
</template>

<script>
import InboundForm from './InboundForm'

export default {
    computed: {
        po() { return this.$store.state.po }
    },
    data: function() {
        return {
            item: {}
        }
    },
    methods: {
        createInbound: function() {
            let _this = this
            _this.$emit('push-page', {
                extends: InboundForm,
                data: function() {
                    return {
                        po: _this.po,
                        items: [_this.item]
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
