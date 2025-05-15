import { useRoute } from 'vue-router';
import nuxtStorage from 'nuxt-storage';
//
// export default defineNuxtPlugin(async (nuxtApp):Promise<any> => {
//
//     const auth_token = nuxtStorage.localStorage.getData('auth_token');
//
//     const authStore = useAuthStore()
//     const {checkUser} = authStore
//
//     const route = useRoute();
//
//     const parseHashData = () => {
//         console.log(route.fullPath)
//         const hash = route.hash;
//
//         if (hash) {
//             try {
//                 // Удаляем символ `#` из хэша
//                 const cleanHash = hash.slice(1);
//
//                 // Преобразуем строку хэша в параметры
//                 const params = new URLSearchParams(cleanHash);
//
//                 // Получаем значение tgWebAppData
//                 const userData = params.get("user");
//                 const signature = params.get("signature");
//                 return JSON.parse(userData);
//
//             } catch (error) {
//                 console.error("Ошибка парсинга tgWebAppData:", error);
//             }
//         } else {
//             console.error("Хэш отсутствует.");
//         }
//
//         return null;
//     };
//
//     const userData = parseHashData();
//     console.log(userData)
//
//     await checkUser(userData)
//     console.log('init auth_token',auth_token)
//     if (auth_token){
//         await authStore.me()
//     }
//
//
// })

export default defineNuxtPlugin(async (nuxtApp): Promise<any> => {
    const authStore = useAuthStore();
    const { checkUser, me } = authStore;

    const auth_token = nuxtStorage.localStorage.getData('auth_token');
    console.log('init auth_token', auth_token);

    // Проверяем, доступен ли Telegram WebApp API
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;

        console.log("WebAppUser:", tgUser);

        await checkUser(tgUser);
    } else {
        console.warn("Telegram WebAppUser не найден.");
    }

    if (auth_token) {
        await me();
    }
});

