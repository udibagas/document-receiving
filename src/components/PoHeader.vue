<template lang="html">
    <div class="container">
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="120px">PO Number</v-ons-col>
            <v-ons-col>: {{po.E_POHEADER.PO_NUMBER}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="120px">Vendor</v-ons-col>
            <v-ons-col style="font-weight:normal;white-space: nowrap;text-overflow:ellipsis;overflow:hidden">: {{po.E_VENDOR_NAME}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;white-space: nowrap;">
            <v-ons-col width="120px">Created By</v-ons-col>
            <v-ons-col style="font-weight:normal;white-space: nowrap;text-overflow:ellipsis;overflow:hidden">: {{po.E_POHEADER.CREATED_BY}}/{{po.E_USER_FULLNAME}}</v-ons-col>
        </v-ons-row>
        <v-ons-row style="margin-bottom:5px;">
            <v-ons-col width="120px">Create Date</v-ons-col>
            <v-ons-col>: {{po.E_POHEADER.CREAT_DATE}}</v-ons-col>
        </v-ons-row>
        <v-ons-row>
            <v-ons-col width="120px">Release Status</v-ons-col>
            <v-ons-col>
                : <span :class="parseInt(po.E_POHEADER.PO_REL_IND) === 2 ? 'success' : 'danger'">
                    {{parseInt(po.E_POHEADER.PO_REL_IND) === 2 ? 'RELEASED' : 'NOT RELEASED'}}
                </span>
            </v-ons-col>
        </v-ons-row>
    </div>
</template>

<script>
export default {
    name: 'PoHeader',
    computed: {
        po() { return this.$store.state.po }
    }
}
</script>

<style scoped>
.container {
    padding:15px;
    background-color:#efefef;
}
</style>
