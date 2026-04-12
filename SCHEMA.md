
# Dataset Schemas

This document defines the dataset schemas for the two data sources
integrated by this service. Each table shows how raw API fields map
to dataset fields, what type each field carries, and why it was
included or excluded.




## GitHub Repo 52 Week Commit Activity

**Source:** `GET /repos/{owner}/{repo}/stats/commit_activity` <br>
**Primary keys:** `["repo_name", "week_start", "day_of_week"]`

### Included fields

| Source field          | Dataset field  | Type                         | Rationale |
| -------------------   | -------------- | -----------------------------| --------- |
| (from repo path)      | repo_name      | string                       |           |
| week (unix timestamp) | week_start     | string (ISO 8601)            |           |
| days index            | day_of_week    | string ("Sunday"-"Saturday") |           |
| days[index] value     | daily_commits  | number                       |           |
| (generated)           | fetched_at     | string (ISO 8601)            |           |

### Excluded fields

| Source field | Reason                                                      |
| ------------ | ----------------------------------------------------------- |
| total        | Derivable from daily_commits - created as a metric in Databox |




## NASA Near Earth Objects

**Source:** `GET /neo/rest/v1/feed?start_date=...&end_date=...&api_key=API_KEY`<br>
**Primary keys:** `["neo_id", "approach_date"]`

### Included fields

| Source field                                                 | Dataset field              | Type                | Rationale |
| ------------------------------------------------------------ | -------------------------- | ------------------- | --------- |
| id                                                           | neo_id                     | string              |           |
| name                                                         | name                       | string              |           |
| close_approach_data[0].close_approach_date                   | approach_date              | string (YYYY-MM-DD) |           |
| close_approach_data[0].miss_distance.kilometers              | miss_distance_km           | number              |           |
| close_approach_data[0].miss_distance.lunar                   | miss_distance_lunar        | number              | Included alongside kilometers because lunar distance provides an intuitive scale for near Earth objects and is provided natively by the API. |
| estimated_diameter.meters.estimated_diameter_max             | estimated_diameter_max_m   | number              |           |
| is_potentially_hazardous_asteroid                            | is_potentially_hazardous   | boolean             |           |
| close_approach_data[0].relative_velocity.kilometers_per_hour | velocity_kmh               | number              |           |
| (generated)                                                  | fetched_at                 | string (ISO 8601)   |           |

### Excluded fields

| Source field                                          | Reason                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- | 
| absolute_magnitude_h                                  | Redundant - estimated_diameter_max_m provides a more intuitive size measure  |
| is_sentry_object                                      | Rarely true - less useful for dashboard visualizations                       |
| estimated_diameter.meters.estimated_diameter_min      | One size bound is sufficient for dashboard metrics                           |
| close_approach_data[0].miss_distance.astronomical     | Kilometers is more intuitive for visualization                               |
| close_approach_data[0].miss_distance.miles            |                                                                              |
| close_approach_date_full                              | Non-standard format ("2026-Mar-31 03:53") — close_approach_date provides the same date in machine-parseable YYYY-MM-DD |
| nasa_jpl_url                                          |                                                                              |
| orbital_data                                          |                                                                              |