<script setup lang="ts">

const productStore = useProductStore()

const {getCategories} = productStore
const categories = ref([])
onBeforeMount(async ()=>{
  categories.value = await getCategories()
})
</script>

<template>
  <div class="container">
    <div class="flex items-center justify-between mb-6">
      <p class="font-semibold text-2xl">Категории товаров</p>
      <p class="text-gray-400">{{categories.length}} категорий</p>
    </div>

    <div class="bg-white rounded-[16px] p-3 mb-3"
         @click="navigateTo(`/category/${category.id}`)"
         v-for="category in categories" :key="category.id">
      <div class="grid grid-cols-12 gap-3" >
        <div class="col-span-3">
          <img class="w-[80px] h-[80px] rounded-[16px] object-cover" :src="category.image" alt="">
        </div>
        <div class="col-span-9 ">
          <p class="font-semibold mb-2">{{category.name}}</p>
          <p class="text-gray-400 text-sm mb-2">{{category.rated_products}} из {{category.total_products}} товаров</p>
          <ProgressBar :value="category.unrated_percentage" :show-value="false" style="height: 6px"></ProgressBar>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>