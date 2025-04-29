<script setup lang="ts">
const productStore = useProductStore()

const {getCategory,productAction} = productStore
const {id} = useRoute().params
const category = ref()
const open = ref(false);
const visible = ref(false);
const loading = ref(false);

onBeforeMount(async ()=>{
  await fetchCategory()
})

const comment = ref(null)

const fetchCategory = async () => {
  category.value = await getCategory(id)
}

const rateProduct = async (like) => {
  loading.value = true
  await productAction({
    id: category.value.filtered_product.id,
    like,
    comment:comment.value,
  })
  comment.value = null
  await fetchCategory()
  loading.value = false
}



</script>

<template>

<div  v-if="category">
  <div class="sticky bg-[#f7f7f7] z-50 top-[0px] pt-3 px-3 flex items-center justify-between ">
    <Button @click="navigateTo('/category')" label="Назад" icon="pi pi-angle-left" size="small" rounded severity="secondary"/>
    <div class="text-center">
<!--      <p class="font-semibold"> {{category.name}}</p>-->
      <p class="text-sm">{{category.rated_products}} из {{category.total_products}}</p>
    </div>

  </div>
  <template v-if="category.filtered_product">
    <div class="container">
      <div class="bg-white rounded-[10px] w-full h-[550px] flex flex-col items-center justify-center mb-3">
        <Galleria :value="category.filtered_product.images" :numVisible="5" containerStyle="max-width: 640px" :showThumbnails="false"
                  :showIndicators="true" :changeItemOnIndicatorHover="true" :showIndicatorsOnItem="false" :indicatorsPosition="'bottom'">
          <template #item="slotProps">
            <img class="w-full h-[340px] object-cover" :src="slotProps.item.file"   />
          </template>
        </Galleria>
      </div>
      <div class="p-6 bg-white rounded-[10px] ">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{category.filtered_product.name}}</h2>
          <button @click="open = !open" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                :class="['w-5 h-5 transform transition-transform duration-300', open ? 'rotate-180' : '']"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <p
            class="mt-2 text-gray-600 transition-all duration-300 overflow-hidden whitespace-pre-line"
            :class="open ? 'max-h-full' : 'line-clamp-3'"
        >
          {{category.filtered_product.description}}
        </p>
      </div>
    </div>
    <div class="sticky bg-[#f7f7f7] z-50 bottom-[0px] p-3 flex items-center justify-between " :class="loading? 'disabled' : ''">
      <svg @click="rateProduct(false)" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="white"/>
        <path d="M24 24L40 40" stroke="#F95151" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M40 24L24 40" stroke="#F95151" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg @click="visible = true" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="white"/>
        <path d="M31.9995 20.1667C38.5347 20.1667 43.8333 25.4645 43.8335 31.9998C43.8335 38.5351 38.5348 43.8337 31.9995 43.8337C29.9825 43.8337 28.0877 43.3299 26.4292 42.4431L25.939 42.1804L25.396 42.3015L20.6411 43.3572L21.6987 38.6042L21.8188 38.0613L21.5571 37.571C20.6702 35.9124 20.1665 34.017 20.1665 31.9998C20.1667 25.4646 25.4644 20.1669 31.9995 20.1667Z" stroke="#8D8D8D" stroke-width="3"/>
      </svg>
      <svg  @click="rateProduct(true)" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="white"/>
        <path d="M37.9998 21C42.05 21 45.3332 24.3333 45.3332 29C45.3332 38.3333 35.3332 43.6667 31.9998 45.6667C28.6665 43.6667 18.6665 38.3333 18.6665 29C18.6665 24.3333 21.9998 21 25.9998 21C28.4798 21 30.6665 22.3333 31.9998 23.6667C33.3332 22.3333 35.5198 21 37.9998 21Z" fill="#44E385"/>
      </svg>
      <Dialog v-model:visible="visible" modal header="Ваш комментарий" :style="{ width: '25rem' }">
          <Textarea v-model="comment" class="mb-3" fluid autocomplete="off" />
          <Button fluid type="button" rounded  label="Сохранить комментарий" severity="contrast" @click="visible = false"></Button>

      </Dialog>
    </div>

  </template>
  <template v-else>
    <div class="bg-white rounded-[10px] w-full h-svh flex flex-col items-center justify-center mb-3">
      <p>Товаров нет</p>
    </div>
  </template>

</div>

  <div v-else class="w-full h-svh flex flex-col items-center justify-center">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
  </div>

</template>

<style scoped>

</style>