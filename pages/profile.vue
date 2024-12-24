<script setup lang="ts">
const authStore = useAuthStore()

const {user,social_services} = storeToRefs(authStore)
const {get_social_services,social_action, loading, me} = authStore

const need_add_link = ref(false)
const service = ref(null)
const link = ref(null)
onBeforeMount(async ()=>{
  await get_social_services()
})
const socialAction = async (action,id=null)=>{
  if (action==='add'){
    await social_action({action, service:service.value, link:link.value})
    service.value = null
    link.value = null
    need_add_link.value = false
  }else {
    await social_action({action, id})
  }
  await me()


}
</script>



<template>
<div class="container  ">

  <div class="flex items-center justify-center flex-col mb-4">
    <img class="w-[125px] h-[125px] rounded-full mb-4" :src="user.photo_url" alt="">
    <p class="text-center text-2xl font-medium mb-4">{{user.firstname}} {{user.lastname}}</p>
    <div class="flex items-center justify-center gap-4">
      <p class="bg-white rounded-2xl items-center p-2 flex gap-2 text-sm">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.60326 0.816985C5.97008 0.0737389 7.02992 0.0737404 7.39674 0.816986L8.61847 3.29249C8.76413 3.58763 9.0457 3.7922 9.37141 3.83953L12.1033 4.2365C12.9235 4.35568 13.251 5.36365 12.6575 5.94219L10.6807 7.8691C10.445 8.09884 10.3375 8.42984 10.3931 8.75423L10.8598 11.4751C10.9999 12.292 10.1424 12.9149 9.40881 12.5293L6.96534 11.2446C6.67402 11.0915 6.32598 11.0915 6.03466 11.2446L3.59119 12.5293C2.85756 12.9149 2.00013 12.292 2.14024 11.4751L2.6069 8.75423C2.66254 8.42984 2.55499 8.09884 2.31931 7.8691L0.342496 5.94219C-0.251021 5.36365 0.0764905 4.35568 0.896711 4.2365L3.62859 3.83953C3.9543 3.7922 4.23587 3.58763 4.38153 3.29249L5.60326 0.816985Z" fill="#FFB800"/>
        </svg>
        {{user.rating}}
      </p>
      <p class="bg-white rounded-2xl items-center p-2 flex gap-2 text-sm text-primary">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13869 12.1902L4.00621 14.1092C3.68049 14.3087 3.25468 14.2064 3.05515 13.8807C2.95769 13.7216 2.92864 13.5299 2.97457 13.3491L3.45948 11.4405C3.63452 10.7515 4.10599 10.1756 4.74682 9.86791L8.1642 8.22716C8.32352 8.15067 8.39067 7.95951 8.31418 7.80019C8.25223 7.67116 8.11214 7.59896 7.97111 7.62338L4.16713 8.28194C3.39387 8.41581 2.6009 8.20228 1.99941 7.69823L0.797703 6.69116C0.504936 6.44581 0.466494 6.00958 0.711842 5.71682C0.83117 5.57442 1.00277 5.48602 1.18798 5.47153L4.85956 5.18419C5.11895 5.16389 5.345 4.99974 5.44458 4.75937L6.86101 1.3402C7.0072 0.987302 7.41179 0.819734 7.76469 0.965925C7.93413 1.03612 8.06876 1.17075 8.13896 1.3402L9.55539 4.75937C9.65496 4.99974 9.88101 5.16389 10.1404 5.18419L13.8322 5.47311C14.213 5.50291 14.4975 5.83578 14.4677 6.2166C14.4534 6.39979 14.3667 6.56975 14.2269 6.68896L11.4114 9.08928C11.2131 9.25826 11.1267 9.52425 11.1876 9.77748L12.0532 13.3733C12.1426 13.7447 11.914 14.1182 11.5427 14.2076C11.3642 14.2506 11.176 14.2208 11.0195 14.1249L7.86128 12.1902C7.63956 12.0544 7.3604 12.0544 7.13869 12.1902Z" fill="#6092F1"/>
        </svg>
        {{user.balance}}
      </p>
    </div>
  </div>



  <p class="font-medium text-left mb-3">Подключенные аккаунты</p>
  <div class="bg-white p-4 rounded-2xl mb-3">

    <div class="flex items-center gap-3 border-b mb-2 pb-2" v-for="service in user?.social" :key="service.id">

      <img :src="service.service.icon" class="w-[25px] h-[25px] rounded-full"  alt="">
      <p class=" ">{{service.service.name}}</p>
      <p class="grow  overflow-ellipsis opacity-60">{{service.link}}</p>
      <i class="pi pi-trash" @click="socialAction('delete',service.id)"></i>
    </div>


    <div class="flex items-center gap-3" @click="need_add_link = !need_add_link">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="14" fill="#6092F1" fill-opacity="0.15"/>
        <rect x="13" y="8" width="2" height="12" rx="1" fill="#6092F1"/>
        <rect x="8" y="15" width="2" height="12" rx="1" transform="rotate(-90 8 15)" fill="#6092F1"/>
      </svg>
      <p class="text-primary">Добавить аккаунт</p>
    </div>

    <div class="mt-3" v-if="need_add_link">
      <Select class="mb-3" fluid v-model="service" :options='social_services' option-label="name" option-value="id" placeholder="Выберите сервис"/>
      <InputText class="mb-3" fluid v-model="link" placeholder="Ссылка"/>
      <Button :disabled="!service || !link" fluid :loading="loading" @click="socialAction('add')" label="Добавить"/>
    </div>
  </div>
  <p class="font-medium text-left mb-3">Mой баланс</p>
  <div class="bg-white p-4 rounded-2xl mb-3">
    <p class="mb-2">Кошелек TON</p>
    <InputText class="mb-4" fluid v-model="user.wallet" placeholder="Кошелек TON"/>
    <p class="opacity-50 text-xs">Вывод средств осуществляется после отправления ваши запросы на вывод, минимальная сумма вывода - от 1000 Coin (~150$, 10 TON)</p>
  </div>

</div>
</template>

<style scoped>

</style>