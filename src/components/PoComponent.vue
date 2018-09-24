<template lang="html">
    <div style="padding:15px;background-color:#efefef;font-size:14px;">
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="130px">PO Number</v-ons-col>
            <v-ons-col style="font-weight:bold;">: {{po.PO_NUMBER}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="130px">Vendor</v-ons-col>
            <v-ons-col style="font-weight:bold;">: {{po.VENDOR}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="130px">Created By</v-ons-col>
            <v-ons-col style="font-weight:bold;">: {{po.CREATED_BY}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="130px">Create Date</v-ons-col>
            <v-ons-col style="font-weight:bold;">: {{po.CREAT_DATE}}</v-ons-col>
        </v-ons-row>
        <v-ons-row>
            <v-ons-col width="130px">Approval Status</v-ons-col>
            <v-ons-col style="font-weight:bold;">
                : <span :class="parseInt(po.PO_REL_IND) === 2 ? 'success' : 'danger'">
                    {{parseInt(po.PO_REL_IND) === 2  ? 'APPROVED' : 'NOT APPROVED'}}
                </span>
            </v-ons-col>
        </v-ons-row>
    </div>
</template>

<script>
export default {
    name: 'PoComponent',
    computed: {
        po() {
            return this.$store.state.po
        }
    }
}
</script>
