<script setup>
import {navigateTo} from "#app";

definePageMeta({
  layout: 'login'
})
const authStore = useAuthStore()
const {login,createPassword,me} = authStore
const {authData,loading} = storeToRefs(authStore)
const is_loading = ref(false)

const pinEntered = async (pin)=>{
  is_loading.value = true
  const result = await login({tg_id:authData.value.tg_id, password:pin})
  if (result.success){
    await me()
    navigateTo('/tasks')
  }else {
    is_loading.value = false
  }


}
const newPinEntered = async (pin)=>{
  await createPassword({tg_id:authData.value.tg_id, password:pin})
  const result = await login({tg_id:authData.value.tg_id, password:pin})
  if (result.success){
    navigateTo('/tasks')
  }
}

onBeforeMount(async ()=>{
  console.log(authData.value)
  if (authData.value.status==='exists'){
    await pinEntered('1111')
  }
  if (authData.value.status==='created'){
    await newPinEntered('1111')
  }
})


</script>

<template>
  <div class="container">
        <div  class="z-10 bg-zinc-500 bg-blend-darken absolute left-0 top-0 w-full h-full flex items-center justify-center">
          <i class="pi pi-spin pi-cog text-white" style="font-size: 2rem"></i>
        </div>
<!--    <div v-if="is_loading" class="z-10 bg-zinc-500 bg-blend-darken absolute left-0 top-0 w-full h-full flex items-center justify-center">-->
<!--      <i class="pi pi-spin pi-cog text-white" style="font-size: 2rem"></i>-->
<!--    </div>-->
<!--    <div v-if="authData.status==='exists'" class="h-screen flex items-center justify-center">-->
<!--      <PinCode :need-confirm="false" :digits-number="4" @entered-pincode="pinEntered"/>-->
<!--    </div>-->
<!--    <div v-if="authData.status==='created'" class="">-->
<!--      <PinCode :need-confirm="true" :digits-number="4" @new-pincode="newPinEntered"/>-->
<!--    </div>-->
  </div>
</template>
