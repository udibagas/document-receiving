<template>
    <v-ons-navigator swipeable
        :page-stack="pageStack"
        @push-page="pageStack.push($event)"
        @replace-page="pageStack.pop(); pageStack.push($event)"
    ></v-ons-navigator>
</template>

<script>
import Login from './components/Login'

export default {
    name: 'app',
    data: function() {
        return {
            pageStack: [Login]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
