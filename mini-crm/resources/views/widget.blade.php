<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Обратная связь</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .widget-card {
            max-width: 500px;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
        .widget-card .card-header {
            background: #0d6efd;
            color: #fff;
            border-radius: 12px 12px 0 0;
            text-align: center;
            padding: 20px;
        }
        .widget-card .card-header h4 {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="card widget-card">
        <div class="card-header">
            <h4>Обратная связь</h4>
            <small>Заполните форму и мы свяжемся с вами</small>
        </div>
        <div class="card-body p-4">
            <div id="alert-container"></div>

            <form id="feedback-form" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="name" class="form-label">Ваше имя <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="name" name="name" required>
                    <div class="invalid-feedback" data-field="name"></div>
                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Телефон (E.164) <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control" id="phone" name="phone" placeholder="+79991234567" required>
                    <div class="invalid-feedback" data-field="phone"></div>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="email" name="email" required>
                    <div class="invalid-feedback" data-field="email"></div>
                </div>

                <div class="mb-3">
                    <label for="subject" class="form-label">Тема <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="subject" name="subject" required>
                    <div class="invalid-feedback" data-field="subject"></div>
                </div>

                <div class="mb-3">
                    <label for="body" class="form-label">Сообщение <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="body" name="body" rows="4" required></textarea>
                    <div class="invalid-feedback" data-field="body"></div>
                </div>

                <div class="mb-3">
                    <label for="files" class="form-label">Прикрепить файлы</label>
                    <input type="file" class="form-control" id="files" name="files[]" multiple>
                    <div class="form-text">Максимум 5 файлов, до 10 МБ каждый</div>
                </div>

                <button type="submit" class="btn btn-primary w-100" id="submit-btn">
                    Отправить заявку
                </button>
            </form>
        </div>
    </div>

    <script>
        document.getElementById('feedback-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const btn = document.getElementById('submit-btn');
            const alertContainer = document.getElementById('alert-container');
            btn.disabled = true;
            btn.textContent = 'Отправка...';
            alertContainer.innerHTML = '';

            // Clear previous errors
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

            const formData = new FormData(this);

            try {
                const response = await fetch('/api/tickets', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    alertContainer.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show">
                            ${data.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>`;
                    this.reset();
                } else if (response.status === 422) {
                    const errors = data.errors || {};
                    for (const [field, messages] of Object.entries(errors)) {
                        const input = document.querySelector(`[name="${field}"]`);
                        if (input) {
                            input.classList.add('is-invalid');
                            const feedback = document.querySelector(`[data-field="${field}"]`);
                            if (feedback) {
                                feedback.textContent = messages[0];
                            }
                        }
                    }
                    alertContainer.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show">
                            Пожалуйста, исправьте ошибки в форме.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>`;
                } else if (response.status === 429) {
                    alertContainer.innerHTML = `
                        <div class="alert alert-warning alert-dismissible fade show">
                            ${data.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>`;
                } else {
                    throw new Error(data.message || 'Произошла ошибка');
                }
            } catch (error) {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show">
                        Ошибка при отправке формы. Попробуйте позже.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>`;
            } finally {
                btn.disabled = false;
                btn.textContent = 'Отправить заявку';
            }
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
