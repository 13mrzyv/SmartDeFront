# SmartDe Frontend

SmartDe backend API üçün React, Vite və Tailwind CSS ilə hazırlanmış idarəetmə paneli.

## Başlatmaq

1. Backend-in PostgreSQL ilə işlədiyinə əmin olun. API-nin HTTP ünvanı standart olaraq `http://localhost:41664`-dür.
2. Bu qovluqda `.env.example` faylını `.env` adı ilə kopyalayın. Lazım gələrsə `VITE_API_BASE_URL` dəyərini API ünvanınıza dəyişin.
3. Asılılıqları quraşdırıb development serverini başladın:

   ```powershell
   npm install
   npm run dev
   ```

4. Production build:

   ```powershell
   npm run build
   ```

## Səhifələr və inteqrasiya olunan API-lər

- İdarə paneli: `GET /api/products`, `GET /api/orders`, `GET /api/campaigns` əsasında canlı saylar və xülasə.
- Məhsullar: `GET`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`.
- Sifarişlər: `GET`, `POST /api/orders`, `PUT /api/orders/{id}`, `DELETE /api/orders/{id}`.
- Kampaniyalar: `GET`, `POST /api/campaigns`, `PUT /api/campaigns/{id}`, `DELETE /api/campaigns/{id}`.

Backend-də authentication yoxdur, buna görə login əlavə edilməyib. `Get by ID` endpoint-ləri CRUD siyahı axını üçün tələb olunmadığından ayrıca çağırılmır.

## CORS

Backend-də `Frontend:Origin` dəyəri CORS üçün istifadə olunur; lokal development-da standartı `http://localhost:5173`-dür. Production-da API üçün `Frontend__Origin` mühit dəyişəni ilə konkret frontend domenini verin. Wildcard origin istifadə etməyin. Eyni origin reverse proxy arxasında yerləşdirməklə də CORS ehtiyacını aradan qaldırmaq olar.
