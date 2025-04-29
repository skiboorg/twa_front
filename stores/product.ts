
import { useToast } from 'primevue/usetoast';

export const useProductStore = defineStore('product', () => {
    const toast = useToast()
    const authStore = useAuthStore()
    const {me} = authStore
    const {$api} = useNuxtApp()

    const loading = ref(false)



    const getCategories = async () => {
        loading.value = true
        const {data} = await $api.get('/api/product/categories')
        loading.value = false
        return data
    }
    const getCategory = async (id) => {
        loading.value = true
        const {data} = await $api.get(`/api/product/category/${id}`)
        loading.value = false
        return data
    }

    const productAction = async (body) => {
        loading.value = true
        const {data} = await $api.post(`/api/product/action`,body)
        loading.value = false
        return data
    }
    return{
        loading,getCategories,getCategory,productAction
    }

})