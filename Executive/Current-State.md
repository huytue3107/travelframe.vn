# TravelFrame Current State

**Snapshot date:** 2026-09-15

## Approved

- Company OS dùng folder English, không đánh số.
- Side Agency vault tiếp tục là canonical source cho chiến lược TravelFrame.
- Migration chạy theo batch, có checksum, validation và rollback.
- Agent mặc định có quyền Read, Draft và Review.
- Hệ thống Agent Skills (27 skills, manifest, validator, sync mirror và 9 department guides) đã hoàn tất và Active theo batch `MIG-20260915-SKILLS-PHASE1`.

## Working

- TravelFrame là consumer-facing workstream thuộc Hanoi Expert.
- Instagram DM là primary conversion path đang được ưu tiên trong kế hoạch 30 ngày.
- Content engine tập trung Hanoi/Vietnam utility, local discovery và photography.

## Open P0

- Brand architecture cuối cùng.
- Product ladder và package chính thức.
- Pricing.
- Delivery SLA.
- Legal operating model.

## Open P1

- Persona launch chính.
- Package duration và capacity.
- Calendar master.
- ManyChat value-first hay follower-gated.
- Publish status của render hiện có.
- Lead magnet fulfillment.

## Known proof gaps

- Chưa có booking count và revenue attribution đủ bằng chứng.
- Chưa có verified testimonial/consent register hoàn chỉnh.
- Render không mặc định là published.
- Giá, access, visa, weather và transport facts phải re-check gần ngày publish.

## Workspace migration

Đang chuyển từ legacy layout sang Company OS theo
`Operations/Migrations/`. Không dùng tên folder để suy luận approval status.
