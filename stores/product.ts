
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

    const productActionOld = async (body) => {
        loading.value = true
        const {data} = await $api.post(`/api/product/action`,body)
        loading.value = false
        return data
    }
    const productAction = async ({ id, like, comment, voice_message }) => {
        loading.value = true
        const formData = new FormData();
        formData.append('id', id);
        formData.append('like', like);
        formData.append('comment', comment || '');

        if (voice_message) {
            formData.append('voice_message', voice_message); // File или Blob
        }

        const { data } = await $api.post('/api/product/action', formData);

        loading.value = false;
        return data;
    };
    return{
        loading,getCategories,getCategory,productAction
    }

})