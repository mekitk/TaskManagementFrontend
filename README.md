# TaskManagementFrontend

Bu proje, [TaskFlow](https://github.com/mekitk/TaskManagementFrontend) görev yönetim sisteminin frontend arayüzüdür. Next.js, TypeScript ve Redux Toolkit kullanılarak geliştirilmiştir.

## 🚀 Kullanılan Teknolojiler

- Next.js 14
- TypeScript
- Redux Toolkit
- Tailwind CSS
- ShadCN UI
- Axios
- Zustand (eğer varsa)
- React Hook Form

## 📦 Kurulum

Projeyi klonladıktan sonra:

```bash
npm install


## 🏗️ Proje Mimarisi

Bu proje, modern frontend mimarisiyle yapılandırılmıştır. Ana yapı aşağıdaki gibidir:

/app # Next.js 14 App Router yapısı
/projects # Projelerle ilgili sayfalar ve bileşenler
/tasks # Görevlerle ilgili sayfalar ve alt sayfalar
/auth # Giriş/çıkış sayfaları
/dashboard # Ana yönetim paneli
layout.tsx # Ortak layout (Sidebar, Header vs.)
page.tsx # Ana yönlendirme sayfası

/components # Tekrar kullanılabilir UI bileşenleri
/layout # Sidebar, Navbar gibi genel yapılar
/projects # Proje kartları ve proje UI parçaları
/tasks # Görev kartları, form bileşenleri
/ui # Tailwind + shadcn-ui bileşenleri (Button, Dialog vs.)

/store # Redux Toolkit yapılandırması
/slices # projectsSlice.ts, tasksSlice.ts, authSlice.ts
store.ts # Root store konfigürasyonu

/types # Global TypeScript tip tanımları (Project, Task, User vs.)

/lib # API helper'ları, tarih/saat işlemleri, formatlayıcılar
api.ts # Axios temel API fonksiyonları
utils.ts # Yardımcı fonksiyonlar

/constants # Sabit değerler, rol isimleri, durumlar vb.

/middleware # (Eğer varsa) auth middleware veya yönlendirme kontrolü

/public # Statik dosyalar (resimler, favicon vs.)

/styles # Global stil dosyaları (genelde Tailwind ile sınırlı)

/env.local # Ortam değişkenleri (backend URL vs.)



---

## 🧱 Katmanlar Arası Ayrım

- **UI Katmanı (`/components`)**: Görsel ve kullanıcıyla etkileşim sağlayan bileşenler burada.
- **State Yönetimi (`/store`)**: Uygulama genelindeki veriler (projeler, görevler, kullanıcı bilgisi) burada saklanır.
- **Sayfalar (`/app`)**: Next.js App Router ile yönlendirme yapılır. Her klasör bir route’tur.
- **API ve Yardımcı Katman (`/lib`)**: Backend API istekleri ve tekrarlayan işlemler burada tanımlıdır.

---

## Örnek Kullanım Akışı (Kısaca Açıklama)

1. Kullanıcı giriş yapar → token Redux ve localStorage'a yazılır.
2. Proje sayfası yüklendiğinde, Redux slice API'den veri çeker.
3. Kullanıcı yeni görev ekler → form bileşeni `POST` isteği yapar → Redux slice güncellenir → UI anlık olarak güncellenir.

---



