<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">PO DETAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:45px;">
            <v-ons-list-item v-for="item in itemList" :key="item.PO_ITEM" tappable :class="selectedItem === item.PO_ITEM ? 'selected' : ''">
                <div class="left">
                    <strong>#{{parseInt(item.PO_ITEM)}}</strong>
                </div>
                <div class="center" @click="selectedItem = item.PO_ITEM">
                    <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle" style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden">
                        {{item.MATERIAL_EXTERNAL}}
                    </span>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <div class="btn-fixed-bottom">
            <v-ons-button :disabled="selectedItem === ''" style="width:95%;" @click.prevent="createMrirNotification">CREATE MRIR NOTIFICATION</v-ons-button>
        </div>

        <div class="toast" v-show="toast.show" style="bottom:45px;">
            <div class="toast__message">{{toast.message}}</div>
            <button class="toast__button" @click="toast.show = false">OK</button>
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
        itemList() { return this.$store.state.itemList }
    },
    data: function() {
        return {
            selectedItem: '',
            toast: { show: false, message: '' }
        }
    },
    methods: {
        createMrirNotification: function() {
            let _this = this
            _this.$emit('push-page', {
                extends: MrirNotificationForm,
                data: function() {
                    return {
                        item: _this.itemList.find(i => i.PO_ITEM === _this.selectedItem)
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.selected {
    background-color: #D1ECF1;
}
</style>
