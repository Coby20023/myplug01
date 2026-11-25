/* ====== EDIT THESE ====== */
const CONFIG = {
  name: "MY PLUG 021",
  whatsapp: "265997921125", // 0997921125 in international format (Malawi +265)
  facebook: "https://www.facebook.com/search/top?q=leonard%20jnr", // replace with Leonard Jnr's profile link
  supabaseUrl: "https://supabase.com/dashboard/project/ceimsxfjgwssgyraalww/settings/api-keys",       // e.g. https://abcdxyz.supabase.co
  supabaseKey: "sb_publishable_m3CvgynHQOK0fXFbvteTVw_KF3k5dPs"    // publishable (or anon) key: safe to be public
};
/* ======================== */
const sb = (window.supabase && CONFIG.supabaseUrl.startsWith("http"))
  ? window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey) : null;
const DEFAULT = {
  settings: { marquee: ["New drops every week","Order on WhatsApp","Fast delivery","Quality you can trust"], whatsapp: CONFIG.whatsapp, facebook: CONFIG.facebook, currency: "MK", tagline: "Fresh finds, fair prices. Pick it, message us, get it." },
  products: [
    {id:1,name:"Sample Sneakers",price:45000,category:"Shoes",description:"Replace me from the admin dashboard.",image:"",stock:true,tag:"New"},
    {id:2,name:"Sample Phone Case",price:5000,category:"Phones",description:"Edit or delete this sample product.",image:"",stock:true,tag:""},
    {id:3,name:"Sample Hoodie",price:25000,category:"Clothes",description:"Add your real items in admin.",image:"",stock:false,tag:""}
  ]
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = (n, s) => (s.currency || "MK") + " " + Number(n).toLocaleString();
const waLink = (num, text) => "https://wa.me/" + num + "?text=" + encodeURIComponent(text || "");
async function fetchPublished() {
  if (sb) {
    try {
      const [p, s] = await Promise.all([
        sb.from("products").select("*").order("created_at", { ascending: false }),
        sb.from("settings").select("data").eq("id", 1).maybeSingle()
      ]);
      if (p.error) throw p.error;
      return { settings: { ...DEFAULT.settings, ...((s.data && s.data.data) || {}) }, products: p.data };
    } catch (e) {
      console.error("Supabase error:", e);
      return { settings: DEFAULT.settings, products: [], error: true };
    }
  }
  return structuredClone(DEFAULT);
}
