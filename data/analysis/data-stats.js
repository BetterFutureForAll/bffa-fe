const { data: raw } = require('../../src/assets/spi.json');

console.log('raw data', raw.length)
let noHeader = raw.filter(({ spiyear }) => spiyear !== 'SPI \r\nyear');
console.log('w/o header row', noHeader.length)
let noSummary = noHeader.filter(({ country }) => country !== 'World');
console.log('w/o header or World summary', noSummary.length);
console.log('World summaries', noHeader.length - noSummary.length);

let stats = noSummary.reduce((acc, { spiyear }) => {
    if(!acc[spiyear]) acc[spiyear] = 1;
    else acc[spiyear]++;
    return acc
}, {});

console.log(stats);
console.log('expected new rows "raw data length + 196 + 1 new world summary + 1 dup summary row + 1 header row"', raw.length + 196 + 1 + 1 + 1);

const currentSchema = raw[0];
const currentKeys = Object.keys(currentSchema);
const rawNewKeys = 'rank_score_spi	country	spicountrycode	spiyear	status	score_spi	score_bhn	score_fow	score_opp	score_nbmc	score_ws	score_sh	score_ps	score_abk	score_aic	score_hw	score_eq	score_pr	score_pfc	score_incl	score_aae	nbmc_childstunt	nbmc_infectiousdaly	nbmc_undernourish	nbmc_dietlowfruitveg	nbmc_childmort	nbmc_matmort	ws_watersat	ws_washmort	ws_sanitation	ws_water	sh_affhousingdissat	sh_hhairpolldalys	sh_electricity	sh_cleanfuels	ps_moneystolen	ps_safewalkalone	ps_transport	ps_intpersvioldaly	ps_intimpartnviol	abk_qualeduc	abk_propnoeduc	abk_totprimenrol	abk_popsomesec	abk_educpar	aic_mobiles	aic_internet	aic_eparticip	aic_worldpressfreed	hw_qualityhealth	hw_qualhealthsat	hw_lifex60	hw_mort15to50	hw_univhealthcov	eq_pm25	eq_airpolldalys	eq_leadexpdalys	eq_spindex	eq_recycle	pr_equalprotect	pr_peaceassemb	pr_eqbeflaw	pr_polrights	pfc_lifechoicedissat	pfc_vulnemploy	pfc_neet	pfc_corruption	pfc_earlymarriage	pfc_contracept	incl_equalaccess	incl_gayslesb	incl_countonhelp	incl_discrimin	aae_acadfreed	aae_femterteduc	aae_tertschlife	aae_citabledocs	aae_qualuniversities	GDPpc';
const newKeys = rawNewKeys.split(/\s+/);
const newKeySet = new Set(newKeys);

console.log('key lengths: new:', newKeys.length, 'current:', currentKeys.length);

console.log('new keys not in current keys');
for(let i = 0; i < newKeys.length; i++) {
    if(!currentSchema.hasOwnProperty(newKeys[i])) {
        console.log(i.toString().padEnd(3, ' '), newKeys[i])
    }
}

console.log('current keys not in new keys');
for(let i = 0; i < currentKeys.length; i++) {
    if(!newKeySet.has(currentKeys[i])) {
        console.log(i.toString().padEnd(3, ' '), currentKeys[i])
    }
}
