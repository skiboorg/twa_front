<script setup lang="ts">
const route = useRoute()
const taskStore = useTaskStore()
const {loading} = storeToRefs(taskStore)
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
const {$api} = useNuxtApp()
import { useToast } from 'primevue/usetoast';
const toast = useToast()
const {getTask, takeTask} = taskStore
const task = ref({})
const show_verify_form = ref(false)
const send = ref(false)
const comment = ref(null)
const files = ref([])
const link = ref(null)
const links = ref([])
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.locale('ru');

let formattedDate
onBeforeMount(async ()=>{
  task.value = await getTask(route.params.id)
  formattedDate = dayjs(task.value.created_at).fromNow();
})

const user_have_is_task = computed (()=>{
 return !!user.value.tasks?.find(t => t.task.id === task.value.id);
})



const fileSelected = (e) => {
  files.value.push(e.files[0])
  console.log(files.value)
}

const removeFile = (index)=>{
  files.value.splice(index,1)
}
const addLink = ()=>{
  links.value.push(link.value)
  link.value = null
}
const removeLink = (index)=>{
  links.value.splice(index,1)
}

const submitForm = async () => {
  send.value=true
  const formData = new FormData()
  formData.append('comment', comment.value)
  formData.append('id', task.value.id)

  links.value.forEach(link => {
    formData.append('links', link)
  })
  files.value.forEach(file => {
    formData.append('files', file)
  })


    const { data } = await $api.post('/api/task/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }}
    )
  task.value = await getTask(route.params.id)
  send.value=false


}

</script>

<template>
<div v-if="!show_verify_form" class="container bg-white h-screen">

  <p class="font-medium mb-1">{{task.name}}</p>
  <p class="text-gray-400 text-xs font-medium mb-3">{{formattedDate}}</p>

  <div class="flex items-center gap-3 mb-4">
    <div class="border rounded-xl px-3 py-2 grow">
      <p class="text-gray-400 font-medium text-xs mb-1">Цена</p>
      <p class="text-primary font-medium text-xs flex gap-2 items-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.74189 8.05508L2.5044 9.4258C2.27174 9.5683 1.96759 9.49522 1.82507 9.26258C1.75546 9.14894 1.73471 9.01201 1.76752 8.88287L2.11388 7.51958C2.23891 7.02744 2.57567 6.61608 3.03341 6.3963L5.47439 5.22434C5.58819 5.1697 5.63616 5.03316 5.58152 4.91936C5.53727 4.8272 5.43721 4.77562 5.33647 4.79307L2.61934 5.26347C2.06701 5.35909 1.50061 5.20657 1.07097 4.84653L0.21261 4.1272C0.00349054 3.95195 -0.0239677 3.64035 0.151281 3.43124C0.236515 3.32952 0.359084 3.26638 0.491381 3.25603L3.11394 3.05079C3.29921 3.03629 3.46068 2.91904 3.53181 2.74735L4.54354 0.305081C4.64796 0.0530114 4.93696 -0.06668 5.18903 0.0377421C5.31006 0.0878814 5.40622 0.184046 5.45636 0.305081L6.4681 2.74735C6.53922 2.91904 6.70069 3.03629 6.88596 3.05079L9.52296 3.25716C9.79496 3.27845 9.99818 3.51621 9.97689 3.78822C9.96668 3.91907 9.90475 4.04047 9.80489 4.12562L7.79382 5.84014C7.65218 5.96084 7.59046 6.15083 7.63396 6.33171L8.25225 8.90015C8.31611 9.16544 8.15282 9.43222 7.88761 9.49608C7.76011 9.5268 7.62568 9.50551 7.51389 9.43701L5.25802 8.05508C5.09965 7.95808 4.90025 7.95808 4.74189 8.05508Z" fill="#6092F1"/>
      </svg>
        {{task.price}}</p>
    </div>
    <div class="border rounded-xl px-3 py-2 grow">
      <p class="text-gray-400 font-medium text-xs mb-1">Срок</p>
      <p class=" font-medium text-xs flex gap-2 items-center">{{task.days_until_deadline}} дней</p>
    </div>
    <div class="border rounded-xl px-3 py-2 grow">
      <p class="text-gray-400 font-medium text-xs mb-1">Уровень</p>
      <p class=" font-medium text-xs flex gap-2 items-center">{{task.level?.name}}</p>
    </div>
  </div>
  <p class="font-medium mb-1">Описание</p>
  <div class="text-gray-400 text-sm mb-4" v-html="task.full_description"></div>
  <div class="mb-4" v-if="task.files">
    <p class="font-medium mb-2">Файлы</p>
    <a :href="file.file" target="_blank" class="border rounded-xl p-3 flex items-center justify-between mb-2" v-for="file in task.files" :key="file.id">
      <p class="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#F2F5F8"/>
          <g clip-path="url(#clip0_77_2294)">
            <path d="M22.2933 15.3668L16.1667 21.4934C15.4161 22.244 14.3981 22.6657 13.3367 22.6657C12.2752 22.6657 11.2572 22.244 10.5067 21.4934C9.7561 20.7429 9.33444 19.7249 9.33444 18.6634C9.33444 17.602 9.7561 16.584 10.5067 15.8334L16.6333 9.70678C17.1337 9.2064 17.8124 8.92529 18.52 8.92529C19.2276 8.92529 19.9063 9.2064 20.4067 9.70678C20.907 10.2072 21.1881 10.8858 21.1881 11.5934C21.1881 12.3011 20.907 12.9797 20.4067 13.4801L14.2733 19.6068C14.0231 19.857 13.6838 19.9975 13.33 19.9975C12.9762 19.9975 12.6369 19.857 12.3867 19.6068C12.1365 19.3566 11.9959 19.0173 11.9959 18.6634C11.9959 18.3096 12.1365 17.9703 12.3867 17.7201L18.0467 12.0668" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_77_2294">
              <rect width="16" height="16" fill="white" transform="translate(8 8)"/>
            </clipPath>
          </defs>
        </svg>
      <span>{{file.file?.split('/').pop()}}</span>
      </p>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#6092F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.83331 8.33325L9.99998 12.4999L14.1666 8.33325" stroke="#6092F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 12.5V2.5" stroke="#6092F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

    </a>
  </div>
  <div class="" v-if="task.links">
    <p class="font-medium mb-2">Ссылки</p>
    <a :href="link.url" target="_blank" class="border rounded-xl p-3 flex items-center justify-between mb-2" v-for="link in task.links" :key="link.id">
      <p class="flex items-center gap-2">
        <span>{{link.url}}</span>
      </p>

    </a>
  </div>

  <Button v-if="!user_have_is_task" class="mt-4" :loading="loading" fluid label="Откликнуться" @click="takeTask(task.id)"/>
  <Button v-if="!task.in_review" class="mt-4" severity="success" :loading="loading" fluid label="Сдать на проверку" @click="show_verify_form = true"/>

