# TravelFrame Website Conversion Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Giảm ma sát và tăng độ tin cậy của hành trình từ trang tour tới yêu cầu đặt tour, đồng thời sửa các thông tin mâu thuẫn về liên hệ, giá, gói hình ảnh và social proof trên website TravelFrame.

**Architecture:** Giữ Drupal 11 và custom theme hiện tại. Tách dữ liệu thương mại, thông tin liên hệ và phép tính giá khỏi template; server là nguồn tính giá cuối cùng, client chỉ hiển thị estimate. Mọi thay đổi được triển khai trên staging, theo dõi bằng GA4/GTM, sau đó mới phát hành có rollback.

**Tech Stack:** Drupal 11, PHP 8.3, Twig, JavaScript, CSS, PHPUnit/Drupal Test Framework, Playwright, GA4/GTM, LiteSpeed.

---

## 1. Trạng thái đã xác minh

**Ngày kiểm tra:** 2026-09-19

- Website live đang chạy Drupal 11 với custom theme `travelframe`.
- `/booking` đang yêu cầu tên và số điện thoại trước khi cho xem package và estimate.
- Step đầu tiên gọi `/api/customers/continue`, nên lead được tạo trước khi khách xem giá.
- CTA từ trang tour đi tới `/booking` nhưng không truyền tour context.
- Estimate phía client cộng giá tour và giá visual theo giờ nhưng chưa thể hiện quy tắc nhân theo số khách một cách nhất quán.
- Trang tour nói photo/video đã bao gồm, trong khi booking yêu cầu chọn visual package riêng.
- Contact/footer/booking đang sử dụng nhiều email, số điện thoại và mô tả địa điểm khác nhau.
- Website chưa có hành động WhatsApp hoặc Instagram DM nổi bật.
- Claim “250+ reviews” và testimonial hiện tại chưa có nguồn chứng minh được lưu trong workspace.
- GA4 snapshot hiện tại có lượng traffic thấp và lẫn internal/debug traffic; chưa đủ cơ sở để khẳng định tỷ lệ rơi rụng 80–90%.
- Workspace Company OS hiện tại không chứa Drupal source code hoặc quy trình deploy website.

## 2. Phạm vi và nguyên tắc

### Trong phạm vi

- Handoff source code và staging.
- Chuẩn hóa thông tin liên hệ.
- CTA WhatsApp/Instagram.
- Tour context từ tour detail sang booking.
- Thiết kế lại thứ tự booking.
- Một công thức giá thống nhất ở server và client.
- Social proof có nguồn.
- GA4/GTM funnel tracking.
- QA responsive, accessibility, functional và regression.
- Staging release, production release và rollback.

### Ngoài phạm vi

- Rebrand toàn bộ website.
- Thay CMS hoặc rebuild frontend.
- Cổng thanh toán online.
- CRM migration.
- Công khai giá hoặc SLA chưa được Rocky phê duyệt.
- Tạo review, số lượng review hoặc ảnh khách không có bằng chứng/consent.

### Quy tắc quyết định

- Không sửa live trước khi staging pass.
- Không tự chọn product ladder, giá, SLA, cancellation policy hoặc contact details.
- Không gửi booking giả trên production.
- Không hardcode dữ liệu thương mại vào Twig/JavaScript nếu dữ liệu đó đã hoặc nên được quản lý trong Drupal config.
- Server phải tính lại tổng tiền; không tin `displayedTotal` từ browser.
- Nếu source map thực tế khác các đường dẫn dự kiến bên dưới, dừng và cập nhật plan trước khi code.

## 3. Các approval bắt buộc

| Gate | Chủ sở hữu | Điều kiện pass |
|---|---|---|
| G0 Source handoff | Website owner/developer | Có source hiện hành, database/config cần thiết, staging URL và deploy/rollback instructions |
| G1 Commercial model | Rocky | Chốt tour price là per-person hay per-group; visual deliverable nào đã bao gồm; upgrade/add-on nào tính thêm |
| G2 Public contact | Rocky | Chốt WhatsApp, email, Instagram URL, office/pickup wording |
| G3 Trust evidence | Rocky/Content | Có review source URL, tên hiển thị được phép dùng, ảnh có consent, claim được kiểm chứng |
| G4 Release | Rocky | Staging review được duyệt và production window được xác nhận |

## 4. Cấu trúc file mục tiêu

### Company OS

