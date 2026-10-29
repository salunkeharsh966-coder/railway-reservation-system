import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { errMsg } from './api.js';
import { useAuth } from './App.jsx';

const CLASSES = { SLEEPER: 'Sleeper', AC3: 'AC 3 Tier', AC2: 'AC 2 Tier', AC1: 'AC First Class' };
const Err = ({ m }) => m ? <div className="alert alert-danger">{m}</div> : null;
const Spinner = () => <div className="text-center my-4"><div className="spinner-border text-primary" /></div>;

export function AuthForm({ mode }) {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const { data } = await api.post('/auth/' + mode, f); login(data); nav(data.role === 'ADMIN' ? '/admin' : '/'); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <form className="mx-auto" style={{ maxWidth: 400 }} onSubmit={submit}>
      <h3>{mode === 'login' ? 'Login' : 'Create account'}</h3><Err m={err} />
      {mode === 'register' && <input className="form-control mb-2" placeholder="Full name" required value={f.name} onChange={set('name')} />}
      <input className="form-control mb-2" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
      <input className="form-control mb-3" type="password" placeholder="Password (min 8 chars)" required minLength={8} value={f.password} onChange={set('password')} />
      <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
}

export function Search() {
  const nav = useNavigate();
  const [stations, setStations] = useState([]); const [q, setQ] = useState({ from: 'KYN', to: 'PUNE', date: new Date().toISOString().slice(0, 10), classType: 'SLEEPER' });
  const [results, setResults] = useState(null); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { api.get('/stations').then(r => setStations(r.data)).catch(x => setErr(errMsg(x))); }, []);
  const go = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try { setResults((await api.get('/trains/search', { params: q })).data); } catch (x) { setErr(errMsg(x)); setResults(null); } finally { setBusy(false); }
  };
  const set = k => e => setQ({ ...q, [k]: e.target.value });
  const Sel = ({ k }) => <select className="form-select" value={q[k]} onChange={set(k)}>{stations.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}</select>;
  return (
    <>
      <form className="row g-2 mb-4" onSubmit={go}>
        <div className="col-md-3"><Sel k="from" /></div><div className="col-md-3"><Sel k="to" /></div>
        <div className="col-md-2"><input type="date" className="form-control" min={new Date().toISOString().slice(0, 10)} required value={q.date} onChange={set('date')} /></div>
        <div className="col-md-2"><select className="form-select" value={q.classType} onChange={set('classType')}>{Object.entries(CLASSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Search trains</button></div>
      </form>
      <Err m={err} />{busy && <Spinner />}
      {results && results.length === 0 && <div className="alert alert-info">No trains found for this route.</div>}
      {results?.map(t => (
        <div key={t.id} className="card mb-2"><div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div><h5 className="mb-0">{t.number} {t.name}</h5><small className="text-muted">Dep {t.departure} → Arr {t.arrival}</small></div>
          <div>{t.available} seats · ₹{t.fare} / passenger</div>
          <button className="btn btn-success" disabled={t.available < 1} onClick={() => nav('/book', { state: { train: t, ...q } })}>Book</button>
        </div></div>
      ))}
    </>
  );
}

const loadRzp = () => new Promise((ok, no) => {
  if (window.Razorpay) return ok();
  const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = ok; s.onerror = no; document.body.appendChild(s);
});

export function Book() {
  const { state } = useLocation(); const nav = useNavigate();
  const [pax, setPax] = useState([{ name: '', age: '' }]); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  if (!state) return <Navigate to="/" />;
  const { train, from, to, date, classType } = state;
  const set = (i, k, v) => setPax(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const verify = async payload => { await api.post('/payments/verify', payload); nav('/bookings'); };
  const pay = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const b = (await api.post('/bookings', { trainId: train.id, from, to, date, classType, passengers: pax.map(p => ({ name: p.name, age: +p.age })) })).data;
      const o = (await api.post('/payments/create-order', { bookingId: b.id })).data;
      if (o.devMode) return await verify({ orderId: o.orderId, paymentId: 'pay_dev_' + Date.now(), signature: 'dev' });
      await loadRzp();
      new window.Razorpay({ key: o.keyId, amount: o.amountPaise, currency: 'INR', order_id: o.orderId, name: 'Railway Reservation',
        handler: r => verify({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }).catch(x => setErr(errMsg(x))) }).open();
    } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={pay} style={{ maxWidth: 600 }}>
      <h4>{train.number} {train.name}</h4>
      <p className="text-muted">{from} → {to} · {date} · {CLASSES[classType]}</p><Err m={err} />
      {pax.map((p, i) => (
        <div className="row g-2 mb-2" key={i}>
          <div className="col-7"><input className="form-control" placeholder="Passenger name" required value={p.name} onChange={e => set(i, 'name', e.target.value)} /></div>
          <div className="col-3"><input className="form-control" type="number" min="1" max="120" placeholder="Age" required value={p.age} onChange={e => set(i, 'age', e.target.value)} /></div>
          <div className="col-2">{pax.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => setPax(pax.filter((_, j) => j !== i))}>✕</button>}</div>
        </div>
      ))}
      {pax.length < 6 && <button type="button" className="btn btn-link p-0 mb-3" onClick={() => setPax([...pax, { name: '', age: '' }])}>+ Add passenger</button>}
      <div className="alert alert-secondary">Estimated fare: ₹{(train.fare * pax.length).toFixed(2)} (final amount is calculated by the server). Seats are held for 10 minutes.</div>
      <button className="btn btn-success" disabled={busy}>{busy ? 'Processing…' : 'Book & Pay'}</button>
    </form>
  );
}

