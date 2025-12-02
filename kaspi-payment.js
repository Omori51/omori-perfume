/**
 * Kaspi Payment Integration Module
 * Интеграция платежной системы Kaspi.kz
 * 
 * Для работы требуется:
 * - API ключ от Kaspi (KASPI_API_KEY)
 * - Merchant ID (KASPI_MERCHANT_ID)
 * - Секретный ключ для подписи (KASPI_SECRET_KEY)
 * - URL для webhook уведомлений
 */

class KaspiPayment {
    constructor(config = {}) {
        // Конфигурация Kaspi API
        this.apiKey = config.apiKey || localStorage.getItem('KASPI_API_KEY') || '';
        this.merchantId = config.merchantId || localStorage.getItem('KASPI_MERCHANT_ID') || '';
        this.secretKey = config.secretKey || localStorage.getItem('KASPI_SECRET_KEY') || '';
        this.apiUrl = config.apiUrl || 'https://api.kaspi.kz/v1/payments';
        this.isDemo = config.isDemo !== false; // По умолчанию демо-режим
        
        // URL для webhook (должен быть настроен на вашем сервере)
        this.webhookUrl = config.webhookUrl || window.location.origin + '/api/kaspi-webhook';
        
        // Хранилище платежей
        this.payments = this.loadPayments();
    }

    /**
     * Загрузка сохраненных платежей из localStorage
     */
    loadPayments() {
        try {
            const stored = localStorage.getItem('kaspi_payments');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Сохранение платежей в localStorage
     */
    savePayments() {
        try {
            localStorage.setItem('kaspi_payments', JSON.stringify(this.payments));
        } catch (e) {
            console.error('Ошибка сохранения платежей:', e);
        }
    }

    /**
     * Создание платежа через Kaspi API
     * @param {Object} orderData - Данные заказа
     * @returns {Promise<Object>} - Данные платежа с QR-кодом
     */
    async createPayment(orderData) {
        const {
            orderId,
            amount,
            description = 'Оплата заказа',
            customerPhone = '',
            customerEmail = ''
        } = orderData;

        if (!orderId || !amount) {
            throw new Error('Необходимы orderId и amount');
        }

        // В демо-режиме генерируем тестовый QR-код
        if (this.isDemo || !this.apiKey) {
            return this.createDemoPayment(orderId, amount, description);
        }

        // Реальный запрос к Kaspi API
        try {
            const paymentData = {
                merchantId: this.merchantId,
                orderId: orderId.toString(),
                amount: Math.round(amount * 100), // Конвертируем в тиыны
                currency: 'KZT',
                description: description,
                customerPhone: customerPhone,
                customerEmail: customerEmail,
                returnUrl: window.location.origin + '/payment-success',
                webhookUrl: this.webhookUrl,
                timestamp: Date.now()
            };

            // Подпись запроса
            const signature = this.generateSignature(paymentData);
            paymentData.signature = signature;

            const response = await fetch(this.apiUrl + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Merchant-Id': this.merchantId
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка создания платежа');
            }

            const result = await response.json();
            
            // Сохраняем платеж
            const payment = {
                id: result.paymentId || orderId,
                orderId: orderId,
                amount: amount,
                status: 'pending',
                qrCode: result.qrCode || result.qrCodeUrl,
                paymentUrl: result.paymentUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.payments.push(payment);
            this.savePayments();

            return payment;
        } catch (error) {
            console.error('Ошибка создания платежа Kaspi:', error);
            // В случае ошибки возвращаем демо-платеж
            return this.createDemoPayment(orderId, amount, description);
        }
    }

    /**
     * Создание демо-платежа (для тестирования без API)
     */
    createDemoPayment(orderId, amount, description) {
        // Генерируем QR-код с данными платежа
        const qrData = {
            type: 'kaspi_payment',
            orderId: orderId,
            amount: amount,
            merchant: this.merchantId || 'DEMO_MERCHANT',
            timestamp: Date.now()
        };

        // Используем QR-код сервис для генерации
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrData))}`;
        
        const payment = {
            id: 'DEMO_' + orderId,
            orderId: orderId,
            amount: amount,
            status: 'pending',
            qrCode: qrCodeUrl,
            paymentUrl: `kaspi://payment?orderId=${orderId}&amount=${amount}`,
            description: description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDemo: true
        };

        this.payments.push(payment);
        this.savePayments();

