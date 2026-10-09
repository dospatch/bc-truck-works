"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./dispatch.css";

const STORAGE_KEY = "bc-truck-works-dispatch-starter-v1";

const starterJobs = [];

function makeId() {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function DispatchPage() {
  const [jobs, setJobs] = useState(starterJobs);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    cargo: "",
    origin: "",
    destination: "",
    miles: "",
    pay: "",
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setJobs(parsed);
      }
    } catch {
      // Keep the page usable if local browser storage is unavailable.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      // Browser storage can be disabled or full; do not block the page.
    }
  }, [jobs, loaded]);

  const stats = useMemo(() => {
    const delivered = jobs.filter((job) => job.status === "Delivered");
    const miles = delivered.reduce((sum, job) => sum + (Number(job.miles) || 0), 0);
    const earnings = delivered.reduce((sum, job) => sum + (Number(job.pay) || 0), 0);
    return { total: jobs.length, active: jobs.filter((job) => job.status === "In progress").length, delivered: delivered.length, miles, earnings };
  }, [jobs]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function addJob(event) {
    event.preventDefault();
    if (!form.cargo.trim() || !form.origin.trim() || !form.destination.trim()) return;
    setJobs((current) => [{
      id: makeId(),
      cargo: form.cargo.trim(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      miles: Math.max(0, Number(form.miles) || 0),
      pay: Math.max(0, Number(form.pay) || 0),
      status: "Planned",
      createdAt: new Date().toISOString(),
      completedAt: null,
    }, ...current]);
    setForm({ cargo: "", origin: "", destination: "", miles: "", pay: "" });
  }

  function setStatus(id, status) {
    setJobs((current) => current.map((job) => job.id === id
      ? { ...job, status, completedAt: status === "Delivered" ? new Date().toISOString() : null }
      : job));
  }

  function removeJob(id) {
    setJobs((current) => current.filter((job) => job.id !== id));
  }

  return (
    <main className="dispatch-shell">
      <header className="dispatch-header">
        <Link href="/" className="dispatch-brand">
          <span className="dispatch-mark">BC</span>
          <span><strong>BC TRUCK WORKS</strong><small>DISPATCH STARTER</small></span>
        </Link>
        <Link href="/" className="dispatch-back">← Driver Command Center</Link>
      </header>

      <section className="dispatch-hero">
        <div className="dispatch-eyebrow">STARTER MODULE · ATS / ETS2</div>
        <h1>Your first dispatch board.</h1>
        <p>Create a haul, record the route, and update its progress. This is the simple first step toward connected BC TRUCK WORKS dispatching.</p>
        <div className="dispatch-note"><span className="dispatch-dot" /> Starter mode · Jobs are saved in this browser on this device.</div>
      </section>

      <section className="dispatch-stats" aria-label="Dispatch statistics">
        <article><span>ALL JOBS</span><strong>{stats.total}</strong></article>
        <article><span>IN PROGRESS</span><strong>{stats.active}</strong></article>
        <article><span>DELIVERIES</span><strong>{stats.delivered}</strong></article>
        <article><span>DELIVERED MILES</span><strong>{stats.miles.toLocaleString()}</strong></article>
        <article><span>RECORDED PAY</span><strong>{stats.earnings.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</strong></article>
      </section>

      <div className="dispatch-grid">
        <section className="dispatch-card">
          <div className="dispatch-card-heading"><div><span className="dispatch-eyebrow">NEW LOAD</span><h2>Create a dispatch</h2></div><span className="dispatch-icon">＋</span></div>
          <form className="dispatch-form" onSubmit={addJob}>
            <label>Cargo / load name<input name="cargo" value={form.cargo} onChange={updateField} placeholder="e.g. Refrigerated produce" required maxLength={100} /></label>
            <div className="dispatch-form-row">
              <label>Pickup city<input name="origin" value={form.origin} onChange={updateField} placeholder="e.g. Albuquerque, NM" required maxLength={100} /></label>
              <label>Delivery city<input name="destination" value={form.destination} onChange={updateField} placeholder="e.g. Grand Island, NE" required maxLength={100} /></label>
            </div>
            <div className="dispatch-form-row">
              <label>Estimated miles<input name="miles" value={form.miles} onChange={updateField} type="number" min="0" max="100000" placeholder="Optional" /></label>
              <label>Job pay ($)<input name="pay" value={form.pay} onChange={updateField} type="number" min="0" max="10000000" placeholder="Optional" /></label>
            </div>
            <button className="dispatch-primary" type="submit">＋ Add to dispatch board</button>
          </form>
          <p className="dispatch-help">Miles and pay are estimates you enter yourself in this starter version.</p>
        </section>

        <section className="dispatch-card dispatch-guide">
          <span className="dispatch-eyebrow">HOW IT WORKS</span>
          <h2>Keep your first hauls organized.</h2>
          <div className="dispatch-step"><span>01</span><div><strong>Add a load</strong><p>Enter the cargo and pickup/delivery cities.</p></div></div>
          <div className="dispatch-step"><span>02</span><div><strong>Start the job</strong><p>Change a planned job to In progress when you begin.</p></div></div>
          <div className="dispatch-step"><span>03</span><div><strong>Mark it delivered</strong><p>Completed jobs contribute to the starter stats above.</p></div></div>
          <div className="dispatch-callout"><strong>What comes next</strong><p>Connecting jobs to the existing telemetry API and driver accounts is a later step. This page does not yet read the live game job or sync data across devices.</p></div>
        </section>
      </div>

      <section className="dispatch-card dispatch-board">
        <div className="dispatch-card-heading"><div><span className="dispatch-eyebrow">YOUR HAULS</span><h2>Dispatch board</h2></div><span className="dispatch-count">{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</span></div>
        {!jobs.length ? (
          <div className="dispatch-empty"><span>▤</span><strong>No dispatches yet</strong><p>Add your first load using the form above. Your jobs will appear here.</p></div>
        ) : (
          <div className="dispatch-job-list">
            {jobs.map((job) => (
              <article className="dispatch-job" key={job.id}>
                <div className="dispatch-job-main">
                  <div className="dispatch-job-title"><h3>{job.cargo}</h3><span className={`dispatch-status ${job.status.toLowerCase().replaceAll(" ", "-")}`}>{job.status}</span></div>
                  <div className="dispatch-route"><span><small>PICKUP</small><strong>{job.origin}</strong></span><b>→</b><span><small>DELIVERY</small><strong>{job.destination}</strong></span></div>
                  <div className="dispatch-job-meta"><span>{Number(job.miles || 0).toLocaleString()} mi estimated</span><span>{Number(job.pay || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} estimated pay</span></div>
                  {job.status === "Delivered" && job.completedAt && <small className="dispatch-completed">Delivered {new Date(job.completedAt).toLocaleString()}</small>}
                </div>
                <div className="dispatch-job-actions">
                  {job.status === "Planned" && <button onClick={() => setStatus(job.id, "In progress")}>Start job</button>}
                  {job.status === "In progress" && <button onClick={() => setStatus(job.id, "Delivered")}>Mark delivered</button>}
                  {job.status === "Delivered" && <button className="dispatch-muted-button" onClick={() => setStatus(job.id, "In progress")}>Reopen</button>}
                  <button className="dispatch-delete" onClick={() => removeJob(job.id)} aria-label={`Remove ${job.cargo}`}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer className="dispatch-footer">BC TRUCK WORKS · Independent community project · Not affiliated with SCS Software.</footer>
    </main>
  );
}