- `Operations/Change-Management/2026-09-19-travelframe-website-conversion-recovery-implementation-plan.md`
- `Operations/Change-Management/Website-Release-Runbook.md`
- `Brand-Strategy/Offers-Pricing/Website-Commercial-Model-Approval.md`
- `Brand-Strategy/Contact/Website-Public-Contact-Approval.md`
- `Content-Creative/Proof-Library/Website-Review-Evidence-Register.md`
- `Data-Analytics/Measurement-Framework.md`
- `Data-Analytics/Metric-Definitions.md`

### Drupal source checkout

Quy ước root dùng trong plan:

```bash
COMPANY_OS_ROOT="$(git rev-parse --show-toplevel)"
WEB_ROOT="$(cd "$COMPANY_OS_ROOT/.." && pwd)/travelframe-web"
```

Drupal source được checkout ở thư mục sibling `../travelframe-web`.

Các đường dẫn dưới đây dựa trên cấu trúc Drupal chuẩn và tên asset live. Task 1 phải xác nhận chính xác trước khi Task 2 bắt đầu:

- `docs/website-source-map.md`
- `web/themes/custom/travelframe/templates/layout/page.html.twig`
- `web/themes/custom/travelframe/templates/content/tour-detail.html.twig`
- `web/themes/custom/travelframe/templates/page/page--booking.html.twig`
- `web/themes/custom/travelframe/js/booking-configurator.js`
- `web/themes/custom/travelframe/js/conversion-tracking.js`
- `web/themes/custom/travelframe/css/components/conversion-actions.css`
- `web/themes/custom/travelframe/travelframe.libraries.yml`
- `web/themes/custom/travelframe/travelframe.theme`
- `web/modules/custom/travelframe_booking/travelframe_booking.routing.yml`
- `web/modules/custom/travelframe_booking/src/Controller/BookingPageController.php`
- `web/modules/custom/travelframe_booking/src/Controller/BookingApiController.php`
- `web/modules/custom/travelframe_booking/src/Service/BookingEstimator.php`
- `web/modules/custom/travelframe_booking/tests/src/Kernel/BookingEstimatorTest.php`
- `web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php`
- `tests/playwright/booking-flow.spec.ts`
- `tests/playwright/contact-consistency.spec.ts`

---

## Task 0: Hoàn tất source, staging và approval handoff

**Files:**

- Create: `$COMPANY_OS_ROOT/Operations/Change-Management/Website-Release-Runbook.md`
- Create: `$COMPANY_OS_ROOT/Brand-Strategy/Offers-Pricing/Website-Commercial-Model-Approval.md`
- Create: `$COMPANY_OS_ROOT/Brand-Strategy/Contact/Website-Public-Contact-Approval.md`
- Create: `$COMPANY_OS_ROOT/Content-Creative/Proof-Library/Website-Review-Evidence-Register.md`

### Step 1: Nhận source hiện hành

- [ ] Yêu cầu website owner/developer cung cấp checkout của đúng phiên bản đang chạy live vào:

```text
$WEB_ROOT
```

- [ ] Nhận kèm version PHP/Composer, Drupal config export, database snapshot đã làm sạch dữ liệu nhạy cảm và asset cần để dựng staging.
- [ ] Ghi commit SHA hoặc release identifier đang chạy production vào release runbook.

**Expected:** Source có lịch sử Git, không phải file copy không rõ phiên bản.

### Step 2: Ghi quy trình staging/deploy/rollback

- [ ] Ghi các lệnh cài đặt, config import, cache clear, database update, deploy và rollback thực tế vào `Website-Release-Runbook.md`.
- [ ] Ghi rõ người có quyền production, cách backup database/files và thời gian rollback mục tiêu.
- [ ] Xác nhận staging không gửi email, SMS, webhook hoặc CRM lead thật.

**Expected:** Một người khác có thể dựng staging và rollback chỉ bằng runbook.

### Step 3: Chốt commercial model

- [ ] Rocky chọn một mô hình duy nhất và ký trạng thái `approved` trong `Website-Commercial-Model-Approval.md`.
- [ ] Khuyến nghị để review: tour bao gồm một standard visual deliverable; visual package cao hơn là optional upgrade.
- [ ] Chốt rõ tour price là `per-person` hay `per-group`.
- [ ] Chốt guest multiplier, visual upgrade formula, add-on formula, currency và rounding.
- [ ] Chốt delivery SLA, cancellation wording và deposit/payment expectation.

**Expected:** Không còn trường hợp tour page nói “included” nhưng booking lại cộng cùng hạng mục lần hai.

### Step 4: Chốt public contact

