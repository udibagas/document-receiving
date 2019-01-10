<template lang="html">
    <v-ons-card>
        <v-ons-row>
            <v-ons-col v-if="!hasNoRelStrategy" width="60px" style="text-align:center;margin-right:10px;">
                <i v-if="parseInt(po.E_POHEADER.PO_REL_IND) !== 2" class="zmdi zmdi-tag-close zmdi-hc-4x" style="display:block;color:red;transform:rotate(-90deg);"></i>
                <i v-if="parseInt(po.E_POHEADER.PO_REL_IND) === 2" class="zmdi zmdi-badge-check zmdi-hc-4x" style="display:block;color:#17cec8;"></i>
                <span class="status"> {{parseInt(po.E_POHEADER.PO_REL_IND) === 2 ? 'Released' : 'Not Released'}} </span>
            </v-ons-col>
            <v-ons-col width="240px">
                <span class="po">{{po.E_POHEADER.PO_NUMBER}}</span>
                <span class="vendor">{{po.E_VENDOR_NAME}}</span>
                <v-ons-row>
                    <v-ons-col>
                        <span class="label">Type</span>
                        <span class="value">{{po.E_POHEADER.DOC_TYPE}}</span>
                    </v-ons-col>
                    <v-ons-col>
                        <span class="label">Created Date</span>
                        <span class="value">{{po.E_POHEADER.CREAT_DATE | readableDate}}</span>
                    </v-ons-col>
                </v-ons-row>
                <span class="label">Created By</span>
                <span class="value">{{po.E_POHEADER.CREATED_BY}}</span>
            </v-ons-col>
        </v-ons-row>
    </v-ons-card>
</template>

<script>
import moment from 'moment'

export default {
    filters: {
        readableDate(v) {
            return moment(v, 'YYYY-MM-DD').format('DD MMM YYYY')
        }
    },
    name: 'PoHeader',
    computed: {
        po() { return this.$store.state.po },
        hasNoRelStrategy() {
            let poTypes = 'ZAOG,ZCON,ZPOL,ZVMI,ZSSM,ZCUS,ZCST'.split(',')
            return poTypes.indexOf(this.po.E_POHEADER.DOC_TYPE) >= 0
        }
    }
}
</script>

<style scoped>
.card {
    border-radius: 15px;
    padding: 15px;
}

.status {
    font-size: 10px;
}

.po {
    font-weight: bold;
    color: #d1c23a;
    display: block;
    font-size: 12px;
    margin: 0 0 3px 0;
}

.vendor {
    font-size: 16px;
    color: #3a6897;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 3px 0;
}

.label {
    display: block;
    font-style: italic;
    color: #ccc;
    font-size: 10px;
    margin: 3px 0;
}

.value {
    color: #555;
    margin: 3px 0;
    font-size: 13px;
}
</style>
