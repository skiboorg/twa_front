<script setup lang="ts">
const productStore = useProductStore()

const {getCategory,productAction} = productStore
const {id} = useRoute().params
const category = ref()
const open = ref(false);
const visible = ref(false);
const loading = ref(false);
const containerRef = ref();
const can_record = ref(false);
const is_recording = ref(false);
const voiceFile = ref(false);
const swiper = useSwiper(containerRef)

onBeforeMount(async ()=>{
  await fetchCategory()
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    can_record.value = true;
  }
})

const comment = ref(null)

const fetchCategory = async () => {
  category.value = await getCategory(id)
}

const rateProduct = async (like) => {
  loading.value = true;

  const body = {
    id: category.value.filtered_product.id,
    like,
    comment: comment.value,
    voice_message:null
  };

  // Добавим файл, если он выбран
  if (voiceFile.value) {
    body.voice_message = voiceFile.value; // File или Blob объект
  }

  await productAction(body);

  comment.value = null;
  voiceFile.value = null; // очистка файла после отправки (если нужно)
  await fetchCategory();
  loading.value = false;
};

let mediaRecorder = null
let audioChunks = []

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const audioFile = new File([audioBlob], 'voice_message.webm', {
        type: 'audio/webm',
      })

      // можно тут отправить на сервер или сохранить
      console.log('Запись завершена', audioFile)
      voiceFile.value = audioFile
    }

    mediaRecorder.start()
    is_recording.value = true
  } catch (err) {
    console.error('Ошибка записи:', err)
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    is_recording.value = false
  }
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
      <div class="bg-white rounded-[10px] w-full py-10  mb-3">
        <swiper-container ref="containerRef"
                          class="h-[400px]"
                          pagination-clickable="true"
                          style="--swiper-pagination-color: lime; --swiper-pagination-bottom: 0px;">
          <swiper-slide
              v-for="(img, idx) in category.filtered_product.images"
              :key="idx"

          >
              <div class="card flex justify-center h-full">
                <Image alt="Image" preview>
                  <template #previewicon>
                    <i class="pi pi-search"></i>
                  </template>
                  <template #image>
                    <img class="w-full h-[340px] object-cover" :src="img.file" alt="image"  />
                  </template>
                  <template #preview="slotProps">
                    <img :src="img.file" alt="preview" :style="slotProps.style" @click="slotProps.onClick" />
                  </template>
                </Image>
              </div>
          </swiper-slide>
        </swiper-container>
        </div>
      <div class="p-6 bg-white rounded-[10px] ">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{category.filtered_product.name}}</h2>
          <button @click="open = !open" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C12.2833 17 12.521 16.904 12.713 16.712C12.905 16.52 13.0007 16.2827 13 16V12C13 11.7167 12.904 11.4793 12.712 11.288C12.52 11.0967 12.2827 11.0007 12 11C11.7173 10.9993 11.48 11.0953 11.288 11.288C11.096 11.4807 11 11.718 11 12V16C11 16.2833 11.096 16.521 11.288 16.713C11.48 16.905 11.7173 17.0007 12 17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C12.9993 7.71733 12.9033 7.48 12.712 7.288C12.5207 7.096 12.2833 7 12 7C11.7167 7 11.4793 7.096 11.288 7.288C11.0967 7.48 11.0007 7.71733 11 8C10.9993 8.28267 11.0953 8.52033 11.288 8.713C11.4807 8.90567 11.718 9.00133 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22Z" fill="#B9B9B9"/>
            </svg>
          </button>
        </div>
        <p
            class="mt-2 text-gray-600 transition-all duration-300 overflow-hidden whitespace-pre-line"
            :class="open ? 'max-h-full' : 'line-clamp-3'"
        >
          {{category.filtered_product.description}}
        </p>
        <div v-if="category.filtered_product.buttons" class="flex flex-wrap gap-3 mt-4">
          <a class="inline-block bg-gray-900 text-white py-1 px-4 rounded-2xl"
             target="_blank"
             :href="btn.url"
             v-for="btn in category.filtered_product.buttons">
            {{btn.label}}
          </a>
        </div>

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
        <div class="flex gap-2">
          <Button class="grow" type="button" rounded  label="Сохранить комментарий" severity="contrast" @click="visible = false"></Button>
          <Button
              v-if="can_record"
              :severity="is_recording ? 'success' : 'contrast'"
              icon="pi pi-microphone"
              rounded
              outlined
              @mousedown="startRecording"
              @mouseup="stopRecording"
              @touchstart.prevent="startRecording"
              @touchend.prevent="stopRecording"
          />
        </div>


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