- [ ] Ghi một WhatsApp number, một public email, Instagram URL và office/pickup wording trong `Website-Public-Contact-Approval.md`.
- [ ] Xác nhận số điện thoại nhận được WhatsApp từ khách quốc tế.
- [ ] Xác nhận Hoàng Cầu là office, meeting point hay chỉ là registered address.

### Step 5: Chuẩn bị review evidence

- [ ] Với mỗi review được phép dùng, ghi source URL/platform, tên hiển thị, ngày, quote được duyệt và trạng thái consent.
- [ ] Không duyệt claim số lượng review nếu không có nguồn public kiểm chứng.
- [ ] Review chưa có bằng chứng phải được đánh dấu `do_not_publish`.

### Step 6: Gate check

```bash
COMPANY_OS_ROOT="$(git rev-parse --show-toplevel)"
WEB_ROOT="$(cd "$COMPANY_OS_ROOT/.." && pwd)/travelframe-web"
test -d "$WEB_ROOT/.git"
test -f "$COMPANY_OS_ROOT/Operations/Change-Management/Website-Release-Runbook.md"
test -f "$COMPANY_OS_ROOT/Brand-Strategy/Offers-Pricing/Website-Commercial-Model-Approval.md"
test -f "$COMPANY_OS_ROOT/Brand-Strategy/Contact/Website-Public-Contact-Approval.md"
```

**Expected:** Tất cả lệnh trả về exit code `0`.

**Stop condition:** Không bắt đầu Task 1 nếu G0, G1 và G2 chưa pass.

**Commit:**

```bash
git add Operations/Change-Management/Website-Release-Runbook.md \
  Brand-Strategy/Offers-Pricing/Website-Commercial-Model-Approval.md \
  Brand-Strategy/Contact/Website-Public-Contact-Approval.md \
  Content-Creative/Proof-Library/Website-Review-Evidence-Register.md
git commit -m "docs: approve website conversion recovery inputs"
```

---

## Task 1: Dựng staging và map source thật

**Files:**

- Create: `$WEB_ROOT/docs/website-source-map.md`
- Verify: `$WEB_ROOT/web/themes/custom/travelframe/`
- Verify: `$WEB_ROOT/web/modules/custom/travelframe_booking/`

### Step 1: Cài dependency và dựng local/staging

- [ ] Chạy đúng lệnh từ release runbook.
- [ ] Import config/database theo quy trình đã nhận.
- [ ] Tắt outbound integration trên staging.
- [ ] Xác nhận `/`, `/tours`, một tour detail, `/booking`, `/contact` trả về HTTP 200.

### Step 2: Map theme và module ownership

```bash
cd "$WEB_ROOT"
rg -n "travelframeBookingConfigurator|booking_step_view|customers/continue|api/bookings" .
rg -n "250\\+ reviews|Photo & video package included|912 345 678|admin@side-agency.com" .
rg -n "data-config|visualPackages|tourPackages|guestCount|displayedTotal" .
```

- [ ] Ghi file chịu trách nhiệm cho booking page, booking JS, pricing data, booking API, footer, contact page, tour detail và analytics vào `docs/website-source-map.md`.
- [ ] Ghi route/controller/service thực tế cho ba endpoint booking.
- [ ] Ghi nơi Drupal quản lý contact settings và package catalog.

**Expected:** Mỗi issue trong audit có một owner file/module cụ thể.

### Step 3: So sánh source với live

- [ ] Build staging từ source.
- [ ] So sánh title, package names, booking step labels và API routes với live.
- [ ] Nếu source khác live, dừng và nhận đúng release source trước khi tiếp tục.

### Step 4: Khóa đường dẫn thực thi

- [ ] Nếu custom module không tên `travelframe_booking`, cập nhật toàn bộ đường dẫn Task 2–8 trong plan này theo source map.
- [ ] Không bắt đầu code khi plan và source map chưa đồng nhất.

**Commit:**

```bash
git add docs/website-source-map.md
git commit -m "docs: map TravelFrame Drupal website source"
```

---

## Task 2: Viết test bảo vệ công thức giá

**Files:**

- Create: `$WEB_ROOT/web/modules/custom/travelframe_booking/src/Service/BookingEstimator.php`
- Create: `$WEB_ROOT/web/modules/custom/travelframe_booking/tests/src/Kernel/BookingEstimatorTest.php`
- Modify: controller/API files được xác nhận trong `docs/website-source-map.md`

### Step 1: Viết test fail cho commercial model đã duyệt

