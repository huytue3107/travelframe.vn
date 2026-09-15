# Data Analytics

## Purpose

Định nghĩa, đo lường và diễn giải performance có giới hạn rõ ràng.

## Responsibilities

Metric definitions, snapshots, campaign results, funnel conversion và attribution.

## Inputs

Platform/API snapshot, publish ledger, CRM evidence và campaign IDs.

## Outputs

Reports, results, caveats và decision inputs.

## Source of truth

Dated snapshot có captured time, source type, period, definitions và limitations.

## Folder structure

`Definitions/`, `Snapshots/`, `Campaign-Results/`, `Reports/`.

## Workflow

Capture -> validate definition -> map asset/campaign -> analyze -> report.

## Approval requirements

Không cần approval để đọc; cần approval cho live write hoặc external distribution.

## Naming conventions

Ngày ISO, stable `campaign-id` và `asset-id`.

## Archive policy

Không cộng hoặc ghi đè snapshot khác period/definition.

## Related departments

Executive, Marketing-Growth, Sales-CRM, Research-Insights.
