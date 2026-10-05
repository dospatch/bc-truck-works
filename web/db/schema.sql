create table if not exists drivers (
  id bigserial primary key,
  discord_id varchar(32) unique not null,
  display_name varchar(100) not null,
  game varchar(20) default 'ATS',
  total_miles numeric(12,1) default 0,
  trips integer default 0,
  deliveries integer default 0,
  rank integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists fleets (
  id bigserial primary key,
  name varchar(120) not null,
  owner_discord_id varchar(32),
  game varchar(20) default 'ATS',
  drivers integer default 0,
  trucks integer default 0,
  deliveries integer default 0,
  miles numeric(14,1) default 0,
  created_at timestamptz default now()
);
create table if not exists trips (
  id bigserial primary key,
  driver_id bigint references drivers(id) on delete cascade,
  game varchar(20) not null,
  origin varchar(120),
  destination varchar(120),
  miles numeric(10,1) default 0,
  fuel_used numeric(10,2) default 0,
  duration_seconds integer default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);
create table if not exists telemetry (
  id bigserial primary key,
  driver_id bigint references drivers(id) on delete cascade,
  game varchar(20) not null,
  speed numeric(8,2) default 0,
  fuel numeric(8,2),
  odometer numeric(12,1),
  latitude numeric(10,6),
  longitude numeric(10,6),
  payload jsonb default '{}'::jsonb,
  captured_at timestamptz default now()
);
create index if not exists trips_driver_idx on trips(driver_id, created_at desc);
create index if not exists telemetry_driver_idx on telemetry(driver_id, captured_at desc);