- [ ] Tạo test case cho một khách, nhiều khách, không upgrade, có visual upgrade và có add-on.
- [ ] Tạo test khẳng định standard visual đã bao gồm không bị cộng lần hai.
- [ ] Tạo test khẳng định server bỏ qua total do client gửi lên.

Ví dụ cấu trúc test:

```php
public function testPerPersonTourWithOptionalVisualUpgrade(): void {
  $quote = $this->estimator->estimate([
    'tour_unit_price' => 25000,
    'guest_count' => 2,
    'included_visual_price' => 0,
    'visual_upgrade_price' => 5000,
    'addons' => [3000],
  ]);

  $this->assertSame(58000, $quote->total());
  $this->assertSame([
    'tour' => 50000,
    'visual_upgrade' => 5000,
    'addons' => 3000,
  ], $quote->breakdown());
}
```

Giá trị test phải được thay bằng fixture tương ứng với commercial model đã approved, không lấy số ví dụ trên làm giá live.

### Step 2: Chạy test và xác nhận fail

```bash
cd "$WEB_ROOT"
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Kernel/BookingEstimatorTest.php
```

**Expected:** FAIL vì estimator chưa tồn tại hoặc chưa đáp ứng công thức.

### Step 3: Implement estimator phía server

- [ ] Chuyển toàn bộ quy tắc giá vào `BookingEstimator`.
- [ ] Trả về `currency`, `total`, `breakdown`, `pricing_model_version`.
- [ ] Validate guest count và ID package phía server.
- [ ] Dùng integer minor units hoặc decimal-safe money type; không tính tiền bằng float.

### Step 4: Dùng estimator trong booking API

- [ ] API nhận lựa chọn, lookup catalog ở server và tự tính lại quote.
- [ ] Không nhận unit price từ request.
- [ ] Booking record lưu `pricing_model_version` và breakdown.
- [ ] Client total chỉ dùng để phát hiện mismatch, không phải nguồn chính thức.

### Step 5: Chạy test pass

```bash
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Kernel/BookingEstimatorTest.php
```

**Expected:** PASS.

**Commit:**

```bash
git add web/modules/custom/travelframe_booking
git commit -m "feat: centralize booking price calculation"
```

---

## Task 3: Truyền tour context và hiển thị giá trước contact

**Files:**

- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/content/tour-detail.html.twig`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/page/page--booking.html.twig`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/js/booking-configurator.js`
- Modify: `$WEB_ROOT/web/modules/custom/travelframe_booking/src/Controller/BookingPageController.php`
- Create: `$WEB_ROOT/web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php`

### Step 1: Viết functional test fail

- [ ] GET tour detail phải có CTA dạng `/booking?tour=<canonical-slug>`.
- [ ] GET `/booking?tour=<slug>` phải preselect đúng tour.
- [ ] Booking page phải hiển thị package và starting estimate khi chưa có name/phone.
- [ ] UTM hợp lệ từ tour CTA phải được bảo toàn.
- [ ] Slug không hợp lệ phải fallback an toàn, không gây 500.

```bash
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php
```

**Expected:** FAIL với flow hiện tại.

### Step 2: Cập nhật CTA tour

- [ ] Generate URL bằng Drupal URL API, không nối chuỗi thủ công.
- [ ] Dùng canonical slug hoặc entity ID đã được source map xác nhận.
- [ ] Gửi `tour_slug` và `source_page` sang tracking layer.

### Step 3: Preselect tour trên booking

- [ ] Controller validate query parameter với catalog hiện hành.
- [ ] Truyền selected tour vào render array/data config.
- [ ] Booking UI hiển thị tour name, duration, included deliverable và starting price ngay trên màn đầu.

### Step 4: Trì hoãn tạo lead

- [ ] Bỏ call `/api/customers/continue` khỏi màn package/estimate.
- [ ] Chỉ tạo/update customer khi khách tới contact step và chủ động tiếp tục, hoặc khi submit cuối.
- [ ] Lưu lựa chọn trước contact trong `sessionStorage` với schema version và expiry.
- [ ] Không lưu dữ liệu cá nhân vào `localStorage`.

### Step 5: Chạy test

```bash
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php
```

**Expected:** PASS.

**Commit:**

```bash
git add web/themes/custom/travelframe \
  web/modules/custom/travelframe_booking
