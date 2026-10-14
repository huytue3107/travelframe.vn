# HƯỚNG DẪN THỰC THI: LÀM SẠCH DỮ LIỆU GA4 & XỬ LÝ LỖI KỸ THUẬT WEBSITE
*Mã tài liệu: `RBK-20261013-TRAFFIC-HYGIENE` · Owner: Technology-Automation & Data-Analytics*  
*Áp dụng: Website `travelframe.sidevn.com` & Google Analytics 4 Property `552867189`*

---

## 1. XỬ LÝ LỖI 404 FILE PDF & CHUYỂN HƯỚNG URL (P0 & P1)

### A. File PDF Cẩm Nang Du Lịch (`/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf`)
* **Hiện trạng:** Đã có 25 lượt truy cập bị trả về HTTP 404 do file chưa được đưa lên thư mục web public.
* **Cách xử lý 1 (Khuyên dùng - Đưa file thật lên host):**
  * File nguồn đã có sẵn trong repo tại: `Creative-Production/Deliverables/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` (5,6 MB).
  * Upload file này vào thư mục web public của Drupal: `public_html/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` (tạo thư mục `guides/` nếu chưa có).
* **Cách xử lý 2 (Cấu hình Chuyển hướng 301 Redirect trong Drupal hoặc .htaccess):**
  * Trong Drupal: Cài đặt hoặc dùng module **Redirect** (`/admin/config/search/redirect`):
    * **From:** `guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf`
    * **To:** `/news/hanoi-photographer-tour-guide`
    * **Status:** `301 Moved Permanently`
  * Hoặc trong file `.htaccess` (LiteSpeed / Apache):
    ```apache
    Redirect 301 /guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf /news/hanoi-photographer-tour-guide
    ```

### B. Redirect URL gõ sai `/ebook` sang `/ebooks`
* Thêm rule 301 trong Drupal Redirect hoặc `.htaccess`:
  ```apache
  Redirect 301 /ebook /ebooks
  ```

### C. Redirect URL hệ thống `/node`, `/home`, `/index.php`
* Chuẩn hóa URL về trang chủ `/`:
  ```apache
  Redirect 301 /home /
  Redirect 301 /index.php /
  ```

---

## 2. CHẶN TRAFFIC QUẢN TRỊ TRONG DRUPAL & GTM (T1 & T2)

* **Mục tiêu:** Không kích hoạt Google Tag Manager (`GTM-MKLJQNBG`) khi admin đăng nhập hoặc truy cập các trang quản trị `/travelframe-admin*`.

### Cách 1: Cấu hình trong Drupal Module "Google Tag" (`/admin/config/services/google-tag`)
1. Vào phần cấu hình Container `GTM-MKLJQNBG`.
2. Mở tab **Conditions** (Điều kiện kích hoạt):
   * **Pages (Request path):** Chọn *"All pages except the listed pages"* và điền:
     ```text
     /travelframe-admin
     /travelframe-admin/*
     /user
     /user/*
     /login
     ```
   * **User roles:** Bỏ chọn hoặc tích loại trừ role `administrator` và `content editor`.
3. Nhấp **Save configuration**.
4. Xóa cache Drupal (`drush cr` hoặc `/admin/config/development/performance`).

### Cách 2: Cấu hình Exception Trigger trong Google Tag Manager (Dự phòng)
1. Đăng nhập [tagmanager.google.com](https://tagmanager.google.com) với Container `GTM-MKLJQNBG`.
2. Tạo Trigger mới loại **Page View**:
   * Tên: `Exceptions - Admin and Login Pages`
   * Kiểu: `Page View`
   * Kích hoạt trên: `Some Page Views` -> `Page Path` match RegEx `^/(travelframe-admin|login|user)`.
3. Mở Tag `Google Analytics 4 Configuration / Google Tag`.
4. Kéo xuống phần **Exceptions** (Ngoại lệ), thêm trigger vừa tạo.
5. Xuất bản phiên bản GTM mới (Submit & Publish).

---

## 3. CẤU HÌNH LÀM SẠCH DỮ LIỆU TRÊN GOOGLE ANALYTICS 4 (T3, T4, T5)

* **Áp dụng:** GA4 Property ID `552867189` ([analytics.google.com](https://analytics.google.com))

### Bước 1: Loại trừ Referral từ Tag Assistant (T5)
1. Vào **Admin** (biểu tượng bánh răng) -> **Data Streams** -> Nhấp vào Web Stream của TravelFrame.
2. Cuộn xuống chọn **Configure tag settings** (Cấu hình cài đặt thẻ).
3. Nhấp **Show more** -> Chọn **List unwanted referrals** (Liệt kê lượt giới thiệu không mong muốn).
4. Thêm điều kiện:
   * Match type: `Referral domain contains`
   * Value: `tagassistant.google.com`
5. Nhấp **Save**.

### Bước 2: Khai báo IP Nội bộ (Internal Traffic) (T3)
1. Trong màn hình **Configure tag settings**, nhấp **Define internal traffic** (Xác định lưu lượng truy cập nội bộ).
2. Nhấp **Create**:
   * Rule name: `TravelFrame Office / Admin IP`
   * `traffic_type`: `internal`
   * IP addresses: Chọn `IP address equals` và điền IP mạng văn phòng/nhà.
3. Nhấp **Create**.

### Bước 3: Bật Data Filters ở chế độ Testing (T4)
1. Quay lại menu **Admin** của Property -> Chọn **Data Settings** -> **Data Filters**.
2. Kiểm tra bộ lọc `Internal Traffic`:
   * Chuyển trạng thái từ *Inactive* sang **Testing**.
3. Tạo thêm bộ lọc mới cho `Developer Traffic`:
   * Nhấp **Create Filter** -> Chọn **Developer Traffic**.
   * Name: `Developer Traffic`
   * Filter state: **Testing**.
4. Theo dõi trong 48 giờ. Sau khi xác nhận không còn phiên rác từ Tag Assistant và Admin mà không ảnh hưởng traffic khách thật, chuyển trạng thái sang **Active**.

---

## 4. CẬP NHẬT ROBOTS.TXT (T6)

* Bổ sung vào file `robots.txt` trên root web server:
  ```text
  User-agent: *
  Disallow: /travelframe-admin/
  Disallow: /login
  Disallow: /user/
  Allow: /

  Sitemap: https://travelframe.sidevn.com/sitemap.xml
  ```
