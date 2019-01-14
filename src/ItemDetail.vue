<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="nav-title">Item Detail</div>
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
                    {{item.QUANTITY}}
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
            <v-ons-button v-if="allowProcess && item.QUANTITY > item.QTY_INBOUND" style="width:95%" @click.prevent="createInbound">CREATE INBOUND</v-ons-button>
        </div>
    </v-ons-page>
</template>

<script>
import InboundForm from './InboundForm'

export default {
    computed: {
        po() { return this.$store.state.po },
        allowProcess() { return this.$store.getters.allowProcess }
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
.page {
    margin-top: 130px;
}
</style>