git commit -m "feat: preserve tour context in booking"
```

---

## Task 4: Refactor booking thành flow bốn bước ít ma sát

**Files:**

- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/page/page--booking.html.twig`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/js/booking-configurator.js`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/css/components/conversion-actions.css`
- Modify: `$WEB_ROOT/web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php`

### Step 1: Khóa information architecture

Flow mục tiêu:

1. `Tour & price` — tour preselected, package/deliverable, starting estimate.
2. `Your trip` — date, guest count, optional upgrade/add-ons.
3. `Stay in touch` — name và một kênh bắt buộc: WhatsApp phone hoặc email.
4. `Review & request` — breakdown, terms, submit.

- [ ] Không yêu cầu contact trước khi khách nhìn thấy offer và estimate.
- [ ] Không dùng tên package mơ hồ nếu G1 đã phê duyệt tên mới.
- [ ] Mỗi bước có Back/Continue rõ ràng và giữ state.

### Step 2: Viết test UI/validation fail

- [ ] Continue bị chặn khi date/guest không hợp lệ.
- [ ] Contact step chấp nhận phone hoặc email theo rule approved.
- [ ] Review hiển thị cùng total với server quote.
- [ ] Refresh giữ non-PII selection trong phiên.
- [ ] Submit hai lần không tạo booking trùng.

### Step 3: Implement step state machine

- [ ] Tách `renderStep`, `validateStep`, `persistDraft`, `requestQuote`, `submitBooking`.
- [ ] Không cho DOM labels và API state dùng hai naming system khác nhau.
- [ ] Dùng semantic fieldset/legend, error summary và focus management khi đổi step.
- [ ] Disable submit trong lúc request và có trạng thái retry rõ ràng.

### Step 4: Đồng bộ estimate client với server

- [ ] Mỗi thay đổi guest/package/add-on gọi quote endpoint có debounce.
- [ ] Hiển thị breakdown tour, included visual, upgrade, add-on và total.
- [ ] Nếu API lỗi, không hiển thị total cũ như giá chắc chắn; hiển thị trạng thái cần thử lại.
- [ ] Submit luôn dùng quote server mới nhất.

### Step 5: Chạy focused tests

```bash
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Kernel/BookingEstimatorTest.php
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests/src/Functional/BookingFlowTest.php
```

**Expected:** PASS.

**Commit:**

```bash
git add web/themes/custom/travelframe \
  web/modules/custom/travelframe_booking
git commit -m "feat: simplify TravelFrame booking flow"
```

---

## Task 5: Chuẩn hóa contact và thêm WhatsApp/Instagram actions

**Files:**

- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/layout/page.html.twig`
- Modify: contact template được xác nhận trong `docs/website-source-map.md`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/page/page--booking.html.twig`
- Create: `$WEB_ROOT/web/themes/custom/travelframe/js/conversion-tracking.js`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/css/components/conversion-actions.css`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/travelframe.libraries.yml`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/travelframe.theme`
- Create: `$WEB_ROOT/tests/playwright/contact-consistency.spec.ts`

### Step 1: Tạo một nguồn contact config

- [ ] Lưu approved values trong Drupal config, không lặp hardcode ở footer/contact/booking.
- [ ] Expose sanitized values cho Twig qua preprocess hoặc config block.
- [ ] Mọi template đọc cùng một config.

### Step 2: Viết Playwright test fail

```ts
test('public contact details stay consistent', async ({ page }) => {
  await page.goto('/contact');
  const contactEmail = await page.getByTestId('public-email').textContent();
  const contactPhone = await page.getByTestId('public-whatsapp').textContent();

  await page.goto('/booking');
  await expect(page.getByTestId('public-email')).toHaveText(contactEmail!);
  await expect(page.getByTestId('public-whatsapp')).toHaveText(contactPhone!);
});
```

### Step 3: Thêm floating actions

- [ ] Mobile: compact bottom action bar với WhatsApp là primary, Instagram là secondary.
- [ ] Desktop: fixed action group không che cookie banner, form controls hoặc footer.
- [ ] Có accessible name và visible focus.
- [ ] WhatsApp link dùng international number approved và prefilled message ngắn.
- [ ] Instagram link đi đúng profile approved, mở theo hành vi browser chuẩn.

### Step 4: Sửa location wording

- [ ] Nếu Hoàng Cầu là office, dùng “TravelFrame office” và không gọi Old Quarter.
- [ ] Nếu là meeting point, ghi rõ booking confirmation sẽ xác nhận điểm gặp.
- [ ] Không hiển thị hai mô tả địa điểm mâu thuẫn.

### Step 5: Chạy test

```bash
npx playwright test tests/playwright/contact-consistency.spec.ts
```

**Expected:** PASS trên mobile và desktop projects.

**Commit:**

```bash
git add web/themes/custom/travelframe tests/playwright/contact-consistency.spec.ts
git commit -m "feat: add consistent WhatsApp and Instagram contact actions"
```

---

## Task 6: Sửa social proof và trust content

**Files:**

- Modify: homepage/tour templates được xác nhận trong `docs/website-source-map.md`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/templates/content/tour-detail.html.twig`
- Read source: `$COMPANY_OS_ROOT/Content-Creative/Proof-Library/Website-Review-Evidence-Register.md`

