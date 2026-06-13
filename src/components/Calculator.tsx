// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

// ── 2026/27 Constants ───────────────────────────────────────────────────────────
const TAX_YEAR        = "2026/27";
const PA_STD          = 12570;
const BASIC_BAND      = 37700;
const HIGHER_THRESH   = 50270;
const ADDL_THRESH     = 125140;
const BLIND_ALLOW     = 3250;
const MARRIAGE_TRANS  = 1260;
const MARRIAGE_CREDIT = 252;
const NI_PRIMARY      = 12570;
const NI_UPPER        = 50270;
const AE_LOWER        = 6240;
const AE_UPPER        = 50270;
const EMP_NI_SEC      = 5000;
const EMP_NI_RATE     = 0.15;
const DIV_ALLOW       = 500;
const DIV_BASIC       = 0.1075;
const DIV_HIGHER      = 0.3575;
const DIV_ADDL        = 0.3935;
const SL_THRESH = { None:0, Plan1:26900, Plan2:29385, Plan4:33795, Plan5:25000, Postgrad:21000 };
const SL_RATE   = { None:0, Plan1:0.09, Plan2:0.09,  Plan4:0.09,  Plan5:0.09,  Postgrad:0.06  };

// ── Calculation Engine ────────────────────────────────────────────────────────
function calcTax({ salary, dividends, savings, bonus,
                   pensionPct, pensionMethod, pensionType,
                   studentLoan, payNI, region,
                   blind, marriage, hoursPerWeek, daysPerWeek,
                   cycleToWork=0, taxBenefits=0, giftAid=0, taxCodeMode='standard', customPA=12570 }) {

  // Pension
  // Auto-enrolment: pension on qualifying earnings band (£6,240–£50,270)
  // Per HMRC: bonus, overtime and commission ARE qualifying earnings
  const pensionAmt = pensionType === "auto-enrolment"
    ? Math.max(0, Math.min(salary + bonus, AE_UPPER) - AE_LOWER) * pensionPct
    : salary * pensionPct;
  const isSS  = pensionMethod === "Salary Sacrifice";
  const isNPA = pensionMethod === "Net Pay Arrangement";
  const isRAS = pensionMethod === "Relief at Source";
  // RAS: employee pays 80% from take-home; HMRC adds 20% directly to pot
  const pensionDeducted = isRAS ? pensionAmt * 0.8 : pensionAmt;

  // Cycle to Work: salary sacrifice — declare FIRST, then use in empForTax/NI
  const c2w = Math.max(0, cycleToWork);

  // Employment income after pension sacrifice and cycle to work
  const empForTax = (isSS || isNPA) ? Math.max(0, salary - pensionAmt - c2w) : Math.max(0, salary - c2w);
  const empForNI  = isSS ? Math.max(0, salary - pensionAmt - c2w) : Math.max(0, salary - c2w);

  // Taxable benefits (e.g. private medical) — added to taxable income, not NI
  const taxBen = Math.max(0, taxBenefits);
  const totalEmp = empForTax + bonus + taxBen;

  // Personal Allowance
  const blindExtra  = blind ? BLIND_ALLOW : 0;
  const totalInc    = totalEmp + dividends + savings;

  // Tax code overrides
  // BR = basic rate on all income (no PA), D0 = all at 40%, D1 = all at 45%
  // Custom = user-specified PA (e.g. adjusted code 1000L = PA of £10,000)
  let pa;
  let flatRate = null; // for BR/D0/D1 — all income taxed at single rate
  // paTaper declared at scope level so return object can reference it
  let paTaper = 0;
  if (taxCodeMode === 'br')     { pa = 0; flatRate = 0.20; }
  else if (taxCodeMode === 'd0') { pa = 0; flatRate = 0.40; }
  else if (taxCodeMode === 'd1') { pa = 0; flatRate = 0.45; }
  else if (taxCodeMode === 'custom') {
    // Custom PA: no taper applied (HMRC has already adjusted the code)
    pa = Math.max(0, customPA) + blindExtra;
    if (marriage === 'receiving') pa += MARRIAGE_TRANS;
  } else {
    // Standard 1257L: apply normal taper logic
    // Use ANI (not totalInc) for PA taper — RAS pension reduces ANI
    const aniForTaper = totalInc - (isRAS ? pensionAmt : 0) - (giftAid > 0 ? giftAid / 0.8 : 0);
    paTaper = aniForTaper >= ADDL_THRESH ? PA_STD
            : aniForTaper > 100000 ? Math.min(PA_STD, (aniForTaper - 100000) / 2) : 0;
    pa = Math.max(0, PA_STD - paTaper) + blindExtra;
    if (marriage === 'receiving') pa += MARRIAGE_TRANS;
  }

  const txEmp = flatRate !== null ? totalEmp : Math.max(0, totalEmp - pa);
  // Dynamic higher rate band — widens when PA is tapered
  const HB = Math.max(0, ADDL_THRESH - pa - BASIC_BAND);

  // Employment income tax
  const isScot = region === "Scotland";
  let empIT;
  if (isScot) {
    // Scotland 2026/27 bands (in taxable income terms above PA)
    // Scotland 2026/27 bands — gov.uk confirmed thresholds
    // Starter £12,571-£16,537 | Basic £16,538-£29,526 | Intermediate £29,527-£43,662
    // Higher £43,663-£75,000  | Advanced £75,001-£125,140 | Top over £125,140
    const bands = [[3967,0.19],[16956,0.20],[31092,0.21],[62430,0.42],[112570,0.45]];
    let t = 0, rem = txEmp, prev = 0;
    for (const [lim, rate] of bands) {
      const b = Math.min(rem, lim - prev);
      if (b > 0) t += b * rate;
      rem = Math.max(0, rem - (lim - prev));
      prev = lim;
    }
    if (rem > 0) t += rem * 0.48;
    empIT = t;
  } else {
    const empBR = Math.max(0, Math.min(txEmp, BASIC_BAND)) * 0.20;
    const empHR = Math.max(0, Math.min(txEmp - BASIC_BAND, HB)) * 0.40;
    const empAR = Math.max(0, txEmp - BASIC_BAND - HB) * 0.45;
    empIT = empBR + empHR + empAR;
  }
  // Flat rate codes (BR/D0/D1): all taxable income at single rate, no bands
  if (flatRate !== null) empIT = totalEmp * flatRate;
  if (marriage === "giving") empIT = Math.max(0, empIT - MARRIAGE_CREDIT);

  // Savings tax
  const psa      = totalInc > ADDL_THRESH ? 0 : empForTax > HIGHER_THRESH ? 500 : 1000;
  const srb      = Math.max(0, 5000 - Math.max(0, totalEmp - pa));
  const savZero  = Math.min(savings, Math.max(0, pa - totalEmp) + srb);
  const savPSA   = Math.min(Math.max(0, savings - savZero), psa);
  const txSav    = Math.max(0, savings - savZero - savPSA);
  const brRemSav = Math.max(0, BASIC_BAND - txEmp);
  const hrRemSav = Math.max(0, HB - Math.max(0, txEmp - BASIC_BAND));
  const savIT    = Math.min(txSav, brRemSav) * 0.20
                 + Math.max(0, Math.min(txSav - brRemSav, hrRemSav)) * 0.40
                 + Math.max(0, txSav - brRemSav - hrRemSav) * 0.45;

  // Dividend tax (2026/27 rates)
  const txDiv    = Math.max(0, dividends - DIV_ALLOW);
  const brRemDiv = Math.max(0, BASIC_BAND - txEmp - txSav);
  const hrRemDiv = Math.max(0, HB - Math.max(0, txEmp - BASIC_BAND) - Math.max(0, txSav - brRemSav));
  const divIT    = Math.min(txDiv, brRemDiv) * DIV_BASIC
                 + Math.max(0, Math.min(txDiv - brRemDiv, hrRemDiv)) * DIV_HIGHER
                 + Math.max(0, txDiv - brRemDiv - hrRemDiv) * DIV_ADDL;

  // NI (employee)
  // NI: use monthly PAYE method so bonus is taxed in its pay period
  // This correctly applies the upper earnings limit per period (matches real payslips)
  const niMonthlyBase = empForNI / 12;  // NI base after C2W sacrifice
  const niRegularMonthly = Math.max(0, Math.min(niMonthlyBase, NI_UPPER/12) - NI_PRIMARY/12) * 0.08
                         + Math.max(0, niMonthlyBase - NI_UPPER/12) * 0.02;
  // Bonus is paid in a single month: (salary/12 + bonus) in that period
  const niBonusMonth = bonus > 0
    ? Math.max(0, Math.min(niMonthlyBase + bonus, NI_UPPER/12) - NI_PRIMARY/12) * 0.08
      + Math.max(0, niMonthlyBase + bonus - NI_UPPER/12) * 0.02
    : niRegularMonthly;  // no bonus: all 12 months are regular
  const ni = payNI
    ? (bonus > 0 ? niRegularMonthly * 11 + niBonusMonth : niRegularMonthly * 12)
    : 0;

  // Employer NI (informational)
  // Employer NI — on total employment cost including bonus
  const employerNI = Math.max(0, (empForNI + bonus) - EMP_NI_SEC) * EMP_NI_RATE;

  // Student loan — HMRC PAYE: floor monthly deduction, × 12
  const slT = SL_THRESH[studentLoan] || 0;
  const slR = SL_RATE[studentLoan]   || 0;
  const slMonthly = Math.max(0, (empForTax / 12) - (slT / 12)) * slR;
  const sl = Math.floor(slMonthly) * 12;

  const totalIT    = empIT + savIT + divIT;
  const grossTotal = salary + dividends + savings + bonus;
  // c2w is a cash salary sacrifice — deducted from take-home
  // taxBenefits increases tax but is non-cash (benefit received in kind)
  const netTotal   = grossTotal - totalIT - ni - sl - pensionDeducted - c2w;
  const weeks      = 52;
  const annHours   = hoursPerWeek * weeks;
  const annDays    = daysPerWeek  * weeks;

  return {
    pensionAmt, pensionDeducted, empForTax, totalEmp, pa, paTaper, blindExtra,
    txEmp, empIT, savIT, divIT, totalIT, ni, employerNI, sl,
    txSav, txDiv, savZero, savPSA, psa, srb,
    grossTotal, netTotal, c2w, taxBenefits,
    // ANI per HMRC: deduct RAS pension gross (SS/NPA already reduce empForTax)
    // Gift Aid grossed up = donation / 0.8 (basic rate tax reclaimed by charity)
    ani: totalInc - (isRAS ? pensionAmt : 0) - (giftAid > 0 ? giftAid / 0.8 : 0),
    giftAidGross: giftAid > 0 ? giftAid / 0.8 : 0,
    netEmp: salary + bonus - totalIT - ni - sl - pensionDeducted - c2w,
    monthly:  netTotal / 12,
    weekly:   netTotal / weeks,
    daily:    annDays  > 0 ? netTotal / annDays  : 0,
    hourly:   annHours > 0 ? netTotal / annHours : 0,
    effEmp:   salary > 0 ? (empIT + ni) / salary : 0,
    effAll:   grossTotal > 0 ? totalIT / grossTotal : 0,
    margSav:  txSav > 0 ? savIT / txSav : 0,
    margDiv:  txDiv > 0 ? divIT / txDiv : 0,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n, d=2) => "£" + Math.abs(n).toLocaleString("en-GB",
              { minimumFractionDigits:d, maximumFractionDigits:d });
const pct  = n => (n*100).toFixed(1)+"%";
const fmtS = n => fmt(n, n % 1 === 0 ? 0 : 2); // 0dp if whole number

function useSmooth(target, ms=350) {
  const [v, setV] = useState(target);
  const from = useRef(target), raf = useRef(null);
  useEffect(() => {
    const t0 = performance.now(), start = v;
    from.current = start;
    if (raf.current) cancelAnimationFrame(raf.current);
    const tick = now => {
      const p = Math.min((now-t0)/ms,1), e = 1-Math.pow(1-p,3);
      setV(from.current + (target - from.current)*e);
      if (p<1) raf.current=requestAnimationFrame(tick);
      else from.current=target;
    };
    raf.current=requestAnimationFrame(tick);
    return ()=>raf.current&&cancelAnimationFrame(raf.current);
  }, [target]);
  return v;
}

// ── UI primitives ─────────────────────────────────────────────────────────────
const LABEL_S = { display:"block", fontSize:11, letterSpacing:"0.12em",
  color:"#aabdd0", textTransform:"uppercase", marginBottom:6,
  fontFamily:"'DM Sans',sans-serif" };
const INPUT_S = focused => ({
  width:"100%", boxSizing:"border-box",
  background: focused?"#0f1923":"#0b1520",
  border:`1px solid ${focused?"#3b82f6":"#1e2d3d"}`,
  borderRadius:10, padding:"11px 12px 11px 32px",
  color:"#e8f0ff", fontSize:17, fontFamily:"'DM Mono',monospace",
  outline:"none", transition:"all 0.2s",
  boxShadow: focused?"0 0 0 3px rgba(59,130,246,0.15)":"none",
});
const SEL_S = {
  width:"100%", background:"#0b1520", border:"1px solid #1e2d3d",
  borderRadius:10, padding:"11px 32px 11px 12px", color:"#e8f0ff",
  fontSize:13, fontFamily:"'DM Sans',sans-serif",
  outline:"none", cursor:"pointer", appearance:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a9bb0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
};

function NumIn({ label, value, onChange, min=0, max=2000000 }) {
  const [f,setF]=useState(false), [raw,setRaw]=useState(String(value));
  useEffect(()=>{ if(!f) setRaw(value.toLocaleString("en-GB")); },[value,f]);
  return (
    <div style={{marginBottom:14}}>
      <label style={LABEL_S}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
          fontSize:15,color:"#7a96b0",fontFamily:"'DM Mono',monospace",zIndex:1}}>£</span>
        <input type="text"
          value={f?raw:value.toLocaleString("en-GB")}
          onFocus={()=>{setF(true);setRaw(String(value));}}
          onBlur={e=>{setF(false);const n=parseFloat(e.target.value.replace(/,/g,""))||0;onChange(Math.min(Math.max(n,min),max));}}
          onChange={e=>setRaw(e.target.value)}
          style={INPUT_S(f)}/>
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, options, hint }) {
  return (
    <div style={{marginBottom:14}}>
      <label style={LABEL_S}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={SEL_S}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint&&<div style={{fontSize:10,color:"#8aabb8",marginTop:4}}>{hint}</div>}
    </div>
  );
}

