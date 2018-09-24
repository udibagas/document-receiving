<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="center">PAGE 1</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div style="text-align:center">
            <h1>{{nomer}}</h1>
            <p>
                <!-- <v-ons-button @click="goto2">GO TO PAGE 2</v-ons-button> -->
                <v-ons-button @click="increment">+</v-ons-button>
                <v-ons-button @click="decrement">-</v-ons-button>
            </p>

        </div>
    </v-ons-page>
</template>

<script>
import Page2 from './Page2'

export default {
    computed: {
        nomer() {
            return this.$store.state.nomer;
        }
    },
    methods: {
        increment() {
            this.$store.commit('increment', 3)
        },
        decrement() {
            this.$store.commit('decrement', 3)
        },
        goto2: function() {
            this.$emit('push-page', Page2)
        }
    }

}
</script>

<style lang="css">
</style>