### Step 1: Gỡ claim chưa chứng minh

- [ ] Xóa “250+ reviews” nếu evidence register không có nguồn xác minh.
- [ ] Gỡ testimonial generic hoặc chuyển về unpublished.
- [ ] Không thay bằng con số khác nếu chưa có evidence.

### Step 2: Render review có nguồn

- [ ] Chỉ publish record có trạng thái `approved_for_website`.
- [ ] Hiển thị platform/source label nếu quyền sử dụng cho phép.
- [ ] Quote phải giữ đúng nghĩa, chỉ chỉnh ngắn khi approval ghi rõ.
- [ ] Ảnh khách chỉ dùng khi consent cho website đã được lưu.

### Step 3: Thêm trust strip trên tour detail

- [ ] Hiển thị included deliverable theo G1.
- [ ] Hiển thị delivery SLA và cancellation summary đã approved.
- [ ] Hiển thị kênh hỗ trợ thật.
- [ ] Link tới chi tiết policy thay vì nhồi toàn bộ vào card.

### Step 4: Content review

- [ ] Content owner kiểm tra tất cả claim định lượng.
- [ ] Rocky duyệt screenshot staging trước release.

**Commit:**

```bash
git add web/themes/custom/travelframe
git commit -m "fix: replace unsupported website trust claims"
```

---

## Task 7: Hoàn thiện GA4/GTM funnel tracking

**Files:**

- Modify: `$WEB_ROOT/web/themes/custom/travelframe/js/conversion-tracking.js`
- Modify: `$WEB_ROOT/web/themes/custom/travelframe/js/booking-configurator.js`
- Modify: `$COMPANY_OS_ROOT/Data-Analytics/Measurement-Framework.md`
- Modify: `$COMPANY_OS_ROOT/Data-Analytics/Metric-Definitions.md`

### Step 1: Giữ và cập nhật step event

- [ ] Giữ `booking_step_view` để không làm đứt chuỗi dữ liệu.
- [ ] Đổi step names thành:
  - `tour_price`
  - `trip_options`
  - `contact`
  - `review_request`
- [ ] Thêm `flow_version: "2026-09-conversion-recovery"`.

### Step 2: Thêm event

| Event | Trigger | Parameters bắt buộc |
|---|---|---|
| `view_tour` | Tour detail view | `tour_slug`, `displayed_price`, `currency` |
| `begin_booking` | CTA hoặc booking step 1 | `tour_slug`, `source_page` |
| `select_package` | Package/upgrade selected | `package_id`, `package_name`, `tour_slug` |
| `view_price_estimate` | Server quote rendered | `amount`, `currency`, `guest_count`, `pricing_model_version` |
| `contact_click` | WhatsApp/Instagram click | `channel`, `placement`, `page_type` |
| `generate_lead` | Contact saved successfully | `channel`, `tour_slug` |
| `booking_request_submit` | Booking accepted | `booking_reference`, `amount`, `currency`, `tour_slug` |

### Step 3: Privacy và data quality

- [ ] Không gửi name, phone, email hoặc free-text message vào GA4.
- [ ] Không dùng raw customer ID làm analytics identifier.
- [ ] Internal/debug traffic phải có filter/segment rõ ràng.
- [ ] Không đánh dấu `generate_lead` trước khi server xác nhận lưu lead.

### Step 4: Sửa measurement docs

- [ ] Đổi route cũ `/book-tour` thành route live `/booking`.
- [ ] Định nghĩa conversion numerator/denominator rõ ràng.
- [ ] Tách external traffic khỏi internal/debug.
- [ ] Ghi rằng baseline hiện tại chưa đủ để khẳng định mức rơi rụng 80–90%.

### Step 5: Verify trong GTM Preview/GA4 DebugView

