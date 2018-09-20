<template>
    <v-ons-navigator swipeable
        :page-stack="pageStack"
        @push-page="pageStack.push($event)"
        @replace-page="pageStack.pop(); pageStack.push($event)"
    ></v-ons-navigator>
</template>

<script>
import Login from './components/Login'
import Main from './components/Main'

export default {
    name: 'app',
    data: function() {
        return {
            pageStack: [(window.localStorage.isLoggedIn === 'true') ? Main : Login]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