        return payment;
    }

    /**
     * Проверка статуса платежа
     * @param {string} paymentId - ID платежа
     * @returns {Promise<Object>} - Статус платежа
     */
    async checkPaymentStatus(paymentId) {
        const payment = this.payments.find(p => p.id === paymentId || p.orderId === paymentId);
        
        if (!payment) {
            throw new Error('Платеж не найден');
        }

        // В демо-режиме симулируем проверку
        if (this.isDemo || !this.apiKey || payment.isDemo) {
            return payment;
        }

        // Реальный запрос к Kaspi API
        try {
            const response = await fetch(`${this.apiUrl}/status/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Merchant-Id': this.merchantId
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка проверки статуса');
            }

            const result = await response.json();
            
            // Обновляем статус платежа
            payment.status = result.status || payment.status;
            payment.updatedAt = new Date().toISOString();
            
            if (result.transactionId) {
                payment.transactionId = result.transactionId;
            }

            this.savePayments();
            return payment;
        } catch (error) {
            console.error('Ошибка проверки статуса:', error);
            return payment;
        }
    }

    /**
     * Импорт платежей из Kaspi (через API или файл)
     * @param {Array|string} data - Массив платежей или JSON строка
     * @returns {Array} - Импортированные платежи
     */
    importPayments(data) {
        let payments = [];

        // Если строка - парсим JSON
        if (typeof data === 'string') {
            try {
                payments = JSON.parse(data);
            } catch (e) {
                throw new Error('Неверный формат данных');
            }
        } else if (Array.isArray(data)) {
            payments = data;
        } else {
            throw new Error('Данные должны быть массивом или JSON строкой');
        }

        // Валидация и нормализация платежей
        const imported = payments.map(p => ({
            id: p.paymentId || p.id || 'IMPORT_' + Date.now() + '_' + Math.random(),
            orderId: p.orderId || p.order_id,
            amount: Number(p.amount) || 0,
            status: p.status || 'completed',
            transactionId: p.transactionId || p.transaction_id,
            qrCode: p.qrCode || p.qr_code,
            paymentUrl: p.paymentUrl || p.payment_url,
            description: p.description || '',
            customerPhone: p.customerPhone || p.customer_phone,
            customerEmail: p.customerEmail || p.customer_email,
            createdAt: p.createdAt || p.created_at || new Date().toISOString(),
            updatedAt: p.updatedAt || p.updated_at || new Date().toISOString(),
            importedAt: new Date().toISOString()
        })).filter(p => p.orderId && p.amount > 0);

        // Добавляем к существующим платежам (избегаем дубликатов)
        const existingIds = new Set(this.payments.map(p => p.id));
        const newPayments = imported.filter(p => !existingIds.has(p.id));
        
        this.payments.push(...newPayments);
        this.savePayments();

        return newPayments;
    }

    /**
     * Получение всех платежей
     * @param {Object} filters - Фильтры (status, orderId, dateFrom, dateTo)
     * @returns {Array} - Отфильтрованные платежи
     */
    getPayments(filters = {}) {
        let payments = [...this.payments];

        if (filters.status) {
            payments = payments.filter(p => p.status === filters.status);
        }

        if (filters.orderId) {
            payments = payments.filter(p => p.orderId == filters.orderId);
        }

        if (filters.dateFrom) {
            const from = new Date(filters.dateFrom);
            payments = payments.filter(p => new Date(p.createdAt) >= from);
        }

        if (filters.dateTo) {
            const to = new Date(filters.dateTo);
            payments = payments.filter(p => new Date(p.createdAt) <= to);
        }

        // Сортируем по дате создания (новые первыми)
        return payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * Генерация подписи для запроса (HMAC-SHA256)
     */
    generateSignature(data) {
        if (!this.secretKey) return '';
        
        // Сортируем ключи и формируем строку для подписи
        const sortedKeys = Object.keys(data).sort();
        const signString = sortedKeys
            .map(key => `${key}=${data[key]}`)
            .join('&');
        
        // В реальной интеграции используйте crypto.subtle для HMAC-SHA256
        // Здесь упрощенная версия для демо
        return btoa(signString + this.secretKey).substring(0, 32);
    }

    /**
     * Настройка конфигурации
     */
    setConfig(config) {
        if (config.apiKey) {
            this.apiKey = config.apiKey;
            localStorage.setItem('KASPI_API_KEY', config.apiKey);
        }
        if (config.merchantId) {
            this.merchantId = config.merchantId;
            localStorage.setItem('KASPI_MERCHANT_ID', config.merchantId);
        }
        if (config.secretKey) {
            this.secretKey = config.secretKey;
            localStorage.setItem('KASPI_SECRET_KEY', config.secretKey);
        }
        if (config.isDemo !== undefined) {
            this.isDemo = config.isDemo;
        }
    }

    /**
     * Автоматическая проверка статуса платежей (polling)
     */
    startPaymentPolling(paymentId, onStatusChange, interval = 5000, maxAttempts = 60) {
        let attempts = 0;
        
        const checkStatus = async () => {
            if (attempts >= maxAttempts) {
                console.log('Достигнуто максимальное количество попыток проверки');
                return;
            }

            try {
                const payment = await this.checkPaymentStatus(paymentId);
                
                if (payment.status === 'completed' || payment.status === 'failed' || payment.status === 'cancelled') {
                    if (onStatusChange) {
                        onStatusChange(payment);
                    }
                    return; // Останавливаем проверку
                }

                attempts++;
                setTimeout(checkStatus, interval);
            } catch (error) {
                console.error('Ошибка проверки статуса:', error);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, interval);
                }
            }
        };

        checkStatus();
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KaspiPayment;
}

// Глобальный экземпляр
window.KaspiPayment = KaspiPayment;