- [ ] Mỗi action chỉ bắn một event.
- [ ] Back/forward không nhân đôi `generate_lead` hoặc submit.
- [ ] Parameters đúng type và không chứa PII.
- [ ] Screenshot/debug evidence được lưu cùng release notes.

**Commit website source:**

```bash
git add web/themes/custom/travelframe/js
git commit -m "feat: track TravelFrame booking funnel"
```

**Commit Company OS:**

```bash
git add Data-Analytics/Measurement-Framework.md Data-Analytics/Metric-Definitions.md
git commit -m "docs: define website booking funnel metrics"
```

---

## Task 8: Cross-device QA và regression

**Files:**

- Create: `$WEB_ROOT/tests/playwright/booking-flow.spec.ts`
- Modify: `$WEB_ROOT/tests/playwright/contact-consistency.spec.ts`
- Create: `$WEB_ROOT/docs/qa/2026-09-conversion-recovery-qa.md`

### Step 1: Playwright happy-path trên staging

- [ ] Tour CTA mở booking với tour đã chọn.
- [ ] Estimate xuất hiện trước contact.
- [ ] Thay guest count làm total thay đổi đúng commercial model.
- [ ] Upgrade/add-on không double charge.
- [ ] Contact step validate đúng.
- [ ] Review breakdown khớp server quote.
- [ ] Dùng staging mock/sink để test submit, không gửi production lead.

### Step 2: Viewport coverage

Chạy ở:

- [ ] 375 × 812
- [ ] 390 × 844
- [ ] 414 × 896
- [ ] 768 × 1024
- [ ] 1440 × 900

```bash
npx playwright test tests/playwright/booking-flow.spec.ts \
  tests/playwright/contact-consistency.spec.ts
```

### Step 3: Accessibility và UI

- [ ] Keyboard-only hoàn tất được toàn flow.
- [ ] Focus không bị mất khi chuyển step hoặc hiện lỗi.
- [ ] Labels/errors được screen reader nhận diện.
- [ ] Floating actions không che CTA, input, cookie controls hoặc browser safe area.
- [ ] Text không tràn ở package names dài.
- [ ] Contrast đạt WCAG AA cho text và controls chính.

### Step 4: Technical checks

```bash
vendor/bin/phpunit web/modules/custom/travelframe_booking/tests
vendor/bin/phpcs --standard=Drupal,DrupalPractice web/modules/custom/travelframe_booking
vendor/bin/phpstan analyse web/modules/custom/travelframe_booking
npx playwright test
```

- [ ] Không có console error.
- [ ] Không có request 4xx/5xx trong happy-path.
- [ ] Drupal cache rebuild thành công.
- [ ] Config export sạch và review được.
- [ ] LCP/CLS không regression đáng kể so với staging baseline.

### Step 5: Ghi QA evidence

- [ ] Ghi môi trường, commit SHA, browser, viewport và kết quả test vào QA report.
- [ ] Đính kèm screenshot của tour detail, bốn booking steps, contact và mobile floating actions.
- [ ] Liệt kê issue còn lại theo P0/P1/P2; không gọi release-ready nếu còn P0/P1.

**Commit:**

```bash
git add tests/playwright docs/qa
git commit -m "test: cover website conversion recovery flow"
```

---

## Task 9: Staging approval, production release và rollback

**Files:**

- Modify: `$COMPANY_OS_ROOT/Operations/Change-Management/Website-Release-Runbook.md`
- Create: `$COMPANY_OS_ROOT/Operations/Change-Management/2026-09-website-conversion-recovery-release-record.md`

### Step 1: Staging approval

- [ ] Rocky review tour detail, contact, social proof và booking trên mobile/desktop.
- [ ] G1/G2/G3 values trên staging khớp approval docs.
- [ ] G4 được ghi rõ với ngày release và người triển khai.

### Step 2: Pre-release backup

- [ ] Backup database.
- [ ] Backup uploaded files/config theo runbook.
- [ ] Ghi production commit/release identifier hiện tại để rollback.
- [ ] Xác nhận người rollback đang sẵn sàng trong release window.

### Step 3: Deploy

- [ ] Deploy đúng commit đã QA.
- [ ] Chạy database updates/config import theo runbook.
- [ ] Clear Drupal/LiteSpeed cache.
- [ ] Không thay đổi trực tiếp file trên production server ngoài pipeline.

### Step 4: Production sanity check

