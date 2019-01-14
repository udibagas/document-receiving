<template lang="html">
    <v-ons-page>
        <v-ons-toolbar style="background-color:#3ACCE1;">
            <div class="center" style="text-align:center;">SUCCESS</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            {{message}}
        </div>
        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" @click.prevent="backToMain">BACK TO MAIN</v-ons-button>
        </div>
    </v-ons-page>
</template>

<script>
import Main from './Main'

export default {
    components: { Main },
    data: function() {
        return {
            message: ''
        }
    },
    methods: {
        backToMain: function() {
            this.$emit('replace-page', Main)
        }
    }
}
</script>

<style lang="css" scoped>
.content {
    padding: 15px;
    margin-top: 200px;
    font-size: 1.5em;
    text-align: center;
}
</style>
