<script setup lang="ts">


const taskStore = useTaskStore()

const {filters,loading} = storeToRefs(taskStore)
const {getFilters, getTasks} = taskStore
const tasks = ref([])


onBeforeMount(async ()=>{
  await getFilters()
  await fetchTasks({})
})

const fetchTasks = async (filters)=>{
    tasks.value = await getTasks(filters)
}



</script>

<template>
  <div class="container ">
    <p class="font-medium text-2xl mb-4">Биржа задач</p>

    <div class="flex items-center gap-2 overflow-x-auto mb-4">
      <p class="rounded-2xl px-3 py-2 bg-primary text-white text-sm font-medium" @click="fetchTasks({})">Все</p>
      <p class="rounded-2xl px-3 py-2 text-sm font-medium"
         :style="`background:${filter.bg_color};color:${filter.text_color}`"
         @click="fetchTasks({filters:[filter.id]})"
         v-for="filter in filters" :key="filter.id">
        {{filter.name}}</p>
    </div>

    <div v-if="loading" class="flex flex-col gap-3 items-start">
      <TaskSceleton  v-for="i in 5"/>
    </div>
    <div v-if="tasks.length>0" class="flex flex-col gap-3 items-start">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </div>

  </div>
</template>

<style scoped>

</style>