- [ ] `/`, `/tours`, tour detail, `/booking`, `/contact` trả HTTP 200.
- [ ] Tour context truyền đúng.
- [ ] Estimate hiển thị trước contact.
- [ ] Contact/footer/booking giống nhau.
- [ ] WhatsApp/Instagram links đúng.
- [ ] GA4 event xuất hiện trong Realtime/DebugView.
- [ ] Không submit booking giả; chỉ kiểm tra tới trước hành động submit cuối.

### Step 5: Rollback trigger

Rollback ngay nếu có một trong các điều kiện:

- Booking API 5xx hoặc không tạo được booking thật.
- Total trên UI khác total server.
- Tour/package context sai.
- Contact action đi sai tài khoản.
- PII xuất hiện trong analytics.
- Layout mobile che form/CTA chính.

### Step 6: Release record

- [ ] Ghi commit SHA, thời gian deploy, migration/config changes, người duyệt, test evidence và rollback result vào release record.
- [ ] Ghi issue phát sinh và owner.

**Commit Company OS:**

```bash
git add Operations/Change-Management/Website-Release-Runbook.md \
  Operations/Change-Management/2026-09-website-conversion-recovery-release-record.md
git commit -m "docs: record website conversion recovery release"
```

---

## Task 10: Đo lường sau phát hành

**Files:**

- Create: `$COMPANY_OS_ROOT/Data-Analytics/Reports/2026-10-website-conversion-recovery-review.md`

### Step 1: Theo dõi 48 giờ đầu

- [ ] Kiểm tra API errors, JS errors, booking requests và contact clicks.
- [ ] Kiểm tra event duplication và missing parameters.
- [ ] So sánh server booking count với GA4 `booking_request_submit`.

### Step 2: Review sau 14 ngày

Đo riêng external traffic:

- [ ] Tour detail → `begin_booking`.
- [ ] `begin_booking` → `view_price_estimate`.
- [ ] Estimate → `generate_lead`.
- [ ] Lead → `booking_request_submit`.
- [ ] WhatsApp/Instagram click-through.
- [ ] Conversion theo device, source và tour.

### Step 3: Kết luận dựa trên sample size

- [ ] Báo cả numerator, denominator và date range.
- [ ] Gắn nhãn directional nếu sample thấp.
- [ ] Không dùng lại claim 80–90% drop nếu funnel data không chứng minh.
- [ ] Tạo backlog P1/P2 dựa trên evidence, không dựa trên cảm giác.

**Commit:**

```bash
git add Data-Analytics/Reports/2026-10-website-conversion-recovery-review.md
git commit -m "docs: review website conversion recovery results"
```

---

## Definition of Done

- [ ] Source và release process được map, có staging và rollback.
- [ ] Commercial model, public contact và trust evidence có approval.
- [ ] Tour CTA giữ đúng tour context.
- [ ] Khách xem offer và estimate trước khi cung cấp contact.
- [ ] Server là nguồn tính giá cuối cùng; guest/package/add-on có automated tests.
- [ ] Không double charge visual deliverable đã bao gồm.
- [ ] Contact details nhất quán trên toàn site.
- [ ] WhatsApp và Instagram actions hoạt động, accessible và được tracking.
- [ ] Claim/review không có bằng chứng đã bị gỡ hoặc thay bằng evidence approved.
- [ ] Funnel events không chứa PII và đã verify trong GA4/GTM.
- [ ] PHPUnit, coding standards, static analysis và Playwright pass.
- [ ] Staging được Rocky duyệt trước production.
- [ ] Production sanity check pass và release record hoàn tất.
- [ ] Báo cáo 14 ngày dùng external traffic và sample size thực tế.

## Thứ tự ưu tiên

1. **Blocker:** Task 0–1.
2. **Revenue-critical:** Task 2–4.
3. **Quick trust wins:** Task 5–6.
4. **Measurement:** Task 7.
5. **Release safety:** Task 8–9.
6. **Learning loop:** Task 10.

## Ước lượng sau khi Gate 0 pass

| Nhóm việc | Effort dự kiến |
|---|---:|
| Source mapping + staging validation | 0.5–1 ngày |
| Pricing service + tests | 1–1.5 ngày |
| Booking context + flow refactor | 2–3 ngày |
| Contact actions + consistency | 0.5–1 ngày |
| Trust content | 0.5–1 ngày, chưa tính thời gian xin consent |
| Analytics implementation | 1 ngày |
| QA + fixes | 1–2 ngày |
| Release + monitoring setup | 0.5 ngày |

**Tổng kỹ thuật dự kiến:** 7–11 ngày làm việc sau khi source, staging và approvals đầy đủ.
