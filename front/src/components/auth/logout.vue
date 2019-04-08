<template>

</template>
<script>
export default {
    created(){
        this.$store.dispatch('destroyToken').then(res => { // Pour detruire le token 
        this.$router.push('/dashboard')
      });
    }
}
</script>