</div>
  <div class="container bg-white  mb-2" v-else>
    <p class="font-medium">Написать комментарий</p>
    <Textarea v-model="comment" fluid rows="6"/>
    <p class="font-medium mb-2">Прикрепить файлы</p>
    <p  class="border rounded-xl p-3 flex items-center justify-between mb-2" v-for="(file,index) in files" :key="index">
      <p class="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#F2F5F8"/>
          <g clip-path="url(#clip0_77_2294)">
            <path d="M22.2933 15.3668L16.1667 21.4934C15.4161 22.244 14.3981 22.6657 13.3367 22.6657C12.2752 22.6657 11.2572 22.244 10.5067 21.4934C9.7561 20.7429 9.33444 19.7249 9.33444 18.6634C9.33444 17.602 9.7561 16.584 10.5067 15.8334L16.6333 9.70678C17.1337 9.2064 17.8124 8.92529 18.52 8.92529C19.2276 8.92529 19.9063 9.2064 20.4067 9.70678C20.907 10.2072 21.1881 10.8858 21.1881 11.5934C21.1881 12.3011 20.907 12.9797 20.4067 13.4801L14.2733 19.6068C14.0231 19.857 13.6838 19.9975 13.33 19.9975C12.9762 19.9975 12.6369 19.857 12.3867 19.6068C12.1365 19.3566 11.9959 19.0173 11.9959 18.6634C11.9959 18.3096 12.1365 17.9703 12.3867 17.7201L18.0467 12.0668" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_77_2294">
              <rect width="16" height="16" fill="white" transform="translate(8 8)"/>
            </clipPath>
          </defs>
        </svg>
        <span>{{file.name}}</span>
      </p>
      <i class="pi pi-trash" @click="removeFile(index)"></i>

    </p>
    <FileUpload  mode="basic" chooseLabel="Прикрепите файл" class=" py-2 w-full mb-4" accept="image/*" @select="fileSelected"/>

    <p class="font-medium mb-2">Прикрепить ссылки</p>
    <p  class="border rounded-xl p-3 flex items-center justify-between mb-2" v-for="(link,index) in links" :key="index">
      <p class="flex items-center gap-2">
        <span>{{link}}</span>
      </p>
      <i class="pi pi-trash" @click="removeLink(index)"></i>

    </p>
    <div class="flex gap-3 mb-4">
      <InputText class="grow" v-model="link" />
      <Button   @click="addLink" icon="pi pi-plus"/>
    </div>
    <Button :loading="send" fluid severity="success" @click="submitForm" label="ОТПРАВИТЬ"/>

  </div>
</template>

<style scoped>

</style>