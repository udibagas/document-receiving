<template lang="html">
    <v-ons-page>
        <h2>Ini halaman 2</h2>
        <v-ons-button @click="popMe">POP ME</v-ons-button>
    </v-ons-page>
</template>

<script>
export default {
    methods: {
        popMe: function() {
            this.$emit('pop-page')
        }
    }

}
</script>

<style lang="css">
</style>