function Tog({ label, value, onChange, hint }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div>
        <div style={LABEL_S}>{label}</div>
        {hint&&<div style={{fontSize:10,color:"#8aabb8",marginTop:2}}>{hint}</div>}
      </div>
      <button onClick={()=>onChange(!value)} style={{
        width:44,height:24,borderRadius:12,border:"none",flexShrink:0,
        background:value?"#22c55e":"#1e2d3d",cursor:"pointer",transition:"background 0.2s",position:"relative",
      }}>
        <div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",
          top:3,transition:"left 0.2s",left:value?23:3}}/>
      </button>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  const vals=[0,.01,.02,.03,.04,.05,.06,.07,.08,.09,.10,.12,.15,.18,.20,.25,.30];
  // Closest-match index to avoid floating point failures
  const idx = vals.reduce((best,v,i) =>
    Math.abs(v-value) < Math.abs(vals[best]-value) ? i : best, 0);
  // Key tick marks with their TRUE position along the track
  // 0%=idx0, 5%=idx5, 10%=idx10, 20%=idx14, 30%=idx16
  const ticks = [{v:"0%",i:0},{v:"5%",i:5},{v:"10%",i:10},{v:"20%",i:14},{v:"30%",i:16}];
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
        <label style={LABEL_S}>Pension Contribution</label>
        <span style={{fontSize:20,fontFamily:"'DM Mono',monospace",color:"#f472b6",fontWeight:700}}>{pct(value)}</span>
      </div>
      <input type="range" min={0} max={vals.length-1} value={idx}
        onChange={e=>onChange(vals[+e.target.value])}
        style={{width:"100%"}}/>
      <div style={{position:"relative",marginTop:4,height:16}}>
        {ticks.map(t=>(
          <span key={t.v} style={{
            position:"absolute",
            left:`${(t.i/(vals.length-1))*100}%`,
            transform:"translateX(-50%)",
            fontSize:10,
            color: idx===t.i ? "#f472b6" : "#8aaac8",
            fontWeight: idx===t.i ? 700 : 400,
          }}>{t.v}</span>
        ))}
      </div>
    </div>
  );
}

function HoursInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { if (!focused) setRaw(String(value)); }, [value, focused]);
  return (
    <input type="text" inputMode="decimal"
      value={focused ? raw : String(value)}
      onFocus={() => { setFocused(true); setRaw(String(value)); }}
      onBlur={e => {
        setFocused(false);
        const n = parseFloat(e.target.value);
        if (!isNaN(n) && n >= 1 && n <= 80) onChange(n);
        else setRaw(String(value));
      }}
      onChange={e => setRaw(e.target.value)}
      style={{...INPUT_S(false), padding:"11px 12px", fontSize:14, width:"100%"}}/>
  );
}

function SecHead({ children }) {
  return <div style={{fontSize:10,letterSpacing:"0.15em",color:"#7a9ab8",
    textTransform:"uppercase",marginBottom:10,marginTop:16,paddingLeft:2,
    fontFamily:"'DM Sans',sans-serif"}}>{children}</div>;
}

function Row({ label, value, color, bold, bg, note, fmtFn=fmt, pctV }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"8px 12px",background:bg||"transparent",borderRadius:7,marginBottom:2}}>
      <div>
        <span style={{fontSize:13,color:bold?"#dde8f4":"#9ab8cc",
          fontFamily:"'DM Sans',sans-serif",fontWeight:bold?600:400}}>{label}</span>
        {note&&<div style={{fontSize:10,color:"#8aabb8",marginTop:1}}>{note}</div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {pctV!==undefined&&<span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#7a96b0"}}>{pct(pctV)}</span>}
        <span style={{fontSize:bold?15:13,fontFamily:"'DM Mono',monospace",
          color:color||"#aabdd0",fontWeight:bold?700:400}}>{fmtFn(value)}</span>
      </div>
    </div>
  );
}

