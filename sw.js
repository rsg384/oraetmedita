// Service Worker para Ora et Medita
const CACHE_NAME = 'ora-et-medita-v1';
const urlsToCache = [
    '/',
    '/dashboard.html',
    '/minhas-meditacoes.html',
    '/progresso.html',
    '/categorias.html',
    '/meditacao.html',
    '/agendamentos.html'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('🔄 Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar requisições para cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retornar do cache se disponível
                if (response) {
                    return response;
                }
                // Buscar da rede
                return fetch(event.request);
            }
        )
    );
});

// Gerenciar notificações push
self.addEventListener('push', (event) => {
    console.log('📱 Notificação push recebida');
    
    let notificationData = {
        title: 'Ora et Medita',
        body: 'Hora da sua meditação!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icon-192x192.png'
            }
        ]
    };

    // Se há dados na notificação, usar eles
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            notificationData.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Gerenciar cliques nas notificações
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Notificação clicada:', event.action);
    
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/dashboard.html')
        );
    }
});

// Gerenciar fechamento de notificações
self.addEventListener('notificationclose', (event) => {
    console.log('❌ Notificação fechada');
});

console.log('✅ Service Worker carregado'); 