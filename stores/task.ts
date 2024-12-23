import type {Task} from "nitropack";

export const useTaskStore = defineStore('task', () => {

    const {$api} = useNuxtApp()
    const filters = ref([])
    const loading = ref(false)

    const getFilters = async () => {
        if (filters.value.length>0) return
        const {data} = await $api.get('/api/task/filters')
        filters.value = data
    }

    const getTask = async (id) => {
        loading.value = true
        const { data } = await $api.get(`/api/task/task/${id}`);
        loading.value = false
        return data
    }
    const getTasks = async (filters) => {
        loading.value = true
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else if (value !== undefined && value !== null) {
                params.append(key, value);
            }
        }

        const { data } = await $api.get(`/api/task/tasks?${params.toString()}`);
        loading.value = false
        return data
    }

    return{
        filters,loading,getFilters,getTasks,getTask
    }

})