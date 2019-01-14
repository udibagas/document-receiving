<template>
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="nav-title">MRIR Notification</div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:15px;">
            <v-ons-list-item v-for="item in itemList" :key="item.PO_ITEM" tappable modifier="chevron" @click="createMrirNotification(item)">
                <div class="center">
                    <div class="list-item__title">#{{parseInt(item.PO_ITEM)}} | {{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle" style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden">
                        {{item.MATERIAL_EXTERNAL}}
                    </span>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>
    </v-ons-page>
</template>

<script>
import MrirNotificationForm from './MrirNotificationForm'
import PoHeader from './PoHeader'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po },
        itemList() { return this.$store.getters.itemList }
    },
    data: function() {
        return {
            error: ''
        }
    },
    methods: {
        createMrirNotification: function(item) {
            this.$emit('push-page', {
                extends: MrirNotificationForm,
                data: function() {
                    return { item: item }
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

.list-item__title {
    font-size: 14px;
    color: #3a6897;
    font-family: 'OpenSans';
    font-weight: bold;
}

.list-item__subtitle {
    font-size: 12px;
    font-family: 'OpenSans';
    color: #333;
}
</style>