const badge = s => ({ CONFIRMED: 'success', CANCELLED: 'secondary', PENDING_PAYMENT: 'warning', EXPIRED: 'dark' }[s] || 'light');

export function MyBookings() {
  const [list, setList] = useState(null); const [err, setErr] = useState('');
  const load = () => api.get('/bookings/my').then(r => setList(r.data)).catch(x => setErr(errMsg(x)));
  useEffect(() => { load(); }, []);
  const cancel = async id => { if (!window.confirm('Cancel this booking? A cancellation fee may apply.')) return; try { await api.post(`/bookings/${id}/cancel`); load(); } catch (x) { setErr(errMsg(x)); } };
  if (!list) return <Spinner />;
  return (
    <>
      <h4>My Bookings</h4><Err m={err} />
      {list.length === 0 && <div className="alert alert-info">No bookings yet.</div>}
      {list.map(b => (
        <div className="card mb-3" key={b.id}><div className="card-body">
          <div className="d-flex justify-content-between"><h5>{b.train}</h5><span className={`badge bg-${badge(b.status)}`}>{b.status}</span></div>
          <div>{b.from} → {b.to} · {b.date} · {CLASSES[b.classType]} · ₹{b.amount}</div>
          {b.pnr && <div><strong>PNR:</strong> {b.pnr}</div>}
          <ul className="mb-2">{b.passengers.map((p, i) => <li key={i}>{p.name} ({p.age}) — Coach {p.coach}, Seat {p.seat}</li>)}</ul>
          {b.refundAmount && <div className="text-success">Refund: ₹{b.refundAmount} ({b.paymentStatus})</div>}
          {b.status === 'CONFIRMED' && <><button className="btn btn-sm btn-outline-danger me-2" onClick={() => cancel(b.id)}>Cancel</button><button className="btn btn-sm btn-outline-primary" onClick={() => window.print()}>Print</button></>}
        </div></div>
      ))}
    </>
  );
}

export function Pnr() {
  const [pnr, setPnr] = useState(''); const [data, setData] = useState(null); const [err, setErr] = useState('');
  const go = async e => { e.preventDefault(); setErr(''); setData(null); try { setData((await api.get('/bookings/pnr/' + pnr.trim())).data); } catch (x) { setErr(errMsg(x)); } };
  return (
    <div style={{ maxWidth: 500 }}>
      <h4>PNR Status</h4>
      <form className="input-group mb-3" onSubmit={go}><input className="form-control" placeholder="10-digit PNR" required value={pnr} onChange={e => setPnr(e.target.value)} /><button className="btn btn-primary">Check</button></form>
      <Err m={err} />
      {data && <div className="card"><div className="card-body"><h5>{data.train}</h5><div>{data.from} → {data.to} · {data.date}</div><div>Class: {CLASSES[data.classType]}</div><span className={`badge bg-${badge(data.status)}`}>{data.status}</span></div></div>}
    </div>
  );
}

export function Admin() {
  const [d, setD] = useState(null); const [bk, setBk] = useState([]); const [err, setErr] = useState('');
  useEffect(() => {
    api.get('/admin/dashboard').then(r => setD(r.data)).catch(x => setErr(errMsg(x)));
    api.get('/admin/bookings').then(r => setBk(r.data)).catch(() => {});
  }, []);
  if (!d) return <><Err m={err} /><Spinner /></>;
  const labels = { users: 'Users', trains: 'Trains', stations: 'Stations', bookings: 'Bookings', confirmed: 'Confirmed', cancelled: 'Cancelled', pendingPayments: 'Pending payments', successfulPayments: 'Successful payments', refundsPending: 'Refunds pending', revenue: 'Net revenue (₹)' };
  return (
    <>
      <h4>Admin Dashboard</h4>
      <div className="row g-2 mb-4">{Object.entries(labels).map(([k, v]) => <div className="col-6 col-md-3" key={k}><div className="card text-center"><div className="card-body"><div className="fs-4">{d[k]}</div><small className="text-muted">{v}</small></div></div></div>)}</div>
      <h5>All bookings</h5>
      <div className="table-responsive"><table className="table table-sm"><thead><tr><th>ID</th><th>PNR</th><th>Train</th><th>Route</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>{bk.map(b => <tr key={b.id}><td>{b.id}</td><td>{b.pnr || '-'}</td><td>{b.train}</td><td>{b.from}→{b.to}</td><td>{b.date}</td><td>₹{b.amount}</td><td>{b.status}</td></tr>)}</tbody></table></div>
    </>
  );
}
