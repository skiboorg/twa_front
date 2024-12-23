// plugins/axios.ts
import axios from 'axios';
import nuxtStorage from 'nuxt-storage';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const api = axios.create({
        baseURL: config.public.APIURL, // Используем baseURL из runtimeConfig
    });

    // Добавляем обработчик запросов
    api.interceptors.request.use((config) => {
        const auth_token = nuxtStorage.localStorage.getData('auth_token');
        if (auth_token) {
            config.headers.Authorization = `Token ${auth_token}`;
        }
        return config;
    });

    // Добавляем обработчик ошибок
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.error('Unauthorized access, redirecting...');
                return navigateTo('/');
            }
            return Promise.reject(error);
        }
    );

    // Делаем axios доступным через `useNuxtApp()`
    return {
        provide: {
            api: api,
        },
    };
});