function Donut({ data, size=130 }) {
  const cx=size/2,cy=size/2,r=size*.38,ir=size*.24;
  const total=data.reduce((s,d)=>s+d.value,0)||1;
  let ang=-90;
  const slices=data.map(d=>{const sw=(d.value/total)*360,s=ang;ang+=sw;return{...d,start:s,sweep:sw};});
  const [hov,setHov]=useState(null);
  const arc=(cx,cy,r,s,sw)=>{
    if(sw>=359.9)return`M${cx},${cy-r}A${r},${r},0,1,1,${cx-.01},${cy-r}Z`;
    const d=Math.PI/180,x1=cx+r*Math.cos(s*d),y1=cy+r*Math.sin(s*d);
    const x2=cx+r*Math.cos((s+sw)*d),y2=cy+r*Math.sin((s+sw)*d);
    return`M${cx},${cy}L${x1},${y1}A${r},${r},0,${sw>180?1:0},1,${x2},${y2}Z`;
  };
  const th=data.find(d=>d.label==="Take Home")?.value||0;
  return(
    <svg width={size} height={size} style={{overflow:"visible"}}>
      {slices.filter(s=>s.value>0).map((s,i)=>(
        <path key={i} d={arc(cx,cy,r,s.start,s.sweep)} fill={s.color}
          opacity={hov===null||hov===i?.9:.3}
          style={{transition:"opacity 0.2s",cursor:"pointer"}}
          onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
      ))}
      <circle cx={cx} cy={cy} r={ir} fill="#060e18"/>
      <text x={cx} y={cy-7} textAnchor="middle" fill="#aabdd0" fontSize={8} fontFamily="DM Sans,sans-serif">take home</text>
      <text x={cx} y={cy+9} textAnchor="middle" fill="#22c55e" fontSize={12} fontFamily="DM Mono,monospace" fontWeight="700">
        {total>0?Math.round(th/total*100):0}%
      </text>
    </svg>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function UKTaxApp() {
  const [salary,setSalary]     = useState(35000);
  const [dividends,setDiv]     = useState(0);
  const [savings,setSav]       = useState(0);
  const [bonus,setBonus]       = useState(0);
  const [pensionPct,setPP]     = useState(0.05);
  const [pensionMethod,setPM]  = useState("Salary Sacrifice");
  const [pensionType,setPT]    = useState("standard");
  const [studentLoan,setSL]    = useState("None");
  const [payNI,setPayNI]       = useState(true);
  const [region,setRegion]     = useState("England / Wales / N.Ireland");
  const [blind,setBlind]       = useState(false);
  const [marriage,setMarriage] = useState("none");
  const [hours,setHours]       = useState(37.5);
  const [cycleToWork,setCTW]   = useState(0);
  const [giftAid,setGA]         = useState(0);
  const [taxCodeMode,setTCM]    = useState('standard');  // standard | br | d0 | d1 | custom
  const [customPA,setCustomPA]  = useState(12570);
  const [taxBenefits,setTaxB]  = useState(0);
  const [days,setDays]         = useState(5);
  const [tab,setTab]           = useState("summary");
  const [psName,setPSName]      = useState("");
  const [psMonth,setPSMonth]    = useState(new Date().getMonth()+1);

  const t = calcTax({ salary, dividends, savings, bonus, pensionPct, pensionMethod,
    pensionType, studentLoan, payNI, region, blind, marriage,
    hoursPerWeek: hours, daysPerWeek: days, cycleToWork, taxBenefits, giftAid,
    taxCodeMode, customPA });

  const animNet = useSmooth(t.netTotal);

  const donutData = [
    { label:"Take Home",      value:t.netTotal,        color:"#22c55e" },
    { label:"Income Tax",     value:t.totalIT,         color:"#3b82f6" },
    { label:"Nat. Insurance", value:t.ni,              color:"#f59e0b" },
    { label:"Pension",        value:t.pensionDeducted, color:"#f472b6" },
    { label:"Student Loan",   value:t.sl,              color:"#a78bfa" },
    { label:"Cycle to Work",  value:t.cycleToWork,     color:"#14b8a6" },
  ].filter(d=>d.value>0);

  const card = (extra={}) => ({ background:"#0b1520", border:"1px solid #0f1e2d", borderRadius:14, padding:20, ...extra });
  const sLbl = { fontSize:10,letterSpacing:"0.12em",color:"#7a9ab8",textTransform:"uppercase",marginBottom:14,fontFamily:"'DM Sans',sans-serif" };

  return (
    <div style={{minHeight:"100vh",background:"#060e18",fontFamily:"'DM Sans',sans-serif",color:"#e8f0ff"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#060e18}::-webkit-scrollbar-thumb{background:#2e4057;border-radius:2px}
        input[type=range]{-webkit-appearance:none;height:7px;border-radius:4px;background:#2a4a6e;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;cursor:pointer;background:#f472b6;border:3px solid #07101a;box-shadow:0 0 0 2px #f472b6,0 2px 10px rgba(244,114,182,.55)}
        input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;cursor:pointer;background:#f472b6;border:3px solid #07101a}
        input[type=range]::-moz-range-track{height:7px;border-radius:4px;background:#2a4a6e}
        select option{background:#0b1520}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #0f1e2d",padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="24" height="16" style={{borderRadius:2,flexShrink:0}}><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="12"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="6"/><path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="14"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8"/></svg>
          <div>
            <div style={{fontSize:17,fontWeight:700,letterSpacing:"-0.03em",color:"#e8f0ff"}}>WageLab</div>
            <div style={{fontSize:10,color:"#8aaab8",letterSpacing:"0.1em",textTransform:"uppercase"}}>{TAX_YEAR} · v2.3 · www.wagelab.co.uk</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["England / Wales / N.Ireland","Scotland"].map(r=>(
            <button key={r} onClick={()=>setRegion(r)} style={{
              padding:"6px 14px",borderRadius:8,border:"1px solid",
              borderColor:region===r?"#3b82f6":"#1e2d3d",
              background:region===r?"rgba(59,130,246,0.12)":"transparent",
              color:region===r?"#93c5fd":"#7a96b0",
              fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",
            }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",minHeight:"calc(100vh - 58px)"}}>

        {/* LEFT — Inputs */}
        <div style={{borderRight:"1px solid #0f1e2d",padding:"18px 16px",overflowY:"auto",background:"#07101a"}}>

          {/* Hero */}
          <div style={{background:"linear-gradient(135deg,#0a1f14,#071018)",border:"1px solid rgba(34,197,94,.2)",
            borderRadius:14,padding:"16px 16px 14px",marginBottom:18,textAlign:"center"}}>
            <div style={{fontSize:10,letterSpacing:"0.15em",color:"#86aabb",textTransform:"uppercase",marginBottom:6}}>Annual Take-Home</div>
            <div style={{fontSize:36,fontFamily:"'DM Mono',monospace",fontWeight:700,color:"#22c55e",letterSpacing:"-2px",lineHeight:1}}>
              {fmt(animNet)}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:10}}>
              {[["Monthly",t.monthly,2],["Weekly",t.weekly,2],["Hourly",t.hourly,2]].map(([l,v,d])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#8aabb8"}}>{l}</div>
                  <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:"#c8d8e8"}}>{fmt(v,d)}</div>
                </div>
              ))}
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:"#8aabb8"}}>Eff. Rate</div>
                <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:"#ef4444"}}>{pct(t.effAll)}</div>
              </div>
            </div>
            {/* ANI row */}
            <div style={{borderTop:"1px solid rgba(34,197,94,.15)",marginTop:10,paddingTop:8,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:10,color:"#8aabb8",letterSpacing:"0.08em",textTransform:"uppercase"}}>
                Adjusted Net Income
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,fontFamily:"'DM Mono',monospace",
                  color: t.ani >= 125140 ? "#ef4444" : t.ani > 100000 ? "#f59e0b" : t.ani > 80000 ? "#fb923c" : t.ani > 60000 ? "#fbbf24" : "#86aabb",
                  fontWeight: t.ani > 60000 ? 700 : 400
                }}>{fmt(t.ani,0)}</span>
                {t.ani > 100000 && t.ani < 125140 && (
                  <span style={{fontSize:9,color:"#f59e0b",background:"rgba(245,158,11,.12)",
                    borderRadius:4,padding:"2px 5px"}}>PA taper zone</span>
                )}
                {t.ani >= 125140 && (
                  <span style={{fontSize:9,color:"#ef4444",background:"rgba(239,68,68,.12)",
                    borderRadius:4,padding:"2px 5px"}}>No PA</span>
                )}
              </div>
            </div>
            <div style={{fontSize:9,color:"#5a7a94",marginTop:4,textAlign:"right"}}>
              {giftAid > 0
                ? `Gift Aid grossed-up deduction: ${fmt(giftAid/0.8,0)} applied to ANI.`
                : (t.ani > 55000 && t.ani < 105000
                  ? "💡 Gift Aid donations reduce ANI — could move you below a threshold."
                  : null)}
            </div>
            <div style={{fontSize:9,color:"#5a7a94",marginTop:2,textAlign:"right"}}>
              {taxCodeMode === "standard"
                ? "Tax code: 1257L — standard Personal Allowance"
                : taxCodeMode === "br" ? "⚠ Tax code: BR — all income at 20%, no PA"
                : taxCodeMode === "d0" ? "⚠ Tax code: D0 — all income at 40%, no PA"
                : taxCodeMode === "d1" ? "⚠ Tax code: D1 — all income at 45%, no PA"
                : `Tax code: custom PA £${customPA.toLocaleString("en-GB")}`}
            </div>
            {/* ANI warnings */}
            {t.ani > 60000 && (
              <div style={{marginTop:8,borderRadius:8,padding:"10px 12px",
                background: t.ani >= 80000 ? "rgba(239,68,68,.07)" : "rgba(251,191,36,.07)",
                border: `1px solid ${t.ani >= 80000 ? "rgba(239,68,68,.25)" : "rgba(251,191,36,.25)"}`}}>
                {/* Child Benefit warning */}
                {t.ani > 60000 && t.ani < 80000 && (
                  <div style={{marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#fbbf24",marginBottom:3}}>⚠ High Income Child Benefit Charge</div>
                    <div style={{fontSize:10,color:"#fde68a",lineHeight:1.5}}>
                      Your ANI is above £60,000. If your household claims Child Benefit,
                      {" "}{Math.min(100,Math.floor((t.ani-60000)/200))}% is clawed back via the
                      High Income Child Benefit Charge. A pension contribution of {fmt(t.ani-60000,0)}
                      could bring your ANI to £60,000 and protect the full benefit.
                      <strong style={{color:"#fbbf24"}}> Self Assessment:</strong> the HICBC is
                      collected via Self Assessment — you must register even if all income
                      is taxed via PAYE. Failure to register may result in penalties.
                    </div>
                  </div>
                )}
                {t.ani >= 80000 && t.ani < 100000 && (
                  <div style={{marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#fca5a5",marginBottom:3}}>⚠ Child Benefit fully clawed back</div>
                    <div style={{fontSize:10,color:"#fca5a5",lineHeight:1.5}}>
                      Your ANI exceeds £80,000. Any Child Benefit claimed by your household
                      is fully recovered by HMRC. A pension contribution of {fmt(t.ani-60000,0)}
                      could bring your ANI to £60,000 and restore the full benefit.
                      <strong style={{color:"#fca5a5"}}> Self Assessment:</strong> register
                      with HMRC for Self Assessment even if you are PAYE only — the HICBC
                      cannot be collected through your tax code.
                    </div>
                  </div>
                )}
                {/* 30 hours childcare + PA taper */}
                {t.ani > 100000 && (
                  <div style={{marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:3}}>
                      {region === "Scotland"
                        ? "⚠ Tax-Free Childcare eligibility at risk"
                        : "⚠ 30hrs Childcare & Tax-Free Childcare lost"}
                    </div>
                    <div style={{fontSize:10,color:"#fde68a",lineHeight:1.5}}>
                      {region === "Scotland" ? (
                        <>Scotland's funded childcare (1,140hrs/year) is universal — no income limit applies.
                        However Tax-Free Childcare (up to £2,000/yr per child) is lost above £100,000 ANI.
                        A pension contribution of {fmt(t.ani-100000,0)} could restore eligibility.</>
                      ) : (
                        <>ANI over £100,000 removes eligibility for 30 hours free childcare
                        (worth ~£5,000–6,000/yr) and Tax-Free Childcare (up to £2,000/yr per child).
                        A pension contribution of {fmt(t.ani-100000,0)} could bring your ANI
                        to £100,000 and restore eligibility.</>
                      )}
                    </div>
                  </div>
                )}
                {t.ani > 100000 && (
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:3}}>⚠ Personal Allowance taper active</div>
                    <div style={{fontSize:10,color:"#fde68a",lineHeight:1.5}}>
                      Your PA reduces by £1 for every £2 earned above £100,000.
                      Marginal rate in taper zone: {t.ani <= 125140 ? "60%" : "45% — PA fully lost"}.
                      {t.ani < 125140 && ` A pension contribution of ${fmt(t.ani-100000,0)} could restore your full PA.`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <SecHead>Income</SecHead>
          <NumIn label="Employment Salary" value={salary} onChange={setSalary}/>
          <NumIn label="Dividend Income" value={dividends} onChange={setDiv}/>
          <NumIn label="Savings Interest" value={savings} onChange={setSav}/>
          <NumIn label="Bonus / One-off Payment" value={bonus} onChange={setBonus}/>
          <div style={{fontSize:10,color:"#8aabb8",marginTop:-10,marginBottom:8,paddingLeft:2}}>Bonus is assumed to be a one-off annual payment made in a single month alongside your regular salary. Results may differ for weekly or four-weekly paid employees or those receiving regular variable pay.</div>

          <SecHead>Pension</SecHead>
          <Slider label="Pension" value={pensionPct} onChange={setPP}/>
          <div style={{fontSize:10,color:"#8aabb8",marginBottom:8,paddingLeft:2,lineHeight:1.5}}>
            ⚠ Annual Allowance: pension contributions are capped at £60,000/year (2026/27)
            or 100% of earnings if lower. If you have triggered the Money Purchase Annual
            Allowance (MPAA) the limit falls to £10,000. We do not verify this — if in
            doubt seek independent financial advice.
          </div>
          <Sel label="Pension Method" value={pensionMethod} onChange={setPM}
            options={[
              {value:"Salary Sacrifice",     label:"Salary Sacrifice — reduces gross salary, saves IT + NI"},
              {value:"Relief at Source",      label:"Personal / Relief at Source — no effect on tax or NI"},
              {value:"Net Pay Arrangement",   label:"Net Pay Arrangement — reduces taxable income, saves IT only"},
            ]}/>
          <Sel label="Pension Earnings Basis" value={pensionType} onChange={setPT}
            hint={pensionType==="auto-enrolment"?`Qualifying earnings: £${AE_LOWER.toLocaleString()}–£${AE_UPPER.toLocaleString()}`:""}
            options={[
              {value:"standard",       label:"Standard (% of full salary)"},
              {value:"auto-enrolment", label:"Auto-Enrolment (qualifying earnings only)"},
            ]}/>

          <SecHead>Deductions & Options</SecHead>
          <Sel label="Student Loan Plan" value={studentLoan} onChange={setSL}
            options={[
              {value:"None",    label:"None"},
              {value:"Plan1",   label:"Plan 1 — England/Wales pre-2012 & N. Ireland (£26,900 @ 9%)"},
              {value:"Plan2",   label:"Plan 2 — England/Wales Sept 2012–July 2023 (£29,385 @ 9%)"},
              {value:"Plan4",   label:"Plan 4 — Scotland SAAS loans (£33,795 @ 9%)"},
              {value:"Plan5",   label:"Plan 5 — England from Aug 2023 (£25,000 @ 9%)"},
              {value:"Postgrad",label:"Plan 3 / Postgrad — Master's & Doctoral loans (£21,000 @ 6%)"},
            ]}/>
          <Tog label="Pay National Insurance?" value={payNI} onChange={setPayNI}
            hint="Off = exempt (e.g. over State Pension age)"/>
          <Tog label="Blind Person's Allowance" value={blind} onChange={setBlind}
            hint={blind?`+£${BLIND_ALLOW.toLocaleString()} added to personal allowance`:"Adds £3,250 to your PA"}/>
          <Sel label="Marriage Allowance" value={marriage} onChange={setMarriage}
            hint={marriage==="giving"?"Transfers £1,260 of your PA — saves partner £252 tax"
                 :marriage==="receiving"?"Your PA increased by £1,260 (partner transfers to you)":""}
            options={[
              {value:"none",      label:"Not applicable"},
              {value:"giving",    label:"Giving — I transfer £1,260 PA to partner"},
              {value:"receiving", label:"Receiving — partner transfers £1,260 to me"},
            ]}/>

          <SecHead>Additional Deductions & Benefits</SecHead>
          <NumIn label="Cycle to Work Salary Sacrifice (annual)" value={cycleToWork} onChange={setCTW}/>
          <div style={{fontSize:10,color:"#8aabb8",marginTop:-10,marginBottom:8,paddingLeft:2}}>Reduces gross salary before tax and NI — same treatment as pension salary sacrifice.</div>
          <NumIn label="Gift Aid Donations (cash paid)" value={giftAid} onChange={setGA}/>
          <div style={{fontSize:10,color:"#8aabb8",marginTop:-10,marginBottom:8,paddingLeft:2}}>The amount you actually paid. Grossed-up ({giftAid>0?fmt(giftAid/0.8,0):"£0"}) deducted from ANI.</div>
          <NumIn label="Other Taxable Benefits (annual value)" value={taxBenefits} onChange={setTaxB}/>
          <div style={{fontSize:10,color:"#8aabb8",marginTop:-10,marginBottom:14,paddingLeft:2}}>E.g. private medical, gym membership. Added to taxable income — increases tax liability.</div>
                    <SecHead>Tax Code</SecHead>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {[["standard","1257L (Standard)"],["br","BR (No PA)"],
              ["d0","D0 (All 40%)"],["d1","D1 (All 45%)"],["custom","Custom PA"]].map(([code,label])=>(
              <button key={code} onClick={()=>setTCM(code)}
                style={{padding:"5px 10px",borderRadius:8,fontSize:11,cursor:"pointer",
                  border:`1px solid ${taxCodeMode===code?"#3b82f6":"#1e2d3d"}`,
                  background:taxCodeMode===code?"rgba(59,130,246,.15)":"transparent",
                  color:taxCodeMode===code?"#93c5fd":"#7a96b0",
                  fontFamily:"'DM Mono',monospace"}}>{label}</button>
            ))}
          </div>
          {taxCodeMode === "custom" && (
            <>
              <NumIn label="Personal Allowance (£)" value={customPA} onChange={setCustomPA}/>
              <div style={{fontSize:10,color:"#8aabb8",marginTop:-10,marginBottom:8,paddingLeft:2}}>
                Enter the allowance from your code e.g. code 1000L = £10,000. PA taper not applied.
              </div>
            </>
          )}
          {taxCodeMode === "br" && (
            <div style={{fontSize:10,color:"#f59e0b",marginBottom:8,lineHeight:1.5}}>
              BR: all income taxed at basic rate (20%) with no Personal Allowance.
              Typically used for second jobs or when HMRC has not issued a code.
            </div>
          )}
          {taxCodeMode === "d0" && (
            <div style={{fontSize:10,color:"#f59e0b",marginBottom:8,lineHeight:1.5}}>
              D0: all income taxed at higher rate (40%) with no Personal Allowance.
              Used for second jobs where income already uses basic rate band.
            </div>
          )}
          {taxCodeMode === "d1" && (
            <div style={{fontSize:10,color:"#ef4444",marginBottom:8,lineHeight:1.5}}>
              D1: all income taxed at additional rate (45%) with no Personal Allowance.
            </div>
          )}
          <SecHead>Working Pattern</SecHead>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{marginBottom:14}}>
              <label style={LABEL_S}>Hours/Week</label>
              <HoursInput value={hours} onChange={setHours}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={LABEL_S}>Days/Week</label>
              <select value={days} onChange={e=>setDays(+e.target.value)} style={SEL_S}>
                {[1,2,3,4,5,6,7].map(d=><option key={d} value={d}>{d} day{d>1?"s":""}</option>)}
              </select>
            </div>
          </div>

          <div style={{fontSize:10,color:"#5a7a94",lineHeight:1.5,marginTop:12,paddingTop:12,borderTop:"1px solid #0f1e2d"}}>
            This calculator is for illustrative purposes only and does not constitute financial, tax or investment advice. Results are estimates based on {TAX_YEAR} HMRC rates and your individual circumstances may differ. Tax rules are subject to change. You should seek independent professional advice before making any financial decisions. This tool is not regulated by the Financial Conduct Authority. We accept no liability for any loss arising from reliance on these results.
          </div>
        </div>

        {/* RIGHT — Results */}
        <div style={{padding:20,overflowY:"auto"}}>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:18,background:"#0b1520",borderRadius:10,padding:4,width:"fit-content"}}>
            {["summary","breakdown","allowances","employer","payslip"].map(tb=>(
              <button key={tb} onClick={()=>setTab(tb)} style={{
                padding:"7px 16px",borderRadius:7,border:"none",cursor:"pointer",
                background:tab===tb?"#1e2d3d":"transparent",
                color:tab===tb?"#e8f0ff":"#7a96b0",
                fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:tab===tb?600:400,
                textTransform:"capitalize",transition:"all 0.15s",
              }}>{tb}</button>
            ))}
          </div>

          {/* ── SUMMARY ── */}
          {tab==="summary"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

              <div style={card({display:"flex",alignItems:"center",gap:16})}>
                <Donut data={donutData} size={120}/>
                <div style={{flex:1}}>
                  {donutData.map((d,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:11,color:"#8a9cb8"}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:d.color}}>
                        {t.grossTotal>0?Math.round(d.value/t.grossTotal*100):0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card()}>
                <div style={sLbl}>Take-Home Periods</div>
                {[["Annual",t.netTotal],["Monthly",t.monthly],["Weekly",t.weekly],["Daily",t.daily,2],["Hourly",t.hourly,2]].map(([l,v,d=2])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #0f1e2d"}}>
                    <span style={{fontSize:12,color:"#8a9cb8"}}>{l}</span>
                    <span style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:"#c8d8e8",fontWeight:l==="Annual"?700:400}}>{fmt(v,d)}</span>
                  </div>
                ))}
              </div>

              <div style={card()}>
                <div style={sLbl}>Effective Rates</div>
                {[
                  ["Employment (IT + NI)", t.effEmp,  "#ef4444"],
                  ["Overall (all income)", t.effAll,  "#a78bfa"],
                  ["Marginal on Savings",  t.margSav, "#14b8a6"],
                  ["Marginal on Dividends",t.margDiv, "#f97316"],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #0f1e2d"}}>
                    <span style={{fontSize:12,color:"#8a9cb8"}}>{l}</span>
                    <span style={{fontSize:14,fontFamily:"'DM Mono',monospace",color:c,fontWeight:700}}>{pct(v)}</span>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {t.taxBenefits>0&&(
                  <div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.2)",borderRadius:14,padding:14}}>
                    <div style={{fontSize:11,color:"#fcd34d",fontWeight:600,marginBottom:4}}>📋 Taxable Benefits Active</div>
                    <div style={{fontSize:11,color:"#f59e0b",lineHeight:1.5}}>{fmt(t.taxBenefits)} added to taxable income. Tax is due on the benefit value — ensure this matches your P11D.</div>
                  </div>
                )}
                {t.paTaper>0&&(
                  <div style={{background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.2)",borderRadius:14,padding:16}}>
                    <div style={{fontSize:12,color:"#fca5a5",fontWeight:600,marginBottom:6}}>⚠ Personal Allowance Taper Active</div>
                    <div style={{fontSize:12,color:"#ef4444",lineHeight:1.6}}>
                      Income over £100,000.<br/>
                      PA reduced by <strong style={{fontFamily:"'DM Mono',monospace"}}>{fmt(t.paTaper)}</strong>.<br/>
                      Remaining PA: <strong style={{fontFamily:"'DM Mono',monospace"}}>{fmt(t.pa-t.blindExtra)}</strong>.<br/>
                      Marginal rate in taper zone: <strong>60%</strong>.
                    </div>
                  </div>
                )}
                {dividends>0&&(
                  <div style={{background:"rgba(249,115,22,.07)",border:"1px solid rgba(249,115,22,.2)",borderRadius:14,padding:14}}>
                    <div style={{fontSize:11,color:"#fdba74",fontWeight:600,marginBottom:4}}>📈 2026/27 Dividend Rate Increase</div>
                    <div style={{fontSize:11,color:"#f97316",lineHeight:1.5}}>
                      Basic: 8.75% → <strong>10.75%</strong> · Higher: 33.75% → <strong>35.75%</strong>
                    </div>
                  </div>
                )}
                {blind&&(
                  <div style={{background:"rgba(20,184,166,.07)",border:"1px solid rgba(20,184,166,.2)",borderRadius:14,padding:14}}>
                    <div style={{fontSize:11,color:"#5eead4",lineHeight:1.5}}>
                      👁 Blind Person's Allowance <strong style={{fontFamily:"'DM Mono',monospace"}}>£{BLIND_ALLOW.toLocaleString()}</strong> added.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BREAKDOWN ── */}
          {tab==="breakdown"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={card()}>
                <div style={sLbl}>Income & Deductions</div>
                <Row label="Employment Salary"   value={salary}   color="#c8d8e8" bold/>
                {bonus>0    &&<Row label="+ Bonus"          value={bonus}    color="#c8d8e8"/>}
                {dividends>0&&<Row label="+ Dividend Income" value={dividends} color="#fdba74"/>}
                {savings>0  &&<Row label="+ Savings Interest" value={savings}  color="#5eead4"/>}
                <Row label="Total Gross"        value={t.grossTotal} color="#e8f0ff" bold bg="rgba(255,255,255,.04)"/>
                <div style={{height:6}}/>
                {t.taxBenefits>0&&<Row label="+ Taxable Benefits" value={t.taxBenefits} color="#fdba74"
                  note="Added to taxable income before tax"/>}
                {t.c2w>0&&<Row label="− Cycle to Work" value={-t.c2w} color="#86efac"
                  fmtFn={v=>`-${fmt(-v)}`} note="Salary sacrifice — saves IT + NI"/>}
                {t.pensionDeducted>0&&<Row label="− Pension" value={-t.pensionDeducted} color="#f9a8d4"
                  fmtFn={v=>`-${fmt(-v)}`} note={pensionMethod==="Relief at Source"?"Personal contribution — no effect on tax or NI (HMRC adds 20% to pot)":pensionMethod}/>}
                {t.c2w>0 && <Row label="− Cycle to Work" value={-t.c2w} color="#86efac"
                  fmtFn={v=>`-${fmt(-v)}`} note="Salary sacrifice — saves IT + NI"/>}
                <Row label="− Income Tax" value={-t.totalIT} color="#93c5fd" fmtFn={v=>`-${fmt(-v)}`}/>
                <Row label="− National Insurance" value={-t.ni} color="#fcd34d" fmtFn={v=>`-${fmt(-v)}`}
                  note={!payNI?"Exempt":undefined}/>
                {t.sl>0&&<Row label="− Student Loan" value={-t.sl} color="#c4b5fd" fmtFn={v=>`-${fmt(-v)}`}/>}
                
                {t.taxBenefits>0&&<Row label="+ Taxable Benefits" value={t.taxBenefits} color="#f59e0b" note="Added to taxable income — non-cash"/>}
                <div style={{height:6}}/>
                <Row label="NET TAKE-HOME" value={t.netTotal} color="#22c55e" bold bg="rgba(34,197,94,.08)"/>
              </div>

              <div style={card()}>
                <div style={sLbl}>Income Tax Breakdown</div>
                <div style={{fontSize:10,color:"#8aaac8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Employment{bonus>0?" + Bonus":""}</div>
                <Row label={region==="Scotland"?"  @ Starter/Basic/Int/Higher/Advanced":"  @ Basic Rate (20%)"} value={t.empIT} color="#93c5fd"/>
                {region!=="Scotland"&&<>
                  <Row label="  @ Higher Rate (40%)" value={t.empIT===0?0:0} color="#93c5fd" fmtFn={()=>"—"}/>
                </>}
                {marriage==="giving"&&<Row label="  Marriage Allowance Credit" value={-252} color="#22c55e" fmtFn={v=>`-${fmt(-v)}`}/>}
                <Row label="Employment Tax" value={t.empIT} color="#3b82f6" bold bg="rgba(59,130,246,.08)"/>
                {savings>0&&<>
                  <div style={{height:8}}/>
                  <div style={{fontSize:10,color:"#8aaac8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Savings Interest</div>
                  <Row label={`Covered at 0% (PA/Starting Rate)`} value={t.savZero} color="#5eead4" fmtFn={v=>`${fmt(v)} @ 0%`}/>
                  <Row label={`Covered at 0% (PSA £${t.psa.toLocaleString()})`} value={t.savPSA} color="#5eead4" fmtFn={v=>`${fmt(v)} @ 0%`}/>
                  <Row label="Taxable Savings" value={t.txSav} color="#14b8a6"/>
                  <Row label="Savings Tax" value={t.savIT} color="#14b8a6" bold bg="rgba(20,184,166,.08)"/>
                </>}
                {dividends>0&&<>
                  <div style={{height:8}}/>
                  <div style={{fontSize:10,color:"#8aaac8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Dividends (2026/27 rates)</div>
                  <Row label={`Allowance (£${DIV_ALLOW})`} value={Math.min(dividends,DIV_ALLOW)} color="#fdba74" fmtFn={v=>`${fmt(v)} @ 0%`}/>
                  <Row label="Taxable Dividends" value={t.txDiv} color="#f97316"/>
                  <Row label="Dividend Tax" value={t.divIT} color="#f97316" bold bg="rgba(249,115,22,.08)"
                    note="10.75% / 35.75% / 39.35%"/>
                </>}
                <div style={{height:8}}/>
                <Row label="Total Income Tax" value={t.totalIT} color="#ef4444" bold bg="rgba(239,68,68,.08)"/>
              </div>
            </div>
          )}

          {/* ── ALLOWANCES ── */}
          {tab==="allowances"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={card()}>
                <div style={sLbl}>Personal Allowance</div>
                <Row label="Standard PA" value={PA_STD} color="#c8d8e8"/>
                {blind&&<Row label="+ Blind Person's Allowance" value={BLIND_ALLOW} color="#5eead4" note="2026/27: £3,250"/>}
                {marriage==="receiving"&&<Row label="+ Marriage Allowance" value={MARRIAGE_TRANS} color="#22c55e"/>}
                <Row label="PA Taper" value={-t.paTaper}
                  color={t.paTaper>0?"#ef4444":"#6a8aaa"}
                  fmtFn={v=>t.paTaper>0?`-${fmt(t.paTaper)}`:"£0.00"}
                  note={t.paTaper>0?"£1 per £2 over £100,000":undefined}/>
                <Row label="Effective Personal Allowance" value={t.pa} color="#22c55e" bold bg="rgba(34,197,94,.08)"/>
                {t.grossTotal>100000&&t.grossTotal<ADDL_THRESH&&(
                  <div style={{fontSize:11,color:"#f59e0b",background:"rgba(245,158,11,.08)",borderRadius:8,padding:"8px 10px",marginTop:8}}>
                    ⚡ In the 60% effective marginal rate zone. Pension contributions can reduce this.
                  </div>
                )}
              </div>
              <div style={card()}>
                <div style={sLbl}>Savings & Dividends</div>
                <Row label="Starting Rate Band" value={t.srb} color="#5eead4" note="0% if non-savings income is low"/>
                <Row label="Personal Savings Allowance" value={t.psa} color="#5eead4"
                  note={t.psa===1000?"Basic rate taxpayer":t.psa===500?"Higher rate taxpayer":"Additional rate — no PSA"}/>
                <Row label="Savings at 0%" value={t.savZero+t.savPSA} color="#5eead4"/>
                <Row label="Taxable Savings" value={t.txSav}
                  color={t.txSav>0?"#f59e0b":"#6a8aaa"} bold={t.txSav>0}
                  bg={t.txSav>0?"rgba(245,158,11,.08)":"transparent"}/>
                <div style={{height:10}}/>
                <Row label="Dividend Allowance" value={DIV_ALLOW} color="#fdba74" note="2026/27: £500"/>
                <Row label="Taxable Dividends" value={t.txDiv}
                  color={t.txDiv>0?"#f97316":"#6a8aaa"} bold={t.txDiv>0}
                  bg={t.txDiv>0?"rgba(249,115,22,.08)":"transparent"}/>
              </div>
              <div style={{...card(),gridColumn:"1 / -1"}}>
                <div style={sLbl}>2026/27 Tax Bands — {region}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
                  {(region==="Scotland"?[
                    ["Personal Allow.","£0 – £12,570","0%","#22c55e"],
                    ["Starter Rate","£12,571 – £16,537","19%","#14b8a6"],
                    ["Basic Rate","£16,538 – £29,526","20%","#3b82f6"],
                    ["Intermediate","£29,527 – £43,662","21%","#6366f1"],
                    ["Higher Rate","£43,663 – £75,000","42%","#f59e0b"],
                    ["Advanced","£75,001 – £125,140","45%","#f97316"],
                    ["Top Rate","Over £125,140","48%","#ef4444"],
                  ]:[
                    ["Personal Allow.","£0 – £12,570","0%","#22c55e"],
                    ["Basic Rate","£12,571 – £50,270","20%","#3b82f6"],
                    ["Higher Rate","£50,271 – £125,140","40%","#f59e0b"],
                    ["Additional Rate","Over £125,140","45%","#ef4444"],
                    ["Dividend Basic","Above £500 allow.","10.75%","#f97316"],
                    ["Dividend Higher","Higher band","35.75%","#f97316"],
                    ["Dividend Addl","Additional band","39.35%","#f97316"],
                  ]).map(([n,r,rt,c])=>(
                    <div key={n} style={{background:"rgba(255,255,255,.03)",borderRadius:10,padding:"10px 12px",borderLeft:`3px solid ${c}`}}>
                      <div style={{fontSize:9,color:"#7a96b0",marginBottom:2}}>{n}</div>
                      <div style={{fontSize:10,color:"#8a9cb8",marginBottom:4}}>{r}</div>
                      <div style={{fontSize:17,fontFamily:"'DM Mono',monospace",color:c,fontWeight:700}}>{rt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EMPLOYER ── */}
          {tab==="employer"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={card()}>
                <div style={sLbl}>Employer NI (informational)</div>
                <div style={{fontSize:12,color:"#8aaac0",marginBottom:12,lineHeight:1.6}}>
                  Employer NI is paid by your employer on top of your salary. It does not reduce your take-home pay but represents the true cost of your employment.
                </div>
                <Row label="Secondary Threshold" value={EMP_NI_SEC} color="#c8d8e8" note="2026/27: £5,000"/>
                <Row label="Employer NI Rate" value={0} color="#c8d8e8" fmtFn={()=>"15%"}/>
                <Row label="Employer NI Contribution" value={t.employerNI} color="#f59e0b" bold bg="rgba(245,158,11,.08)"/>
                <div style={{height:10}}/>
                <Row label="Your Gross Salary"      value={salary}              color="#c8d8e8"/>
                <Row label="+ Employer NI"          value={t.employerNI}        color="#f59e0b" fmtFn={v=>`+${fmt(v)}`}/>
                <Row label="Total Employment Cost"  value={salary+t.employerNI} color="#e8f0ff" bold bg="rgba(255,255,255,.04)"/>
              </div>
              <div style={card()}>
                <div style={sLbl}>Cost vs Take-Home</div>
                <div style={{fontSize:11,color:"#8aaac0",marginBottom:12,lineHeight:1.5}}>
                  For every £1 your employer spends employing you:
                </div>
                {[
                  ["Take-Home",    t.netTotal,        "#22c55e"],
                  ["Income Tax",   t.totalIT,         "#3b82f6"],
                  ["Employee NI",  t.ni,              "#f59e0b"],
                  ["Employer NI",  t.employerNI,      "#fb923c"],
                  ["Pension",      t.pensionDeducted, "#f472b6"],
                  ["Student Loan", t.sl,              "#a78bfa"],
                ].filter(([,v])=>v>0).map(([l,v,c])=>{
                  const total=salary+t.employerNI; const w=total>0?v/total*100:0;
                  return(
                    <div key={l} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:11,color:"#8a9cb8"}}>{l}</span>
                        <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:c}}>{fmt(v)} ({w.toFixed(0)}%)</span>
                      </div>
                      <div style={{height:5,background:"#0f1e2d",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${w}%`,background:c,borderRadius:3,transition:"width 0.4s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        {tab==="payslip"&&(
          <div style={{fontFamily:"Arial,sans-serif",maxWidth:640,margin:"0 auto"}}>
            {/* Employee name and period inputs */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontSize:10,color:"#8aabb8",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Employee Name (optional)</div>
                <input value={psName} onChange={e=>setPSName(e.target.value)}
                  placeholder="e.g. J Smith"
                  style={{width:"100%",background:"#0d1e2e",border:"1px solid #1e2d3d",borderRadius:6,
                    padding:"8px 10px",color:"#e8f0ff",fontSize:12,boxSizing:"border-box"}}/>
              </div>
              <div style={{minWidth:120}}>
                <div style={{fontSize:10,color:"#8aabb8",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tax Month</div>
                <select value={psMonth} onChange={e=>setPSMonth(+e.target.value)}
                  style={{background:"#0d1e2e",border:"1px solid #1e2d3d",borderRadius:6,
                    padding:"8px 10px",color:"#e8f0ff",fontSize:12,width:"100%"}}>
                  {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map((m,i)=>(
                    <option key={i+1} value={i+1}>{m} — Month {i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payslip card */}
            <div style={{background:"#FFFFFF",borderRadius:10,overflow:"hidden",
              boxShadow:"0 4px 24px rgba(0,0,0,0.3)",color:"#1a1a2e"}}>

              {/* Header */}
              <div style={{background:"#0F3460",padding:"16px 20px",display:"flex",
                justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"#FFFFFF",fontWeight:700,fontSize:16,letterSpacing:0.5}}>WAGELAB</div>
                  <div style={{color:"#93c5fd",fontSize:10,marginTop:2}}>ILLUSTRATIVE PAYSLIP — NOT AN OFFICIAL DOCUMENT</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:"#e8f0ff",fontSize:11,fontWeight:600}}>
                    Tax Period {psMonth} — 2026/27
                  </div>
                  <div style={{color:"#93c5fd",fontSize:10,marginTop:1}}>
                    {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"][psMonth-1]} 2026
                  </div>
                </div>
              </div>

              {/* Employee info */}
              <div style={{background:"#f0f7ff",padding:"10px 20px",display:"flex",
                justifyContent:"space-between",borderBottom:"1px solid #dde6f5",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:"#6b7a99",textTransform:"uppercase",letterSpacing:"0.06em"}}>Employee</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#0F3460"}}>{psName||"— Not specified —"}</div>
                </div>
                <div style={{display:"flex",gap:24}}>
                  <div>
                    <div style={{fontSize:9,color:"#6b7a99",textTransform:"uppercase",letterSpacing:"0.06em"}}>Tax Code</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#0F3460",fontFamily:"monospace"}}>
                      {taxCodeMode==="standard"?"1257L":taxCodeMode==="br"?"BR":taxCodeMode==="d0"?"D0":taxCodeMode==="d1"?"D1":`${Math.round(customPA/10)}L`}
                      {region==="Scotland"?" S":""}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:"#6b7a99",textTransform:"uppercase",letterSpacing:"0.06em"}}>NI Category</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#0F3460",fontFamily:"monospace"}}>{payNI?"A":"X"}</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:"#6b7a99",textTransform:"uppercase",letterSpacing:"0.06em"}}>Annual Salary</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#0F3460",fontFamily:"monospace"}}>{fmt(salary,0)}</div>
                  </div>
                </div>
              </div>

              {/* Payments section */}
              <div style={{padding:"14px 20px 0"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:4}}>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5"}}>PAYMENTS</div>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5",textAlign:"right"}}>AMOUNT</div>
                  <div style={{fontSize:11,color:"#334155",paddingTop:6}}>Basic Salary</div>
                  <div style={{fontSize:11,color:"#334155",paddingTop:6,textAlign:"right",fontFamily:"monospace"}}>{fmt(salary/12)}</div>
                  {bonus>0&&<><div style={{fontSize:11,color:"#334155"}}>Bonus</div><div style={{fontSize:11,color:"#334155",textAlign:"right",fontFamily:"monospace"}}>{fmt(bonus)}</div></>}
                  {taxBenefits>0&&<><div style={{fontSize:11,color:"#6b7a99"}}>Taxable Benefits (BIK)</div><div style={{fontSize:11,color:"#6b7a99",textAlign:"right",fontFamily:"monospace"}}>{fmt(taxBenefits/12)}</div></>}
                  <div style={{fontSize:11,fontWeight:700,color:"#0F3460",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4}}>Gross Pay</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#0F3460",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4,textAlign:"right",fontFamily:"monospace"}}>{fmt((salary+bonus)/12)}</div>
                </div>
              </div>

              {/* Deductions */}
              <div style={{padding:"14px 20px 0"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:4}}>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5"}}>GROSS DEDUCTIONS</div>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5",textAlign:"right"}}>AMOUNT</div>
                  {t.pensionAmt>0&&<>
                    <div style={{fontSize:11,color:"#334155",paddingTop:6}}>
                      Employee Pension {pensionMethod==="Salary Sacrifice"?"(Salary Sacrifice)":pensionMethod==="Net Pay Arrangement"?"(Net Pay)":"(Relief at Source)"}
                    </div>
                    <div style={{fontSize:11,color:"#334155",paddingTop:6,textAlign:"right",fontFamily:"monospace"}}>
                      {fmt(t.pensionDeducted/12)}
                    </div>
                  </>}
                  {cycleToWork>0&&<>
                    <div style={{fontSize:11,color:"#334155"}}>Cycle to Work Scheme</div>
                    <div style={{fontSize:11,color:"#334155",textAlign:"right",fontFamily:"monospace"}}>{fmt(cycleToWork/12)}</div>
                  </>}
                  <div style={{fontSize:11,fontWeight:700,color:"#0F3460",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4}}>Total Gross Deductions</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#0F3460",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4,textAlign:"right",fontFamily:"monospace"}}>{fmt((t.pensionDeducted+cycleToWork)/12)}</div>
                </div>
              </div>

              {/* Statutory deductions */}
              <div style={{padding:"14px 20px 0"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:4}}>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5"}}>STATUTORY DEDUCTIONS</div>
                  <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingBottom:4,borderBottom:"1px solid #e5eaf5",textAlign:"right"}}>AMOUNT</div>
                  <div style={{fontSize:11,color:"#334155",paddingTop:6}}>Income Tax</div>
                  <div style={{fontSize:11,color:"#ef4444",paddingTop:6,textAlign:"right",fontFamily:"monospace"}}>{fmt(t.totalIT/12)}</div>
                  {payNI&&<>
                    <div style={{fontSize:11,color:"#334155"}}>Employee National Insurance</div>
                    <div style={{fontSize:11,color:"#ef4444",textAlign:"right",fontFamily:"monospace"}}>{fmt(t.ni/12)}</div>
                  </>}
                  {t.sl>0&&<>
                    <div style={{fontSize:11,color:"#334155"}}>Student Loan Repayment</div>
                    <div style={{fontSize:11,color:"#ef4444",textAlign:"right",fontFamily:"monospace"}}>{fmt(t.sl/12)}</div>
                  </>}
                  <div style={{fontSize:11,fontWeight:700,color:"#0F3460",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4}}>Total Statutory Deductions</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#ef4444",paddingTop:6,borderTop:"1px solid #e5eaf5",marginTop:4,textAlign:"right",fontFamily:"monospace"}}>{fmt((t.totalIT+t.ni+t.sl)/12)}</div>
                </div>
              </div>

              {/* Net Pay */}
              <div style={{margin:"16px 20px",background:"#0F3460",borderRadius:8,padding:"14px 20px",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:"#93c5fd",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>NET PAY</div>
                <div style={{color:"#4ade80",fontSize:22,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
                  {fmt(t.monthly,2)}
                </div>
              </div>

              {/* YTD section */}
              <div style={{padding:"0 20px 16px"}}>
                <div style={{fontSize:9,color:"#6b7a99",fontWeight:700,textTransform:"uppercase",
                  letterSpacing:"0.08em",paddingBottom:6,borderBottom:"1px solid #e5eaf5",marginBottom:8}}>
                  YEAR TO DATE (Month {psMonth})
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[
                    ["Gross Pay",fmt((salary+bonus)/12*psMonth)],
                    ["Income Tax",fmt(t.totalIT/12*psMonth)],
                    ["National Insurance",fmt(t.ni/12*psMonth)],
                    ["Pension",fmt(t.pensionDeducted/12*psMonth)],
                    t.sl>0?["Student Loan",fmt(t.sl/12*psMonth)]:null,
                    ["Net Take-Home",fmt(t.monthly*psMonth)],
                  ].filter(Boolean).map(([label,val])=>(
                    <div key={label} style={{background:"#f7f9ff",borderRadius:6,padding:"8px 10px"}}>
                      <div style={{fontSize:8,color:"#8899aa",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>{label}</div>
                      <div style={{fontSize:11,fontWeight:600,color:"#0F3460",fontFamily:"monospace"}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{background:"#fef9c3",padding:"8px 20px",borderTop:"1px solid #fde68a"}}>
                <div style={{fontSize:9,color:"#92400e",lineHeight:1.5}}>
                  ⚠ This is an illustrative payslip generated by WageLab for estimation purposes only.
                  It is not an official payslip and should not be used for any legal, financial or HMRC purpose.
                  Figures are annualised estimates. Actual payslip figures may vary. www.wagelab.co.uk
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
